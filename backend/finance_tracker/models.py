from datetime import timezone
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class RepetitionInterval(models.IntegerChoices):
    DAI = 1, "Daily"
    WEE = 2, "Weekly"
    MON = 3, "Monthly"
    YEA = 4, "Yearly"
    NON = 5, "None"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Income', 'Income'),
        ('Expense', 'Expense')
        ]

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default="")
    description = models.TextField(blank=True, default="")
    created_at = models.DateField(blank=True, null=True)
    recurring = models.BooleanField(default=False)
    recurring_interval = models.PositiveSmallIntegerField(choices=RepetitionInterval.choices, default=RepetitionInterval.NON)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES , default='')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    
    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = timezone.now().date()  # Set to current date if not provided
        super(Transaction, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.created_at} - {self.get_category_display()} - {self.amount}'