from django.urls import path
from . import views

urlpatterns = [
    path("", views.NoteListCreate.as_view(), name = "note_list"),
    path("delete/<int:pk>/", views.NoteDelete.as_view(), name = "delete_note"),
]