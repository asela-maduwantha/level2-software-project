# serializers.py
from rest_framework import serializers
from .models import Invoice, ArchiveInvoice
from authentication.models import Supplier, Organization
import uuid
from datetime import datetime, timedelta

class InvoiceSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(default=uuid.uuid4)
    issuer = serializers.UUIDField(default=uuid.uuid4)
    recipient = serializers.UUIDField(default=uuid.uuid4)
    source_format = serializers.CharField()  
    internal_format = serializers.CharField()  
    created_at = serializers.DateTimeField(default=datetime.now)
    
    issuer_name = serializers.SerializerMethodField()
    recipient_name = serializers.SerializerMethodField()
    supplier_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['id', 'issuer', 'issuer_name', 'recipient', 'recipient_name', 'source_format', 'internal_format', 'supplier_logo_url','created_at']
    
    def get_issuer_name(self, obj):
        try:
            supplier = Supplier.objects.get(id=obj.issuer)
            return supplier.user.username  
        except Supplier.DoesNotExist:
            return None
        
    def get_supplier_logo_url(self, obj):
        try:
            supplier = Supplier.objects.get(id=obj.issuer)
            return supplier.logo_url
        except Supplier.DoesNotExist:
            return None

    def get_recipient_name(self, obj):
        try:
            organization = Organization.objects.get(id=obj.recipient)
            return organization.name
        except Organization.DoesNotExist:
            return None


class ArchiveInvoiceSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(default=uuid.uuid4)
    issuer = serializers.UUIDField(default=uuid.uuid4)
    recipient = serializers.UUIDField(default=uuid.uuid4)
    source_format = serializers.CharField()  
    internal_format = serializers.CharField()  
    created_at = serializers.DateTimeField(default=datetime.now)
    archived_at = serializers.DateTimeField(default=datetime.now)
    expiry_date = serializers.DateTimeField(default=lambda: datetime.now() + timedelta(days=30))

    class Meta:
        model = ArchiveInvoice
        fields = ['id', 'issuer', 'recipient', 'source_format', 'internal_format', 'created_at', 'archived_at', 'expiry_date']
