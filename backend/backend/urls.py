"""
URL configuration for pft project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CurrentUserView
from notes import views as notes_views
from finance_tracker import views as finance_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/current-user/", CurrentUserView.as_view(), name="current-user"),
    path("api/notes/", notes_views.NoteListCreate.as_view(), name = "note_list"),
    path("api/notes/delete/<int:pk>/", notes_views.NoteDelete.as_view(), name = "delete_note"),
    path("api/transactions/", finance_views.TransactionListCreateView.as_view(), name = "transaction_list_create"),
    path("api/transactions/delete/<int:pk>/", finance_views.TransactionDetailView.as_view(), name = "transaction_detail"),
    path("api/incomes/", finance_views.IncomeListCreateView.as_view(), name = "income_list_create"),
    path("api/outcomes/", finance_views.OutcomeListCreateView.as_view(), name = "outcome_list_create"),
    path("api/balances/", finance_views.BalanceListCreateView.as_view(), name = "balance_list_create"),
    path('api/transactions/import/', finance_views.TransactionImportView.as_view(), name='transaction-import'),
    ]
