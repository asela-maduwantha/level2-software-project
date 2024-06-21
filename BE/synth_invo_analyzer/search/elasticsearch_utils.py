from elasticsearch import Elasticsearch
from elasticsearch_dsl import Document, Date, Integer, Keyword, Text
import json

es = Elasticsearch(['http://localhost:9200'])  # Replace with your Elasticsearch node

class InvoiceDocument(Document):
    invoice_id = Keyword()
    issuer = Integer()
    recipient = Integer()
    source_format = Text()
    internal_format = Text()
    created_at = Date()

    class Index:
        name = 'invoices'

def index_invoice(invoice):
    
    try:
        doc = {
        'invoice_id': str(invoice.id),
        'issuer': invoice.issuer,
        'recipient': invoice.recipient,
        'source_format': invoice.source_format,
        'internal_format': invoice.internal_format,
        'created_at': invoice.created_at.isoformat()
        }
        es.index(index='invoices', id=str(invoice.id), body=doc)
    except:
        print("Error indexing")
