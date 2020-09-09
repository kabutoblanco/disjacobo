from rest_framework import generics
from rest_framework.response import Response
from .models import Sale, Buy, Detail
from .serializers import SaleSerializer, BuySerializer, DetailSerializer, RegisterSaleSerializer, RegisterBuySerializer, RegisterDetailSerializer, RegisterPaymentSerializer, RegisterInvoiceSerializer

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
                invoice__date_record__range=(today_min, today_max))
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
                    invoice__date_record__range=(today_min, today_max))
        else:
            queryset = Buy.objects.all()
        return Response({"buys": BuySerializer(queryset, many=True).data})


class DetailListAPI(generics.RetrieveAPIView):
    serializer_class = DetailSerializer

    def get(self, request, *args, **kwargs):
        queryset = Detail.objects.filter(invoice=kwargs["invoice"])
        return Response({"details": DetailSerializer(queryset, many=True).data})


class RegisterSaleAPI(generics.GenericAPIView):
    serializer_class = RegisterInvoiceSerializer

    def post(self, request, *args, **kwargs):
        print(request.data["invoice"])
        serializer = self.get_serializer(data=request.data["invoice"])
        serializer.is_valid(raise_exception=True)
        sale = serializer.save()
        sale.record_details({
            "details": request.data["details"],
            "serializer": RegisterDetailSerializer,
            "is_sale": True
        })
        sale.record_payments({
            "payments": request.data["payments"],
            "serializer": RegisterPaymentSerializer,
            "is_sale": True
        })
        sale = sale.record_sale({
            "sale": request.data["sale"],
            "serializer": RegisterSaleSerializer
        })
        return Response({"sale": SaleSerializer(sale).data, })


class RegisterBuyAPI(generics.GenericAPIView):
    serializer_class = RegisterInvoiceSerializer

    def post(self, request, *args, **kwargs):
        print(request.data["invoice"])
        serializer = self.get_serializer(data=request.data["invoice"])
        serializer.is_valid(raise_exception=False)
        buy = serializer.save()
        buy.record_details({
            "details": request.data["details"],
            "serializer": RegisterDetailSerializer,
            "is_sale": False
        })
        buy.record_payments({
            "payments": request.data["payments"],
            "serializer": RegisterPaymentSerializer,
            "is_sale": False
        })
        buy = buy.record_buy({
            "buy": request.data["buy"],
            "serializer": RegisterBuySerializer
        })
        return Response({"buy": BuySerializer(buy).data, })
