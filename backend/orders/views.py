from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.cache import cache
from .models import Order
from .serializers import OrderSerializer, OrderStatusSerializer
from users.models import User
from drivers.models import Driver
from users.notifications import notify_user, notify_driver
from .tasks import (
    send_order_confirmation_email,
    send_order_status_update_email,
    send_driver_assignment_notification
)


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.auth.payload.get('user_id')
        cache_key = f'orders_list_{user_id}'
        cached = cache.get(cache_key)
        if cached:
            return cached
        queryset = Order.objects.filter(
            user_id=user_id).order_by('-created_at')
        cache.set(cache_key, queryset, timeout=120)
        return queryset

    def perform_create(self, serializer):
        user_id = self.request.auth.payload.get('user_id')
        user = User.objects.get(id=user_id)
        order = serializer.save(user=user)

        # Background task: send confirmation email
        send_order_confirmation_email.delay(user.email, order.id)

        # In-app notification
        notify_user(user, 'Order Placed!',
                    f'Your order #{order.id} has been received.')

        # Clear cache
        cache.delete(f'orders_list_{user_id}')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.auth.payload.get('user_id')
        return Order.objects.filter(user_id=user_id)


# Admin views
class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all().order_by('-created_at')


class AdminOrderStatusUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
            serializer = OrderStatusSerializer(
                order, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                new_status = serializer.validated_data.get(
                    'status', order.status)

                # Notify customer
                notify_user(
                    order.user,
                    'Order Update',
                    f'Your order #{order.id} is now: {new_status.upper()}'
                )

                # Background email
                send_order_status_update_email.delay(
                    order.user.email, order.id, new_status)

                return Response({'message': 'Order updated.', 'order': serializer.data})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)


class AdminAssignDriverView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        driver_id = request.data.get('driver_id')
        try:
            order = Order.objects.get(id=pk)
            driver = Driver.objects.get(id=driver_id, is_active=True)

            order.driver = driver
            order.save()

            # Notify driver
            notify_driver(
                driver,
                'New Assignment',
                f'You have been assigned to Order #{order.id}.'
            )

            # Notify customer
            notify_user(
                order.user,
                'Driver Assigned',
                f'Driver {driver.full_name} has been assigned to your order.'
            )

            # Background email to driver
            send_driver_assignment_notification.delay(driver.email, order.id)

            return Response({'message': f'Driver {driver.full_name} assigned to Order #{order.id}.'})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found or inactive.'}, status=status.HTTP_404_NOT_FOUND)


# Driver views their assigned orders
class DriverOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        driver_id = self.request.auth.payload.get('user_id')
        return Order.objects.filter(driver_id=driver_id).order_by('-created_at')


class DriverOrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        driver_id = request.auth.payload.get('user_id')
        allowed_status = ['picked_up', 'out_for_delivery', 'delivered']
        new_status = request.data.get('status')

        if new_status not in allowed_status:
            return Response(
                {'error': f'Drivers can only set: {allowed_status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.get(id=pk, driver_id=driver_id)
            order.status = new_status
            order.save()

            notify_user(
                order.user,
                'Order Update',
                f'Your order #{order.id} is now: {new_status.upper()}'
            )
            send_order_status_update_email.delay(
                order.user.email, order.id, new_status)

            return Response({'message': 'Status updated.'})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
