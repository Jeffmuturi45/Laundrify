from rest_framework import serializers
from .models import Driver, DriverNotification
from django.contrib.auth.hashers import check_password


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class DriverLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            driver = Driver.objects.get(email=data['email'])
        except Driver.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")

        if not check_password(data['password'], driver.password_hash):
            raise serializers.ValidationError("Invalid credentials.")

        if not driver.is_active:
            raise serializers.ValidationError("Driver account is deactivated.")

        data['driver'] = driver
        return data


class DriverLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['latitude', 'longitude']


class DriverNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverNotification
        fields = '__all__'
        read_only_fields = ['driver', 'created_at']
