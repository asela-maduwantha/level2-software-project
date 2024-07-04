from invoice_template.models import Template
from .serializers import InvoiceSerializer
import json
from datetime import datetime
import logging
from typing import Union, Dict, Any, List
from uuid import UUID
from search.elasticsearch_utils import async_index_invoices
import xmltodict
from django.core.files.uploadedfile import InMemoryUploadedFile
from celery import shared_task


logger = logging.getLogger(__name__)

def clean_number_string(number_str: str) -> str:
    return number_str.replace('$', '').replace(',', '').strip()

def map_field(data: Dict[str, Any], mapping: Union[str, float, int], data_type: str = None) -> Union[str, int, float]:
    if isinstance(mapping, (float, int)):
        return mapping
    keys = mapping.split('.')
    current_value = data
    for key in keys:
        current_value = current_value.get(key, '')
    
    if isinstance(current_value, str):
        current_value = clean_number_string(current_value)
    
    try:
        if data_type == 'int':
            return int(current_value) if current_value else 0
        elif data_type == 'float':
            return float(current_value) if current_value else 0.0
        return current_value
    except ValueError:
        logger.warning(f"Failed to convert {current_value} to {data_type}")
        return 0 if data_type in ('int', 'float') else ''
    

def convert_date_format(date_str: str) -> str:
    date_formats = ["%m/%d/%Y", "%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"]
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    logger.warning(f"Unable to parse date: {date_str}")
    return 'N/A'


def parse_invoice_input(request):
    source_invoice = request.data.get('source_invoice')
    
    if isinstance(source_invoice, str):
        if source_invoice.strip().startswith('<'):
            return xmltodict.parse(source_invoice)
        else:
            return json.loads(source_invoice)
    elif isinstance(source_invoice, InMemoryUploadedFile):
        if source_invoice.name.endswith('.xml'):
            return xmltodict.parse(source_invoice.read().decode('utf-8'))
        else:
            return json.load(source_invoice)
    else:
        raise ValueError("Invalid invoice input format")
    
@shared_task
def process_csv_chunk(chunk, organization_id: str, supplier_id: str):
    organization_id = UUID(organization_id)
    supplier_id = UUID(supplier_id)
    invoices = []
    for row in chunk:
        invoice_data = map_csv_row_to_invoice(row, organization_id, supplier_id)
        serializer = InvoiceSerializer(data=invoice_data)
        if serializer.is_valid():
            invoice = serializer.save()
            invoices.append(invoice)
            async_index_invoices([invoice_data['internal_format']], invoice.issuer, invoice.recipient)
        else:
            logger.error(f"Invalid invoice data: {serializer.errors}")
    return len(invoices)


def format_invoice(invoice: Dict[str, Any], supplier_id: UUID) -> Dict[str, Any]:
    try:
        template_mapping = Template.objects.get(supplier=supplier_id)
        mapping = json.loads(template_mapping.mapping)
    except Template.DoesNotExist:
        logger.error(f"No template found for supplier_id: {supplier_id}")
        raise ValueError(f"No template found for supplier_id: {supplier_id}")
    
    formatted_invoice = {
        "Invoice": {
            "Header": {
                "InvoiceNumber": map_field(invoice, mapping.get("InvoiceNumber", "")),
                "InvoiceDate": map_field(invoice, mapping.get("InvoiceDate", "")),
                "DueDate": map_field(invoice, mapping.get("DueDate", "")),
                "Currency": map_field(invoice, mapping.get("Currency", ""))
            },
            "Seller": {
                "CompanyName": map_field(invoice, mapping.get("Seller.CompanyName", "")),
                "Address": {
                    "Street": map_field(invoice, mapping.get("Seller.Address.Street", "")),
                    "City": map_field(invoice, mapping.get("Seller.Address.City", "")),
                    "State": map_field(invoice, mapping.get("Seller.Address.State", "")),
                    "ZipCode": map_field(invoice, mapping.get("Seller.Address.ZipCode", "")),
                    "Country": map_field(invoice, mapping.get("Seller.Address.Country", ""))
                },
                "Contact": {
                    "Name": map_field(invoice, mapping.get("Seller.Contact.Name", "")),
                    "Phone": map_field(invoice, mapping.get("Seller.Contact.Phone", "")),
                    "Email": map_field(invoice, mapping.get("Seller.Contact.Email", ""))
                }
            },
            "Buyer": {
                "CompanyName": map_field(invoice, mapping.get("Buyer.CompanyName", "")),
                "Address": {
                    "Street": map_field(invoice, mapping.get("Buyer.Address.Street", "")),
                    "City": map_field(invoice, mapping.get("Buyer.Address.City", "")),
                    "State": map_field(invoice, mapping.get("Buyer.Address.State", "")),
                    "ZipCode": map_field(invoice, mapping.get("Buyer.Address.ZipCode", "")),
                    "Country": map_field(invoice, mapping.get("Buyer.Address.Country", ""))
                },
                "Contact": {
                    "Name": map_field(invoice, mapping.get("Buyer.Contact.Name", "")),
                    "Phone": map_field(invoice, mapping.get("Buyer.Contact.Phone", "")),
                    "Email": map_field(invoice, mapping.get("Buyer.Contact.Email", ""))
                }
            },
            "Items": [
                {
                    "Description": map_field(item, mapping["Items.List"][1]["Description"]),
                    "Quantity": map_field(item, mapping["Items.List"][1]["Quantity"], 'int'),
                    "UnitPrice": map_field(item, mapping["Items.List"][1]["UnitPrice"], 'float'),
                    "TotalPrice": map_field(item, mapping["Items.List"][1]["TotalPrice"], 'float')
                } for item in map_field(invoice, mapping["Items.List"][0])
            ],
            "Summary": {
                "Subtotal": map_field(invoice, mapping.get("Summary.Subtotal", 0.0), 'float'),
                "TaxRate": map_field(invoice, mapping.get("Summary.TaxRate", 0.0), 'float'),
                "TaxAmount": map_field(invoice, mapping.get("Summary.TaxAmount", 0.0), 'float'),
                "TotalAmount": map_field(invoice, mapping.get("Summary.TotalAmount", 0.0), 'float'),
                "Discount": map_field(invoice, mapping.get("Summary.Discount", 0.0), 'float')
            },
            "PaymentInstructions": {
                "BankName": map_field(invoice, mapping.get("PaymentInstructions.BankName", "")),
                "AccountNumber": map_field(invoice, mapping.get("PaymentInstructions.AccountNumber", "")),
                "RoutingNumber": map_field(invoice, mapping.get("PaymentInstructions.RoutingNumber", "")),
                "SWIFT": map_field(invoice, mapping.get("PaymentInstructions.SWIFT", ""))
            },
            "Notes": {
                "Note": map_field(invoice, mapping.get("Notes.Note", ""))
            }
        }
    }
    
    return formatted_invoice


