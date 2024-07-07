from elasticsearch import Elasticsearch
from elasticsearch_dsl import Document, Date, Integer, Keyword, Text, Float, Nested, InnerDoc
from datetime import datetime
import json
import threading

# Elasticsearch client
es = Elasticsearch(['http://43.204.122.107:9200'])

class AddressDocument(InnerDoc):
    street = Text()
    city = Text()
    state = Text()
    zip_code = Keyword()
    country = Text()

class ContactDocument(InnerDoc):
    name = Text()
    phone = Keyword()
    email = Keyword()

class CompanyDocument(InnerDoc):
    company_name = Text()
    address = Nested(AddressDocument)
    contact = Nested(ContactDocument)

class ItemDocument(InnerDoc):
    description = Text()
    quantity = Integer()
    unit_price = Float()
    total_price = Float()

class SummaryDocument(InnerDoc):
    subtotal = Float()
    tax_rate = Float()
    tax_amount = Float()
    total_amount = Float()
    discount = Float()

class PaymentInstructionsDocument(InnerDoc):
    bank_name = Text()
    account_number = Keyword()
    routing_number = Keyword()
    swift = Keyword()

class NotesDocument(InnerDoc):
    note = Text()

class InvoiceDocument(Document):
    invoice_number = Keyword()
    invoice_date = Date()
    due_date = Date()
    currency = Keyword()
    issuer = Keyword()  # Add issuer field
    recipient = Keyword()  # Add recipient field
    seller = Nested(CompanyDocument)
    buyer = Nested(CompanyDocument)
    items = Nested(ItemDocument)
    summary = Nested(SummaryDocument)
    payment_instructions = Nested(PaymentInstructionsDocument)
    notes = Nested(NotesDocument)

    class Index:
        name = 'invoices'

# Ensure the index is created
InvoiceDocument.init()

def index_invoice(invoice_json, supplier_id, organization_id):
    try:
        # Parse the JSON invoice to extract relevant fields
        invoice = json.loads(invoice_json)

        # Extract and convert dates
        invoice_date = datetime.strptime(invoice["Invoice"]["Header"]["InvoiceDate"], "%Y-%m-%d")
        due_date = datetime.strptime(invoice["Invoice"]["Header"]["DueDate"], "%Y-%m-%d")

        # Prepare the document
        doc = InvoiceDocument(
            invoice_number=invoice["Invoice"]["Header"]["InvoiceNumber"],
            invoice_date=invoice_date,
            due_date=due_date,
            currency=invoice["Invoice"]["Header"]["Currency"],
            issuer=supplier_id,  # Use supplier_id for issuer
            recipient=organization_id,  # Use organization_id for recipient
            seller=CompanyDocument(
                company_name=invoice["Invoice"]["Seller"]["CompanyName"],
                address=AddressDocument(
                    street=invoice["Invoice"]["Seller"]["Address"]["Street"],
                    city=invoice["Invoice"]["Seller"]["Address"]["City"],
                    state=invoice["Invoice"]["Seller"]["Address"]["State"],
                    zip_code=invoice["Invoice"]["Seller"]["Address"]["ZipCode"],
                    country=invoice["Invoice"]["Seller"]["Address"]["Country"]
                ),
                contact=ContactDocument(
                    name=invoice["Invoice"]["Seller"]["Contact"]["Name"],
                    phone=invoice["Invoice"]["Seller"]["Contact"]["Phone"],
                    email=invoice["Invoice"]["Seller"]["Contact"]["Email"]
                )
            ),
            buyer=CompanyDocument(
                company_name=invoice["Invoice"]["Buyer"]["CompanyName"],
                address=AddressDocument(
                    street=invoice["Invoice"]["Buyer"]["Address"]["Street"],
                    city=invoice["Invoice"]["Buyer"]["Address"]["City"],
                    state=invoice["Invoice"]["Buyer"]["Address"]["State"],
                    zip_code=invoice["Invoice"]["Buyer"]["Address"]["ZipCode"],
                    country=invoice["Invoice"]["Buyer"]["Address"]["Country"]
                ),
                contact=ContactDocument(
                    name=invoice["Invoice"]["Buyer"]["Contact"]["Name"],
                    phone=invoice["Invoice"]["Buyer"]["Contact"]["Phone"],
                    email=invoice["Invoice"]["Buyer"]["Contact"]["Email"]
                )
            ),
            items=[
                ItemDocument(
                    description=item["Description"],
                    quantity=item["Quantity"],
                    unit_price=item["UnitPrice"],
                    total_price=item["TotalPrice"]
                )
                for item in invoice["Invoice"]["Items"]
            ],
            summary=SummaryDocument(
                subtotal=invoice["Invoice"]["Summary"]["Subtotal"],
                tax_rate=invoice["Invoice"]["Summary"]["TaxRate"],
                tax_amount=invoice["Invoice"]["Summary"]["TaxAmount"],
                total_amount=invoice["Invoice"]["Summary"]["TotalAmount"],
                discount=invoice["Invoice"]["Summary"]["Discount"]
            ),
            payment_instructions=PaymentInstructionsDocument(
                bank_name=invoice["Invoice"]["PaymentInstructions"]["BankName"],
                account_number=invoice["Invoice"]["PaymentInstructions"]["AccountNumber"],
                routing_number=invoice["Invoice"]["PaymentInstructions"]["RoutingNumber"],
                swift=invoice["Invoice"]["PaymentInstructions"]["SWIFT"]
            ),
            notes=NotesDocument(
                note=invoice["Invoice"]["Notes"]["Note"]
            )
        )
        doc.save()
        print(f"Invoice {invoice['Invoice']['Header']['InvoiceNumber']} indexed successfully.")
    except Exception as e:
        print(f"Error indexing invoice: {str(e)}")

def async_index_invoices(invoice_jsons, supplier_id, organization_id):
    threads = []
    for invoice_json in invoice_jsons:
        thread = threading.Thread(target=index_invoice, args=(invoice_json, supplier_id, organization_id))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()


def delete_invoice_index(invoice_id):
    es.delete(index='invoices', id=invoice_id)