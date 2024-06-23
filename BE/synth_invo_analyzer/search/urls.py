from django.urls import path
from . import views

urlpatterns = [
    path('search-invoices/', views.search_invoices, name='search_invoices'),
]