def map_csv_row_to_invoice(row: Dict[str, str], organization_id: UUID, supplier_id: UUID) -> Dict[str, Any]:
    converted_invoice = {
        "Invoice": {
            "Header": {
                "InvoiceNumber": row.get('InvoiceNumber') or 'N/A',
                "InvoiceDate": convert_date_format(row.get('InvoiceDate')) if row.get('InvoiceDate') else 'N/A',
                "DueDate": convert_date_format(row.get('DueDate')) if row.get('DueDate') else 'N/A',
                "Currency": row.get('Currency') or 'N/A'
            },
            "Seller": {
                "CompanyName": row.get('SellerCompanyName') or 'N/A',
                "Address": {
                    "Street": row.get('SellerStreet') or 'N/A',
                    "City": row.get('SellerCity') or 'N/A',
                    "State": row.get('SellerState') or 'N/A',
                    "ZipCode": row.get('SellerZipCode') or 'N/A',
                    "Country": row.get('SellerCountry') or 'N/A'
                },
                "Contact": {
                    "Name": row.get('SellerContactName') or 'N/A',
                    "Phone": row.get('SellerContactPhone') or 'N/A',
                    "Email": row.get('SellerContactEmail') or 'N/A'
                }
            },
            "Buyer": {
                "CompanyName": row.get('BuyerCompanyName') or 'N/A',
                "Address": {
                    "Street": row.get('BuyerStreet') or 'N/A',
                    "City": row.get('BuyerCity') or 'N/A',
                    "State": row.get('BuyerState') or 'N/A',
                    "ZipCode": row.get('BuyerZipCode') or 'N/A',
                    "Country": row.get('BuyerCountry') or 'N/A'
                },
                "Contact": {
                    "Name": row.get('BuyerContactName') or 'N/A',
                    "Phone": row.get('BuyerContactPhone') or 'N/A',
                    "Email": row.get('BuyerContactEmail') or 'N/A'
                }
            },
            "Items": [
                {
                    "Description": row.get('ItemDescription') or 'N/A',
                    "Quantity": int(row.get('ItemQuantity', '0') or '0'),
                    "UnitPrice": float(row.get('ItemUnitPrice', '0.0') or '0.0'),
                    "TotalPrice": float(row.get('ItemTotalPrice', '0.0') or '0.0')
                }
            ],
            "Summary": {
                "Subtotal": float(row.get('InvoiceSubtotal', '0.0') or '0.0'),
                "TaxRate": float(row.get('InvoiceTaxRate', '0.0') or '0.0'),
                "TaxAmount": float(row.get('InvoiceTaxAmount', '0.0') or '0.0'),
                "TotalAmount": float(row.get('InvoiceTotalAmount', '0.0') or '0.0'),
                "Discount": float(row.get('InvoiceDiscount', '0.0') or '0.0')
            },
            "PaymentInstructions": {
                "BankName": row.get('BankName') or 'N/A',
                "AccountNumber": row.get('AccountNumber') or 'N/A',
                "RoutingNumber": row.get('RoutingNumber') or 'N/A',
                "SWIFT": row.get('SWIFT') or 'N/A'
            },
            "Notes": {
                "Note": row.get('InvoiceNote') or 'N/A'
            }
        }
    }

    invoice_data = {
        'issuer': supplier_id,
        'recipient': organization_id,
        'source_format': json.dumps(row),
        'internal_format': json.dumps(converted_invoice),
    }
    print(converted_invoice)
    return invoice_data

