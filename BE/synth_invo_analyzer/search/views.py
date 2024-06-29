from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Q, Search, A
import json
from datetime import datetime

es = Elasticsearch(['http://localhost:9200'])

def build_search_query(params):
    must_clauses = []
    filter_clauses = []

    query_word = params.get('query')
    if query_word:
        must_clauses.append(Q("nested", path="items", query=Q("match", items__description=query_word)))

    organization_id = params.get('organization_id')
    if organization_id:
        must_clauses.append(Q("term", recipient=organization_id))

    supplier_name = params.get('supplier_name')
    if supplier_name:
        must_clauses.append(Q("nested", path="seller", query=Q("match", seller__company_name=supplier_name)))

    start_date = params.get('start_date')
    end_date = params.get('end_date')
    if start_date or end_date:
        date_range = {}
        if start_date:
            date_range["gte"] = start_date
        if end_date:
            date_range["lte"] = end_date
        filter_clauses.append(Q("range", invoice_date=date_range))

    # Additional fields based on the `InvoiceDocument` schema
    invoice_number = params.get('invoice_number')
    if invoice_number:
        must_clauses.append(Q("term", invoice_number=invoice_number))

    currency = params.get('currency')
    if currency:
        must_clauses.append(Q("term", currency=currency))

    issuer = params.get('issuer')
    if issuer:
        must_clauses.append(Q("term", issuer=issuer))

    buyer_name = params.get('buyer_name')
    if buyer_name:
        must_clauses.append(Q("nested", path="buyer", query=Q("match", buyer__company_name=buyer_name)))

    total_amount_min = params.get('total_amount_min')
    total_amount_max = params.get('total_amount_max')
    if total_amount_min or total_amount_max:
        amount_range = {}
        if total_amount_min:
            amount_range["gte"] = float(total_amount_min)
        if total_amount_max:
            amount_range["lte"] = float(total_amount_max)
        filter_clauses.append(Q("range", summary__total_amount=amount_range))

    query = Q("bool", must=must_clauses, filter=filter_clauses)
    return query


@api_view(['GET'])
def search_invoices(request):
    query_params = request.query_params
    size = query_params.get('size', 1000)  # Set default size to 1000

    search_body = {
        "query": build_search_query(query_params).to_dict(),
        "size": size  # Add this line to specify the number of results
    }

    try:
        res = es.search(index="invoices", body=search_body)

        if res['hits']['total']['value'] == 0:
            return Response({"error": "No invoices found matching the search criteria"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(res['hits']['hits'], status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def organization_products(request):
    organization_id = request.query_params.get('organization_id')

    if not organization_id:
        return Response({"error": "organization_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        search = Search(using=es, index="invoices")
        search = search.filter('term', recipient=organization_id)
        search = search.query('nested', path='items', query=Q('match_all'))

        response = search.execute()

        products = set()
        for hit in response.hits:
            for item in hit.items:
                products.add(item['description'])

        product_list = list(products)

        return Response(product_list, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







import pandas as pd
from elasticsearch_dsl import Search
def get_invoice_data(year, product_name, es, index="invoices"):
    try:
        year = int(year)
        if year < 1000 or year > 9999:
            raise ValueError("Invalid year")
    except ValueError:
        raise ValueError("Year parameter must be a valid 4-digit number")

    search = Search(using=es, index=index)
    search = search.filter('range', invoice_date={'gte': f'{year}-01-01', 'lte': f'{year}-12-31'})
    search = search.query('nested', path='items', query=Q('match', items__description=product_name))

    response = search.execute()

    data = []
    for hit in response.hits:
        invoice_date = hit.invoice_date
        for item in hit.items:
            if item['description'] == product_name:
                data.append({
                    'product': item['description'],
                    'price': item['unit_price'],
                    'date': invoice_date
                })

    return data

def calculate_price_deviations(data, year):
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month

    monthly_avg = df.groupby(['product', 'year', 'month'])['price'].mean().reset_index()
    overall_avg = monthly_avg.groupby('product')['price'].mean().reset_index()
    overall_avg.rename(columns={'price': 'overall_avg_price'}, inplace=True)

    deviations = pd.merge(monthly_avg, overall_avg, on='product')
    deviations = deviations[deviations['year'] == int(year)]
    deviations['deviation'] = deviations['price'] - deviations['overall_avg_price']

    return deviations

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