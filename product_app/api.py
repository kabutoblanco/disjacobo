from rest_framework import generics
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer, RegisterProductSerializer, UpdateProductSerializer

import json


class CategoryListAPI(generics.RetrieveAPIView):
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        queryset = Category.objects.all()
        return Response({"categories": CategorySerializer(queryset, many=True).data})


class ProductListAPI(generics.RetrieveAPIView):
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        queryset = Product.objects.all()
        return Response({"products": ProductSerializer(queryset, many=True).data})


# Registry
class RegisterProductAPI(generics.GenericAPIView):
    serializer_class = RegisterProductSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response({
            "product":
            ProductSerializer(
                product, context=self.get_serializer_context()).data,
        })


class UpdateProductAPI(generics.GenericAPIView):
    serializer_class = UpdateProductSerializer

    def post(self, request, *args, **kwargs):
        product = Product.objects.get(pk=kwargs["id"])
        serializer = self.get_serializer(instance=product, data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response({
            "product":
            ProductSerializer(product,
                              context=self.get_serializer_context()).data
        })
