from rest_framework import generics
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.db.models import Avg, Sum, Count
from .models import Product, Category, Trademark
from invoice_app.models import Detail
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED
)
from .serializers import ProductSerializer, CategorySerializer, RegisterCategorySerializer, RegisterProductSerializer, UpdateProductSerializer, RegisterTrademarkSerializer, ProductDetailSerializer

import json
import pytz
import datetime as dt


class CategoryListAPI(generics.RetrieveAPIView):
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        queryset = Category.objects.all()
        return Response({"categories": CategorySerializer(queryset, many=True).data})


class ProductListAPI(generics.RetrieveAPIView):
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        category = kwargs["category"]
        if category == 0:
            queryset = Product.objects.all()
        else:
            queryset = Product.objects.filter(category=category)
        return Response({"products": ProductSerializer(queryset, many=True).data})


class ProductDetailAPI(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer

    def get(self, request, *args, **kwargs):
        id = kwargs["id"]
        today_min = pytz.timezone('America/Bogota').localize(
            dt.datetime.combine(dt.date.today() - dt.timedelta(days=7), dt.time.min))
        today_max = pytz.timezone('America/Bogota').localize(
            dt.datetime.combine(dt.date.today(), dt.time.max))
        queryset = Detail.objects.filter(
            product=id, is_sale=1, invoice__date_record__range=(today_min, today_max))
        print(queryset.count())
        queryset = queryset.values('product').annotate(
            total=Sum('amount'))
        if queryset.count() > 0:
            return Response({"detail": ProductDetailSerializer(queryset[0], context=self.get_serializer_context()).data})
        else:
            return Response({"detail": ProductDetailSerializer(queryset, context=self.get_serializer_context()).data})


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


class UploadProductsAPI(generics.GenericAPIView):
    serializer_class = RegisterProductSerializer
    serializer_category = RegisterCategorySerializer
    serializer_trademark = RegisterTrademarkSerializer

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES["csv_file"]
        if not csv_file.name.endswith(".csv"):
            return HttpResponse(status=HTTP_400_BAD_REQUEST)
        file_data = csv_file.read().decode("utf-8")
        lines = file_data.split("\n")
        response = "Revisar filas:\n"
        i = 0
        for line in lines:
            if line and i > 0:
                # print(line)
                fields = line.split(",")
                ref = fields[0]
                amount = fields[2]
                name = fields[1]
                price_cost = float(fields[4])
                price_sale = float(fields[5])
                try:
                    product = Product.objects.get(ref=ref, amount=amount)
                    if product.price_cost != price_cost or product.price_sale != price_sale or product.name != name or product.amount != amount:
                        product.price_cost = price_cost
                        product.price_sale = price_sale
                        product.name = name
                        product.amount = amount
                        product.save()
                except Product.DoesNotExist:
                    try:
                        category = Category.objects.get(name=fields[3])
                    except Category.DoesNotExist:
                        data = {"name": fields[3]}
                        data = json.dumps(data)
                        data = json.loads(data)
                        serializer = self.serializer_category(data=data)
                        serializer.is_valid(raise_exception=True)
                        category = serializer.save()
                        print(category)
                    try:
                        trademark = Trademark.objects.get(name=fields[6])
                    except Trademark.DoesNotExist:
                        data = {"name": fields[6]}
                        data = json.dumps(data)
                        data = json.loads(data)
                        serializer = self.serializer_trademark(data=data)
                        serializer.is_valid(raise_exception=True)
                        trademark = serializer.save()
                        print(trademark)
                    data = {"ref": ref, "name": fields[1], "amount": int(
                        amount), "category": int(category.id), "trademark": int(trademark.id), "price_cost": float(fields[4]), "price_sale": float(fields[5])}
                    data = json.dumps(data)
                    data = json.loads(data)
                    serializer = self.get_serializer(data=data)
                    serializer.is_valid(raise_exception=True)
                    product = serializer.save()
            i += 1
        queryset = Product.objects.filter(id=0)
        return Response({"products": ProductSerializer(queryset, many=True).data})
