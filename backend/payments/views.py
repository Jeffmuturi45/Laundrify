from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
from users.models import User
from users.notifications import notify_user
import uuid
from django.utils import timezone


class PaymentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.auth.payload.get('user_id')
        order_id = request.data.get('order_id')
        method = request.data.get('payment_method')

        try:
            user = User.objects.get(id=user_id)
            order = Order.objects.get(id=order_id, user=user)
        except (User.DoesNotExist, Order.DoesNotExist):
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(order, 'payment') and order.payment.payment_status == 'completed':
            return Response({'error': 'Order already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            order=order,
            user=user,
            amount=order.total_price or 0,
            payment_method=method,
            payment_status='completed',      # Integrate real gateway here
            transaction_ref=str(uuid.uuid4()),
            paid_at=timezone.now()
        )

        notify_user(user, 'Payment Received',
                    f'Payment for Order #{order.id} confirmed.')

        return Response({
            'message': 'Payment successful.',
            'payment': PaymentSerializer(payment).data
        }, status=status.HTTP_201_CREATED)


class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.auth.payload.get('user_id')
        return Payment.objects.filter(user_id=user_id)


class AdminPaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminUser]
    queryset = Payment.objects.all().order_by('-paid_at')
