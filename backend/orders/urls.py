from django.urls import path
from .views import (
    OrderListCreateView, OrderDetailView,
    AdminOrderListView, AdminOrderStatusUpdateView,
    AdminAssignDriverView, DriverOrderListView,
    DriverOrderStatusUpdateView
)

urlpatterns = [
    # Customer
    path('',                              OrderListCreateView.as_view(),
         name='order-list-create'),
    path('<int:pk>/',                     OrderDetailView.as_view(),
         name='order-detail'),

    # Admin
    path('admin/all/',                    AdminOrderListView.as_view(),
         name='admin-order-list'),
    path('admin/<int:pk>/status/',
         AdminOrderStatusUpdateView.as_view(), name='admin-order-status'),
    path('admin/<int:pk>/assign-driver/',
         AdminAssignDriverView.as_view(),      name='admin-assign-driver'),

    # Driver
    path('driver/assigned/',
         DriverOrderListView.as_view(),        name='driver-orders'),
    path('driver/<int:pk>/status/',
         DriverOrderStatusUpdateView.as_view(), name='driver-order-status'),
]
