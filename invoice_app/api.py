from rest_framework import generics
from rest_framework.response import Response
from .models import Sale, Buy, Detail
from .serializers import SaleSerializer, BuySerializer, DetailSerializer, RegisterSaleSerializer, RegisterBuySerializer, RegisterDetailSerializer, RegisterPaySerializer

import json
import pytz
import datetime as dt


class SaleListAPI(generics.RetrieveAPIView):
    serializer_class = SaleSerializer

    def get(self, request, *args, **kwargs):
        if kwargs["date"]:
            if kwargs["date"] == "today":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
            queryset = Sale.objects.filter(
                date_record__range=(today_min, today_max))
        else:
            queryset = Sale.objects.all()
        return Response({"sales": SaleSerializer(queryset, many=True).data})


class BuyListAPI(generics.RetrieveAPIView):
    serializer_class = BuySerializer

    def get(self, request, *args, **kwargs):
        if kwargs["date"]:
            if kwargs["date"] == "today":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Buy.objects.filter(
                    date_record__range=(today_min, today_max))
        else:
            queryset = Buy.objects.all()
        return Response({"buys": BuySerializer(queryset, many=True).data})


class DetailListAPI(generics.RetrieveAPIView):
    serializer_class = DetailSerializer

    def get(self, request, *args, **kwargs):
        queryset = Detail.objects.filter(invoice=kwargs["invoice"])
        return Response({"details": DetailSerializer(queryset, many=True).data})


class RegisterSaleAPI(generics.RetrieveAPIView):
    serializer_class = RegisterSaleSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data["sale"])
        serializer.is_valid(raise_exception=True)
        sale = serializer.save()
        sale.record_details({
            "details": request.data["details"],
            "serializer": RegisterDetailSerializer,
            "is_sale": True
        })
        sale.record_payments({
            "payments": request.data["payments"],
            "serializer": RegisterPaySerializer,
            "is_sale": True
        })
        return Response({
            "sale": SaleSerializer(
                sale, context=self.get_serializer_context()).data,
        })


class RegisterBuyAPI(generics.RetrieveAPIView):
    serializer_class = RegisterBuySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data["buy"])
        serializer.is_valid(raise_exception=True)
        buy = serializer.save()
        buy.record_details({
            "details": request.data["details"],
            "serializer": RegisterDetailSerializer,
            "is_sale": False
        })
        buy.record_payments({
            "payments": request.data["payments"],
            "serializer": RegisterPaySerializer,
            "is_sale": False
        })
        return Response({
            "buy":
            BuySerializer(
                buy, context=self.get_serializer_context()).data,
        })
