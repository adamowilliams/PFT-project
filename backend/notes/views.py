from rest_framework import generics
from .serializers import NoteSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Note

# Create your views here.

class NoteListCreate(generics.ListCreateAPIView): #list or create views
    serializer_class = NoteSerializer 
    permission_classes = [IsAuthenticated] #only authenticated users can access this view

    def get_queryset(self): #method to get the queryset
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)