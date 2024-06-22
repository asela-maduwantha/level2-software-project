from rest_framework import serializers
from .models import Invoice
from authentication.models import Supplier, Organization
import uuid
from datetime import datetime

class InvoiceSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(default=uuid.uuid4)
    issuer = serializers.IntegerField()
    recipient = serializers.IntegerField()
    source_format = serializers.CharField()  
    internal_format = serializers.CharField()  
    created_at = serializers.DateTimeField(default=datetime.now)
    
    issuer_name = serializers.SerializerMethodField()
    recipient_name = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['id', 'issuer', 'issuer_name', 'recipient', 'recipient_name', 'source_format', 'internal_format', 'created_at']
    
    def get_issuer_name(self, obj):
        try:
            supplier = Supplier.objects.get(id=obj.issuer)
            return supplier.user.username  # or any other attribute you want to use
        except Supplier.DoesNotExist:
            return None

    def get_recipient_name(self, obj):
        try:
            organization = Organization.objects.get(id=obj.recipient)
            return organization.name
        except Organization.DoesNotExist:
            return None
