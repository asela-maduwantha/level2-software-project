from django.urls import path
from . import views

urlpatterns = [
    path('search-invoices/', views.search_invoices, name='search_invoices'),  
    path('product_price_deviations/', views.product_price_deviations, name='search_invoices'),  
]
