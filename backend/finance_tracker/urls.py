
from django.urls import path
from . import views

urlpatterns = [
    path("transactions/", views.TransactionListCreateView.as_view(), name = "transaction_list_create"),
    path("transactions/delete/<int:pk>/", views.TransactionDetailView.as_view(), name = "transaction_detail"),
]