from django.db import models

class Service(models.Model):
    service_name              = models.CharField(max_length=100)
    description               = models.TextField()
    base_price_per_kg         = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_turnaround_hrs  = models.IntegerField()
    is_active                 = models.BooleanField(default=True)

    def __str__(self):
        return self.service_name