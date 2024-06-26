from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
import xmltodict
from .models import Invoice
from .utils import format_invoice
from .serializers import InvoiceSerializer
from rest_framework import status
from search.elasticsearch_utils import async_index_invoices
import threading

@api_view(['POST'])
def create_invoice(request):
    try:
        source_invoice = request.data.get('source_invoice')
        
        if isinstance(source_invoice, str):
           
            if source_invoice.strip().startswith('<'):
           
                source_invoice = xmltodict.parse(source_invoice)
            else:
                source_invoice = json.loads(source_invoice)
        
        elif 'source_invoice' in request.FILES:
            source_invoice_file = request.FILES['source_invoice']
            if source_invoice_file.name.endswith('.xml'):
              
                source_invoice = xmltodict.parse(source_invoice_file.read())
            else:
                source_invoice = json.load(source_invoice_file)

        supplier_id = request.data.get("supplier_id")
        organization_id = request.data.get("organization_id")

        converted_invoice = format_invoice(source_invoice, supplier_id)
        
        invoice_data = {
            'issuer': supplier_id,
            'recipient': organization_id,
            'source_format': json.dumps(source_invoice),  
            'internal_format': json.dumps(converted_invoice),
        }

        serializer = InvoiceSerializer(data=invoice_data)
        
        if serializer.is_valid():
            invoice = serializer.save()
            
           
            threading.Thread(target=async_index_invoices, args=([json.dumps(converted_invoice)], supplier_id, organization_id)).start()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)







@api_view(['GET'])
def supplier_invoice_view(request):
    try:
        supplier_id = request.query_params.get('supplier_id')
        
        invoices = Invoice.objects.filter(issuer=supplier_id)
        serializer = InvoiceSerializer(invoices, many=True)
        
        return Response({'invoices': serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def organization_invoice_view(request):
    try:
        organization_id = request.query_params.get('orgId')
        
        invoices = Invoice.objects.filter(recipient=organization_id)
        serializer = InvoiceSerializer(invoices, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)