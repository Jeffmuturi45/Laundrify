from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.cache import cache
from rest_framework.response import Response
from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
    serializer_class   = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        cached = cache.get('services_list')
        if cached:
            return Response(cached)
        queryset = Service.objects.filter(is_active=True)
        data     = ServiceSerializer(queryset, many=True).data
        cache.set('services_list', data, timeout=600)
        return Response(data)


class ServiceCreateView(generics.CreateAPIView):
    serializer_class   = ServiceSerializer
    permission_classes = [IsAdminUser]


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = ServiceSerializer
    permission_classes = [IsAdminUser]
    queryset           = Service.objects.all()