from django.conf import settings
from django.core.cache import cache
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

import google.auth.transport.requests
import google.oauth2.id_token

from .models import User, Address, Notification
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    AddressSerializer,
    NotificationSerializer,
)
from .utils import get_tokens_for_user
from .notifications import notify_user


# =========================================================
# THROTTLING
# =========================================================

class RegisterThrottle(AnonRateThrottle):
    rate = '5/min'


class LoginThrottle(AnonRateThrottle):
    rate = '10/min'


class GoogleAuthThrottle(AnonRateThrottle):
    rate = '10/min'


# =========================================================
# AUTH VIEWS
# =========================================================

class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [RegisterThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()

        # Generate JWT tokens
        tokens = get_tokens_for_user(user.id, user.email)

        # Send welcome notification
        notify_user(
            user,
            'Welcome!',
            'Your account has been created successfully.'
        )

        return Response(
            {
                'message': 'Account created successfully.',
                'tokens': tokens,
                'user': UserProfileSerializer(user).data,
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = serializer.validated_data['user']

        tokens = get_tokens_for_user(user.id, user.email)

        return Response(
            {
                'message': 'Login successful.',
                'tokens': tokens,
                'user': UserProfileSerializer(user).data,
            },
            status=status.HTTP_200_OK
        )


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [GoogleAuthThrottle]

    def post(self, request):
        google_token = request.data.get('token')

        if not google_token:
            return Response(
                {'error': 'Google token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify token with Google
            id_info = google.oauth2.id_token.verify_oauth2_token(
                google_token,
                google.auth.transport.requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = id_info.get('email')
            full_name = id_info.get('name', '')

            if not email:
                return Response(
                    {'error': 'Email not provided by Google.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'full_name': full_name,
                    'auth_provider': 'google',
                    'phone_number': '',
                    'is_verified': True,
                }
            )

            # Prevent password login for Google users
            if created:
                user.set_unusable_password()
                user.save()

                notify_user(
                    user,
                    'Welcome!',
                    'Your Google account was linked successfully.'
                )

            tokens = get_tokens_for_user(user.id, user.email)

            return Response(
                {
                    'message': 'Google login successful.',
                    'tokens': tokens,
                    'user': UserProfileSerializer(user).data,
                    'created': created,
                },
                status=status.HTTP_200_OK
            )

        except ValueError:
            return Response(
                {'error': 'Invalid Google token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception:
            return Response(
                {'error': 'Authentication failed.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================================================
# USER PROFILE
# =========================================================

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user

        cache_key = f'user_profile_{user.id}'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        data = UserProfileSerializer(user).data

        # Cache for 5 minutes
        cache.set(cache_key, data, timeout=300)

        return Response(data)

    def patch(self, request):
        user = request.user

        serializer = UserProfileSerializer(
            user,
            data=request.data,
            partial=True
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        # Clear cache after update
        cache.delete(f'user_profile_{user.id}')

        return Response(
            {
                'message': 'Profile updated successfully.',
                'user': serializer.data,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ADDRESS MANAGEMENT
# =========================================================

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(
            user=self.request.user
        ).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


# =========================================================
# NOTIFICATIONS
# =========================================================

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(
            Notification,
            id=pk,
            user=request.user
        )

        if not notification.is_read:
            notification.is_read = True
            notification.save(update_fields=['is_read'])

        return Response(
            {'message': 'Notification marked as read.'},
            status=status.HTTP_200_OK
        )
