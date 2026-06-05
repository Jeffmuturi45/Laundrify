from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, GoogleAuthView,
    UserProfileView, AddressListCreateView,
    AddressDetailView, NotificationListView,
    MarkNotificationReadView
)

urlpatterns = [
    path('auth/register/',
         RegisterView.as_view(),           name='register'),
    path('auth/login/',
         LoginView.as_view(),              name='login'),
    path('auth/google/',                GoogleAuthView.as_view(),
         name='google-auth'),
    path('auth/token/refresh/',
         TokenRefreshView.as_view(),       name='token-refresh'),
    path('profile/',
         UserProfileView.as_view(),        name='profile'),
    path('addresses/',
         AddressListCreateView.as_view(),  name='addresses'),
    path('addresses/<int:pk>/',
         AddressDetailView.as_view(),      name='address-detail'),
    path('notifications/',
         NotificationListView.as_view(),   name='notifications'),
    path('notifications/<int:pk>/read/',
         MarkNotificationReadView.as_view(), name='notification-read'),
]
