from rest_framework import generics, status

from .scripts.import_transactions import import_transactions
from .serializers import TransactionSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response


class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class TransactionDetailView(generics.DestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user)
    
class TransactionImportView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request,):
        file = request.data.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        transactions_data = import_transactions(file)
        serializer = TransactionSerializer(data=transactions_data, many=True, context={'request': request})

        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user)