from django.urls import path
from .views import PaymentCreateView, PaymentDetailView, AdminPaymentListView

urlpatterns = [
    path('pay/',         PaymentCreateView.as_view(),  name='payment-create'),
    path('<int:pk>/',    PaymentDetailView.as_view(),  name='payment-detail'),
    path('admin/all/',   AdminPaymentListView.as_view(), name='admin-payments'),
]
