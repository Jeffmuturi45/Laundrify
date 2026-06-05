from django.db import models
from users.models import User, Address
from services.models import Service
from drivers.models import Driver


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',           'Pending'),
        ('picked_up',         'Picked Up'),
        ('processing',        'Processing'),
        ('out_for_delivery',  'Out for Delivery'),
        ('delivered',         'Delivered'),
        ('cancelled',         'Cancelled'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='orders')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True)
    driver = models.ForeignKey(
        Driver, on_delete=models.SET_NULL, null=True, blank=True)
    pickup_address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, related_name='pickup_orders')
    delivery_address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, related_name='delivery_orders')
    scheduled_pickup = models.DateTimeField()
    scheduled_delivery = models.DateTimeField(null=True, blank=True)
    estimated_weight_kg = models.DecimalField(max_digits=5, decimal_places=2)
    actual_weight_kg = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    special_instructions = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.full_name} [{self.status}]"
