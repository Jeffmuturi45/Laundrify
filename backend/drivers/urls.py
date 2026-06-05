from django.urls import path
from .views import (
    DriverLoginView, DriverProfileView,
    DriverLocationUpdateView, DriverNotificationListView,
    MarkDriverNotificationReadView,
    AdminDriverListCreateView, AdminDriverDetailView
)

urlpatterns = [
    path('auth/login/',                         DriverLoginView.as_view(),
         name='driver-login'),
    path('profile/',                            DriverProfileView.as_view(),
         name='driver-profile'),
    path('location/',
         DriverLocationUpdateView.as_view(),      name='driver-location'),
    path('notifications/',
         DriverNotificationListView.as_view(),    name='driver-notifications'),
    path('notifications/<int:pk>/read/',
         MarkDriverNotificationReadView.as_view(), name='driver-notif-read'),

    # Admin
    path('admin/list/',
         AdminDriverListCreateView.as_view(),     name='admin-driver-list'),
    path('admin/<int:pk>/',
         AdminDriverDetailView.as_view(),         name='admin-driver-detail'),
]
