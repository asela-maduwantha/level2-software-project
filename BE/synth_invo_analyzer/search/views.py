from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from elasticsearch import Elasticsearch

class SearchInvoicesView(APIView):
    def get(self, request):
        issuer = request.query_params.get('issuer')
        recipient = request.query_params.get('recipient')
        es = Elasticsearch(['http://localhost:9200'])  
        search_body = {
            "query": {
                "bool": {
                    "must": []
                }
            }
        }

        if issuer:
            search_body['query']['bool']['must'].append({
                "match": {
                    "issuer": issuer
                }
            })

        if recipient:
            search_body['query']['bool']['must'].append({
                "match": {
                    "recipient": recipient
                }
            })

        if search_body['query']['bool']['must']:
            res = es.search(index="invoices", body=search_body)
            return Response(res['hits']['hits'], status=status.HTTP_200_OK)
        else:
            return Response({"error": "No valid query parameters provided"}, status=status.HTTP_400_BAD_REQUEST)
