from invoice_template.models import Template
import json

def clean_number_string(number_str):
    """Clean up a number string to remove unwanted characters for conversion."""
    # Remove any currency symbols and commas
    number_str = number_str.replace('$', '').replace(',', '').strip()
    return number_str

def map_field(data, mapping, data_type=None):
    if isinstance(mapping, float) or isinstance(mapping, int):
        return mapping
    keys = mapping.split('.')
    current_value = data
    for key in keys:
        current_value = current_value.get(key, '')
    
    # Clean the current_value if it's a string and needs to be converted to a number
    if isinstance(current_value, str):
        current_value = clean_number_string(current_value)
    
    if data_type == 'int':
        return int(current_value) if current_value else 0
    elif data_type == 'float':
        return float(current_value) if current_value else 0.0
    return current_value

def format_invoice(invoice, supplier_id):
    template_mapping = Template.objects.get(supplier=supplier_id)
    mapping = json.loads(template_mapping.mapping)
    
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
    print(formatted_invoice)
    return formatted_invoice
