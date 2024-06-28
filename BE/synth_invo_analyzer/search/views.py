from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Q
import json

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

    query = Q("bool", must=must_clauses, filter=filter_clauses)
    return query

@api_view(['GET'])
def search_invoices(request):
    query_params = request.query_params

    search_body = {
        "query": build_search_query(query_params).to_dict()
    }

    try:
        res = es.search(index="invoices", body=search_body)

        if res['hits']['total']['value'] == 0:
            return Response({"error": "No invoices found matching the search criteria"}, status=status.HTTP_404_NOT_FOUND)
        print(res['hits']['total']['value'])
        return Response(res['hits']['hits'], status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
