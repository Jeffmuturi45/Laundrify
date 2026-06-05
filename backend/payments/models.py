from django.db import models
from users.models import User
from orders.models import Order

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('card',          'Card'),
        ('mobile_wallet', 'Mobile Wallet'),
        ('cash',          'Cash'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('completed', 'Completed'),
        ('refunded',  'Refunded'),
        ('failed',    'Failed'),
    ]

    order            = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    user             = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount           = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method   = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status   = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    transaction_ref  = models.CharField(max_length=100, null=True, blank=True)
    paid_at          = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment #{self.id} - Order #{self.order.id} [{self.payment_status}]"