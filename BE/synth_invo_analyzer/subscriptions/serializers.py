# serializers.py

from rest_framework import serializers
from .models import Subscription, Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    is_current_period_paid = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = '__all__'

    def get_is_current_period_paid(self, obj):
        return obj.is_current_period_paid()
