from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from elasticsearch import Elasticsearch

@api_view(['GET'])
def search_invoices(request):
    query_word = request.query_params.get('query')
    organization_id = request.query_params.get('organization_id')
    
    # Check if both query_word and supplier_id are provided
    if not organization_id or not query_word:
        return Response({"error": "Both organization_id and query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    es = Elasticsearch(['http://localhost:9200'])
    
    # Construct the search query
    search_body = {
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "recipient": organization_id
                        }
                    },
                    {
                        "nested": {
                            "path": "items",
                            "query": {
                                "match": {
                                    "items.description": query_word
                                }
                            }
                        }
                    }
                ]
            }
        }
    }

    try:
        
        res = es.search(index="invoices", body=search_body)
        
        
        if res['hits']['total']['value'] == 0:
            return Response({"error": "No invoices found matching the search criteria"}, status=status.HTTP_404_NOT_FOUND)
        
        # Return the hits if found
        return Response(res['hits']['hits'], status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
