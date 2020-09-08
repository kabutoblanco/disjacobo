from rest_framework import generics
from rest_framework.response import Response
from .models import (Metaproduct, Product, Category, Trademark, Presentation)
from .serializers import (MetaproductSerializer, ProductSerializer, CategorySerializer, TrademarkSerializer,
                          PresentationSerializer, RegisterMetaproductSerializer, RegisterProductSerializer, UpdateProductSerializer)

import json


class CategoryListAPI(generics.RetrieveAPIView):
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        queryset = Category.objects.all()
        return Response({"categories": CategorySerializer(queryset, many=True).data})


class TrademarkListAPI(generics.RetrieveAPIView):
    serializer_class = TrademarkSerializer

    def get(self, request, *args, **kwargs):
        queryset = Trademark.objects.all()
        return Response({"trademarks": TrademarkSerializer(queryset, many=True).data})


class PresentationListAPI(generics.RetrieveAPIView):
    serializer_class = PresentationSerializer

    def get(self, request, *args, **kwargs):
        queryset = Presentation.objects.all()
        return Response({"presentations": PresentationSerializer(queryset, many=True).data})


class MetaproductListAPI(generics.RetrieveAPIView):
    serializer_class = MetaproductSerializer

    def get(self, request, *args, **kwargs):
        queryset = Metaproduct.objects.all()
        return Response({"metaproducts": MetaproductSerializer(queryset, many=True).data})


class ProductListAPI(generics.RetrieveAPIView):
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        queryset = Product.objects.all()
        return Response({"products": ProductSerializer(queryset, many=True).data})


# Registry
class RegisterMetaproductAPI(generics.GenericAPIView):
    serializer_class = RegisterMetaproductSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        metaproduct = serializer.save()
        return Response({
            "metaproduct":
            MetaproductSerializer(
                metaproduct, context=self.get_serializer_context()).data,
        })


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
