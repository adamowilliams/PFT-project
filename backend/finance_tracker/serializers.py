from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        extra_kwargs = {
            "author": {"read_only": True},
            'category': {'required': False, 'allow_blank': True},
            'subCategory': {'required': False, 'allow_blank': True},
            }