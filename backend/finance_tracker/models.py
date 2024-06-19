from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class RepetitionInterval(models.IntegerChoices):
    DAI = 1, "Daily"
    WEE = 2, "Weekly"
    MON = 3, "Monthly"
    YEA = 4, "Yearly"
    NON = 5, "None"

class OutcomeCategory(models.IntegerChoices):
    FOO = 1, "Food"
    TRA = 2, "Transport"
    REN = 3, "Rent"
    BIL = 4, "Bills"
    HEA = 5, "Health"
    FUN = 6, "Fun"
    CHA = 7, "Charity"
    OTH = 8, "Other"


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Income', 'Income'),
        ('Expense', 'Expense')
        ]

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default="")
    description = models.TextField(blank=True, default="")
    created_at = models.DateField(auto_now_add=True)
    recurring = models.BooleanField(default=False)
    recurring_interval = models.PositiveSmallIntegerField(choices=RepetitionInterval.choices, default=RepetitionInterval.NON)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES , default='')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    
    
    def __str__(self):
        return f'{self.created_at} - {self.get_category_display()} - {self.amount}'



class Income(models.Model):
    class IncomeCategory(models.IntegerChoices):
        SAL = 1, "Salary"
        GIF = 2, "Gift"
        OTH = 3, "Other"
    
    class RepetitionInterval(models.IntegerChoices):
        DAI = 1, "Daily"
        WEE = 2, "Weekly"
        MON = 3, "Monthly"
        YEA = 4, "Yearly"
        NON = 5, "None"

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.PositiveSmallIntegerField(choices=IncomeCategory.choices, default=IncomeCategory.OTH)
    description = models.TextField(blank=True, default="")
    repetitive = models.BooleanField(default=False)
    repetition_interval = models.PositiveSmallIntegerField(choices=RepetitionInterval.choices, default=RepetitionInterval.NON)
    created_at = models.DateField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="incomes")
    
    def __str__(self):
        return f"Income {self.id} on {self.created_at}: {self.amount} - {self.description}"
    
class Outcome(models.Model):
    class OutcomeCategory(models.IntegerChoices):
        FOO = 1, "Food"
        TRA = 2, "Transport"
        REN = 3, "Rent"
        BIL = 4, "Bills"
        HEA = 5, "Health"
        FUN = 6, "Fun"
        CHA = 7, "Charity"
        OTH = 8, "Other"
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.PositiveSmallIntegerField(choices=OutcomeCategory.choices, default=OutcomeCategory.OTH)
    description = models.TextField(blank=True, default="")
    repetitive = models.BooleanField(default=False)
    repetition_interval = models.PositiveSmallIntegerField(choices=Income.RepetitionInterval.choices, default=Income.RepetitionInterval.NON)
    created_at = models.DateField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="outcomes")

    def __str__(self):
        return f"Outcome {self.id} on {self.created_at}: {self.amount} - {self.description}"

class Balance(models.Model):
    class BalanceCategory(models.IntegerChoices):
        SAV = 1, "Savings"
        CUR = 2, "Current"
        INV = 3, "Investment"
        OTH = 4, "Other"
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.PositiveSmallIntegerField(choices=BalanceCategory.choices, default=BalanceCategory.CUR)
    description = models.TextField(blank=True, default="")
    created_at = models.DateField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="balances")

    def __str__(self):
        return f"Balance {self.id} on {self.created_at}: {self.amount} - {self.description}"