from rest_framework import serializers
from .models import Order
from users.serializers import AddressSerializer
from services.serializers import ServiceSerializer
from drivers.serializers import DriverSerializer


class OrderSerializer(serializers.ModelSerializer):
    service_detail = ServiceSerializer(source='service', read_only=True)
    driver_detail = DriverSerializer(source='driver', read_only=True)
    pickup_detail = AddressSerializer(source='pickup_address', read_only=True)
    delivery_detail = AddressSerializer(
        source='delivery_address', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'total_price',
                            'status', 'created_at', 'updated_at']


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'actual_weight_kg', 'scheduled_delivery']
