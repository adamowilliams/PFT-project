import logging
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .serializers import TransactionSerializer
from .models import Transaction
from .ML_model_categorization.import_transactions import import_transactions
from .ML_model_categorization.categorization import update_lookup_table

logger = logging.getLogger(__name__)

class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user).order_by('created_at')

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class TransactionDeleteView(generics.DestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user).order_by('created_at')
    
class TransactionUpdateView(generics.UpdateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        logger.info("Request data: %s", request.data)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            logger.error("Validation errors: %s", e.detail)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        logger.info("Updated transaction data: %s", serializer.validated_data)
       
        description = serializer.validated_data.get('description')
        category = serializer.validated_data.get('category')
        subcategory = serializer.validated_data.get('subCategory')
        update_lookup_table(description, category, subcategory)

        return Response(serializer.data)
    
    def perform_update(self, serializer):
        logger.info("Attempting to update transaction with data: %s", serializer.validated_data)
        serializer.save()
    
class TransactionImportView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request,):
        file = request.data.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        transactions_data = import_transactions(file)
        logger.debug("Parsed transactions data: %s", transactions_data)
        
        serializer = TransactionSerializer(data=transactions_data, many=True, context={'request': request})

        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            logger.error("Serializer errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user).order_by('created_at')