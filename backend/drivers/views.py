from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.cache import cache
from .models import Driver, DriverNotification
from .serializers import (
    DriverSerializer, DriverLoginSerializer,
    DriverLocationSerializer, DriverNotificationSerializer
)
from users.utils import get_tokens_for_driver


class DriverLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DriverLoginSerializer(data=request.data)
        if serializer.is_valid():
            driver = serializer.validated_data['driver']
            tokens = get_tokens_for_driver(driver.id, driver.email)
            return Response({
                'message': 'Login successful.',
                'tokens':  tokens,
                'driver':  DriverSerializer(driver).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        driver_id = request.auth.payload.get('user_id')
        cache_key = f'driver_profile_{driver_id}'
        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        try:
            driver = Driver.objects.get(id=driver_id)
            data = DriverSerializer(driver).data
            cache.set(cache_key, data, timeout=300)
            return Response(data)
        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        driver_id = request.auth.payload.get('user_id')
        try:
            driver = Driver.objects.get(id=driver_id)
            serializer = DriverSerializer(
                driver, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                cache.delete(f'driver_profile_{driver_id}')
                return Response({'message': 'Profile updated.', 'driver': serializer.data})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)


class DriverLocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        driver_id = request.auth.payload.get('user_id')
        try:
            driver = Driver.objects.get(id=driver_id)
            serializer = DriverLocationSerializer(
                driver, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                cache.delete(f'driver_profile_{driver_id}')
                return Response({'message': 'Location updated.'})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)


class DriverNotificationListView(generics.ListAPIView):
    serializer_class = DriverNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        driver_id = self.request.auth.payload.get('user_id')
        return DriverNotification.objects.filter(driver_id=driver_id).order_by('-created_at')


class MarkDriverNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        driver_id = request.auth.payload.get('user_id')
        try:
            notif = DriverNotification.objects.get(id=pk, driver_id=driver_id)
            notif.is_read = True
            notif.save()
            return Response({'message': 'Notification marked as read.'})
        except DriverNotification.DoesNotExist:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


# Admin only
class AdminDriverListCreateView(generics.ListCreateAPIView):
    serializer_class = DriverSerializer
    permission_classes = [IsAdminUser]
    queryset = Driver.objects.all()

    def perform_create(self, serializer):
        from django.contrib.auth.hashers import make_password
        password = self.request.data.get('password')
        serializer.save(password_hash=make_password(password))


class AdminDriverDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DriverSerializer
    permission_classes = [IsAdminUser]
    queryset = Driver.objects.all()
