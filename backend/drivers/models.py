from django.db import models

class Driver(models.Model):
    full_name             = models.CharField(max_length=100)
    phone_number          = models.CharField(max_length=20, unique=True)
    email                 = models.EmailField(max_length=150, unique=True)
    password_hash         = models.TextField()
    vehicle_registration  = models.CharField(max_length=30)
    profile_picture       = models.ImageField(upload_to='drivers/', null=True, blank=True)
    is_available          = models.BooleanField(default=True)
    is_active             = models.BooleanField(default=True)
    latitude              = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude             = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at            = models.DateTimeField(auto_now_add=True)
    updated_at            = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.vehicle_registration})"


class DriverNotification(models.Model):
    driver      = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='notifications')
    title       = models.CharField(max_length=200)
    message     = models.TextField()
    is_read     = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{'Read' if self.is_read else 'Unread'}] {self.title} → {self.driver.full_name}"