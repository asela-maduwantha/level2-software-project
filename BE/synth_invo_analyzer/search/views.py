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




import pandas as pd
from elasticsearch_dsl import Search

def get_invoice_data(year, es, index="invoices"):

    search = Search(using=es, index=index)
    search = search.filter('range', invoice_date={'gte': f'{year}-01-01', 'lte': f'{year}-12-31'})

    response = search.execute()


    data = []
    for hit in response.hits:
        invoice_date = hit.invoice_date
        for item in hit.items:
            data.append({
                'product': item['description'],
                'price': item['unit_price'],
                'date': invoice_date
            })
    
    return data

def calculate_price_deviations(data):
    # Convert data to a pandas DataFrame
    df = pd.DataFrame(data)

    # Ensure 'date' column is of datetime type
    df['date'] = pd.to_datetime(df['date'])

    # Extract year and month from the 'date' column
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month

    # Group by product and month to calculate the average price for each product per month
    monthly_avg = df.groupby(['product', 'year', 'month'])['price'].mean().reset_index()

    # Calculate the deviation from the average price for each product across months
    overall_avg = monthly_avg.groupby('product')['price'].mean().reset_index()
    overall_avg.rename(columns={'price': 'overall_avg_price'}, inplace=True)

    # Merge the overall average price with the monthly average price
    deviations = pd.merge(monthly_avg, overall_avg, on='product')

    # Calculate deviation
    deviations['deviation'] = deviations['price'] - deviations['overall_avg_price']

    return deviations

@api_view(['GET'])
def product_price_deviations(request):
    try:
        
        year = request.query_params.get('year')
   
        data = get_invoice_data(year, es)

     
        deviations = calculate_price_deviations(data)

    
        result = deviations.to_dict(orient='records')

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
