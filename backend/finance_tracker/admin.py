from django.contrib import admin
from .models import Transaction

# Register your models here.

admin.site.register(Transaction)

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'amount', 'get_category_display', 'transaction_type', 'author', 'recurring', 'recurring_interval')
    list_filter = ('transaction_type', 'author', 'recurring', 'recurring_interval')
    search_fields = ('description',)

    def get_category_display(self, obj):
        return obj.get_category_display()

    get_category_display.short_description = 'Category'