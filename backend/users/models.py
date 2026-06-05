from django.db import models

class User(models.Model):
    AUTH_PROVIDER_CHOICES = [
        ('email', 'Email'),
        ('google', 'Google'),
        ('facebook', 'Facebook'),
    ]

    full_name        = models.CharField(max_length=100)
    email            = models.EmailField(max_length=150, unique=True)
    phone_number     = models.CharField(max_length=20, unique=True)
    password_hash    = models.TextField()
    auth_provider    = models.CharField(max_length=20, choices=AUTH_PROVIDER_CHOICES, default='email')
    profile_picture  = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_active        = models.BooleanField(default=True)
    is_verified      = models.BooleanField(default=False)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class Address(models.Model):
    user            = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label           = models.CharField(max_length=50)       # Home, Work, etc
    street_address  = models.TextField()
    city            = models.CharField(max_length=80)
    latitude        = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude       = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_default      = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.label} - {self.user.full_name}"


class Notification(models.Model):
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title       = models.CharField(max_length=200)
    message     = models.TextField()
    is_read     = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{'Read' if self.is_read else 'Unread'}] {self.title} → {self.user.full_name}"