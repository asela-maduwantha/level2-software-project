from datetime import datetime
from django.shortcuts import render
import os
import pandas as pd
import matplotlib.pyplot as plt
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from invoice.models import Invoice
from .utils import get_invoice_data, calculate_price_deviations, calculate_supplier_expenditures
from elasticsearch_dsl import Q, Search, A
from rest_framework import status
from elasticsearch import Elasticsearch

plt.switch_backend('Agg')

es = Elasticsearch(['http://localhost:9200'])

@api_view(['GET'])
def product_price_deviations(request):
    try:
        year = request.query_params.get('year')
        product_name = request.query_params.get('product_name')

        if not year or not product_name:
            return Response({"error": "Both 'year' and 'product_name' parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

        data = get_invoice_data(year, product_name, es)

        if not data:
            return Response({"error": "No data found for the given product and year"}, status=status.HTTP_404_NOT_FOUND)

        deviations = calculate_price_deviations(data, year)
        result = deviations[['month', 'price', 'overall_avg_price']].to_dict(orient='records')

        return Response(result, status=status.HTTP_200_OK)

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['GET'])
def organization_supplier_expenditures(request):
    organization_id = request.query_params.get('organization_id')
    year = request.query_params.get('year')

    if not organization_id or not year:
        return Response({"error": "Both organization_id and year parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        suppliers_expenditures = calculate_supplier_expenditures(organization_id, year)

        return Response(suppliers_expenditures, status=status.HTTP_200_OK)

    except ValueError as ve:
        return Response({"error": str(ve)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)