from rest_framework import serializers
from .models import AdminSupplierMessage, AdminOrganizationMessage

class AdminSupplierMessageSerializer(serializers.ModelSerializer):
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = AdminSupplierMessage
        fields = ['id', 'admin', 'supplier', 'content', 'timestamp', 'is_read', 'user_role']
        read_only_fields = ['id']

    def get_user_role(self, obj):
        if obj.admin.id == self.context['user_id']:
            return 'admin'
        elif obj.supplier.id == self.context['user_id']:
            return 'supplier'
        return 'unknown'

class AdminOrganizationMessageSerializer(serializers.ModelSerializer):
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = AdminOrganizationMessage
        fields = ['id', 'admin', 'organization', 'content', 'timestamp', 'is_read', 'user_role']
        read_only_fields = ['id']

    def get_user_role(self, obj):
        if obj.admin.id == self.context['user_id']:
            return 'admin'
        elif obj.organization.id == self.context['user_id']:
            return 'organization'
        return 'unknown'
