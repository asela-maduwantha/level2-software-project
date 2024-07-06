from rest_framework import serializers
from .models import AdminSupplierMessage, AdminOrganizationMessage

class AdminSupplierMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminSupplierMessage
        fields = ['id', 'admin', 'supplier', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id']  # Assuming you don't want to allow write access to the UUID field

class AdminOrganizationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminOrganizationMessage
        fields = ['id', 'admin', 'organization', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id']  # Assuming you don't want to allow write access to the UUID field
