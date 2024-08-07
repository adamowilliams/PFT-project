from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer): #serializes the user model
    class Meta:
        model = User 
        fields = ['id', 'username', 'password'] #everything to serialize
        extra_kwargs = {'password': {'write_only': True}} #password will not be shown in the response

    def create(self, validated_data): #method to create a user 
        user = User.objects.create_user(**validated_data) #** splitting up the key values pairs in the validated data
        return user