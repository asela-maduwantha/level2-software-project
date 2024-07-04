from django.urls import path
from . import views

urlpatterns = [
    path('create_invoice/', views.create_invoice, name='create-invoice'), 
    path('bulk-upload-invoices/', views.bulk_upload_invoices, name='bulk_upload_invoices'),
    path('get-invoice-by-supplier/', views.supplier_invoice_view, name = 'get-invoice-by-supplier'), 
    path('get-invoice-by-organization/', views.organization_invoice_view, name = 'get-invoice-by-organization') 
]
   
