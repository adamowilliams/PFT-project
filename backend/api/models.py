from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=100) #max length of the title is 100
    content = models.TextField() #content of the note
    created_at = models.DateTimeField(auto_now_add=True) 
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes") 
    #ForeignKey is a one to many relationship. One user can have many notes.
    #on_delete=models.CASCADE means that if the user is deleted, all the notes will be deleted as well.
    #related_name is the name of the reverse relation from User to Note. It allows us to access the notes of a user using user.notes

    def __str__(self):
        return self.title