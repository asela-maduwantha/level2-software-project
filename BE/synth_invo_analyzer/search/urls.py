from django.urls import path
from .views import SearchInvoicesView

urlpatterns = [
    path('search/', SearchInvoicesView.as_view(), name='search_invoices'),
]
