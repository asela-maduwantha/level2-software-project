from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from .models import Invoice
from .utils import format_invoice, parse_invoice_input, process_csv_chunk
from .serializers import InvoiceSerializer
from rest_framework import status
from search.elasticsearch_utils import async_index_invoices
import csv
import io
from uuid import UUID
from celery import shared_task
from django.core.paginator import Paginator
import logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
def create_invoice(request):
    try:
        supplier_id = request.data.get("supplier_id")
        organization_id = request.data.get("organization_id")

        if not supplier_id or not organization_id:
            return Response({'error': 'supplier_id and organization_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            supplier_id = UUID(supplier_id)
            organization_id = UUID(organization_id)
        except ValueError:
            return Response({'error': 'Invalid UUID format for supplier_id or organization_id'}, status=status.HTTP_400_BAD_REQUEST)

        source_invoice = parse_invoice_input(request)
        
        converted_invoice = format_invoice(source_invoice, supplier_id)
        
        invoice_data = {
            'issuer': str(supplier_id),
            'recipient': str(organization_id),
            'source_format': json.dumps(source_invoice),  
            'internal_format': json.dumps(converted_invoice),
        }

        serializer = InvoiceSerializer(data=invoice_data)
        
        if serializer.is_valid():
            invoice = serializer.save()
            async_index_invoices([json.dumps(converted_invoice)], str(supplier_id), str(organization_id))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except ValueError as e:
        logger.error(f"Value error in create_invoice: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.exception("Unexpected error in create_invoice")
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def bulk_upload_invoices(request):
    try:
        supplier_id = request.data.get("supplier_id")
        organization_id = request.data.get("organization_id")
        csv_file = request.FILES.get('file')

        if not supplier_id or not organization_id:
            return Response({'error': 'supplier_id and organization_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            supplier_id = UUID(supplier_id)
            organization_id = UUID(organization_id)
        except ValueError:
            return Response({'error': 'Invalid UUID format for supplier_id or organization_id'}, status=status.HTTP_400_BAD_REQUEST)

        if not csv_file or not csv_file.name.endswith('.csv'):
            return Response({'error': 'Invalid file format. Please upload a CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        csv_data = csv_file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(csv_data))
        
        chunk_size = 1000  # Adjust based on your needs
        chunks = list(Paginator(list(reader), chunk_size).page_range)
        
        for chunk_num in chunks:
            chunk = list(Paginator(list(reader), chunk_size).page(chunk_num).object_list)
            process_csv_chunk.delay(chunk, str(organization_id), str(supplier_id))

        return Response({'success': f'Processing {len(chunks)} chunks of invoices.'}, status=status.HTTP_202_ACCEPTED)

    except Exception as e:
        logger.exception("Unexpected error in bulk_upload_invoices")
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

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