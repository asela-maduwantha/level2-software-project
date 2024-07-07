from datetime import datetime
from django.shortcuts import render
import os
import pandas as pd
import matplotlib.pyplot as plt
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from invoice.models import Invoice
from .utils import get_invoice_data, calculate_price_deviations, calculate_supplier_expenditures, calculate_monthly_expenditures
from elasticsearch_dsl import Q, Search, A
from rest_framework import status
from elasticsearch import Elasticsearch

plt.switch_backend('Agg')

es = Elasticsearch(['http://43.204.122.107:9200'])

@api_view(['GET'])
def product_price_deviations(request):
    try:
        year = request.query_params.get('year')
        product_name = request.query_params.get('product_name')
        organization_id = request.query_params.get('organization_id')

 
        if not year or not product_name or not organization_id:
            return Response({"error": "Both 'year', 'product_name', and 'organization_id' parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

      
        data = get_invoice_data(year, product_name, organization_id, es)

        if not data:
            return Response({"error": "No data found for the given product, year, and organization"}, status=status.HTTP_404_NOT_FOUND)

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
    
    

@api_view(['GET'])
def monthly_expenditures(request):
    organization_id = request.query_params.get('organization_id')
    year = request.query_params.get('year')

    if not organization_id:
        return Response({"error": "organization_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        search = Search(using=es, index="invoices")
        search = search.filter('term', recipient=organization_id)

        if year:
            start_date = f"{year}-01-01"
            end_date = f"{year}-12-31"
            search = search.filter('range', invoice_date={'gte': start_date, 'lte': end_date})

        search = search.extra(size=10000)

        response = search.execute()

        expenditures = calculate_monthly_expenditures(response.hits)

        return Response(expenditures, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
def suppliers_price_by_month(request):
    year = request.query_params.get('year')
    product_name = request.query_params.get('product_name')
    organization_id = request.query_params.get('organization_id')
    suppliers = request.query_params.getlist('suppliers')

    if not year or not product_name or not organization_id:
        return Response({"error": "Both 'year', 'product_name', and 'organization_id' parameters are required"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        data = get_invoice_data(year, product_name, organization_id, es)

        if not data:
            return Response({"error": "No data found for the given product, year, and organization"},
                            status=status.HTTP_404_NOT_FOUND)

        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.month

        monthly_avg = df.groupby(['supplier', 'month'])['price'].mean().reset_index()

        if suppliers:
            monthly_avg = monthly_avg[monthly_avg['supplier'].isin(suppliers)]

        result = []
        for index, row in monthly_avg.iterrows():
            result.append({
                'supplier': row['supplier'],
                'avg_price': row['price'],  # Assuming 'price' is the column name for average price
                'product_name': product_name  # Add product_name to the response
            })

        return Response(result, status=status.HTTP_200_OK)

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

