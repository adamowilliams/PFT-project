
from django.urls import path
from . import views

urlpatterns = [
    path("", views.TransactionListCreateView.as_view(), name = "transaction_list_create"),
    path("delete/<int:pk>/", views.TransactionDeleteView.as_view(), name = "transaction_detail"),
    path("<int:pk>/update/", views.TransactionUpdateView.as_view(), name='transaction-update'),
    path("import/", views.TransactionImportView.as_view(), name='transaction-import'),
]