from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Avg, Sum, Count
from .models import Sale, Buy, Detail, Invoice
from django.http import HttpResponse, JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.functions import TruncDay, TruncMonth, TruncYear, TruncDate
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_202_ACCEPTED
)
from .serializers import SaleSerializer, BuySerializer, DetailSerializer, RegisterSaleSerializer, RegisterBuySerializer, RegisterDetailSerializer, RegisterPaymentSerializer, RegisterInvoiceSerializer, SaleStatisticsSerializer, DetailAuxSerializer

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
            elif kwargs["date"] == "last_week":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=7), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Sale.objects.filter(
                    invoice__date_record__range=(today_min, today_max))
                queryset = queryset.extra({'date': "date(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))"}).values(
                    'date').annotate(total=Sum('invoice__total'), util=Sum('util'))
                instances = {"sales": list(queryset)}
                return JsonResponse(instances, status=HTTP_200_OK, content_type="application/json")
            elif kwargs["date"] == "last_month":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=30), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Sale.objects.filter(
                    invoice__date_record__range=(today_min, today_max))
                queryset = queryset.extra({'date': "date(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))"}).values(
                    'date').annotate(total=Sum('invoice__total'), util=Sum('util'))
                instances = {"sales": list(queryset)}
                return JsonResponse(instances, status=HTTP_200_OK, content_type="application/json")
            elif kwargs["date"] == "last_4week":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=30), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Sale.objects.filter(
                    invoice__date_record__range=(today_min, today_max))
                queryset = queryset.extra(
                    {'year': "year(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))", 'week': "week(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))"}).values(
                    'year', 'week').annotate(total=Sum('invoice__total'), util=Sum('util'))
                instances = {"sales": list(queryset)}
                return JsonResponse(instances, status=HTTP_200_OK, content_type="application/json")
            else:
                split = kwargs['date'].split('-')
                print(*split)
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.datetime(int(split[0]), int(split[1]), int(split[2])), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.datetime(int(split[0]), int(split[1]), int(split[2])), dt.time.max))
                queryset = Sale.objects.filter(
                    invoice__date_record__range=(today_min, today_max))
        else:
            queryset = Sale.objects.all()
        return Response({"sales": SaleSerializer(queryset, many=True).data})


class CategoryHistoryAPI(generics.RetrieveAPIView):
    serializer_class = DetailAuxSerializer

    def get(self, request, *args, **kwargs):
        if kwargs["date"]:
            if kwargs["date"] == "last_month":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=30), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Detail.objects.filter(
                    date_record__range=(today_min, today_max), is_sale=True)
                queryset = queryset.values('product__category', 'product__category__name').annotate(
                    total=Sum('total'), util=Sum('util')).order_by('-util')[:6]
                instances = {"sales": list(queryset)}
            elif kwargs["date"] == "last_week":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=7), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Detail.objects.filter(
                    date_record__range=(today_min, today_max), is_sale=True)
                queryset = queryset.values('product__category', 'product__category__name').annotate(
                    total=Sum('total'), util=Sum('util')).order_by('-util')[:6]
                instances = {"sales": list(queryset)}
            elif kwargs["date"] == "last_2week":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=15), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Detail.objects.filter(
                    date_record__range=(today_min, today_max), is_sale=True)
                queryset = queryset.values('product__category', 'product__category__name').annotate(total=Sum('total'), util=Sum('util')).order_by('-util')[:6]
                instances = {"sales": list(queryset)}
            else:
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Detail.objects.filter(
                    date_record__range=(today_min, today_max), is_sale=True)
                queryset = queryset.values('product__category', 'product__category__name').annotate(total=Sum('total'), util=Sum('util')).order_by('-util')[:6]
                instances = {"sales": list(queryset)}
        return JsonResponse(instances, status=HTTP_200_OK, content_type="application/json")


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
            elif kwargs["date"] == "last_week":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=7), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Buy.objects.filter(
                    invoice__date_record__range=(today_min, today_max))
                print(queryset)
                queryset = queryset.extra({'date': "date(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))"}).values(
                    'date')
                instances = {"sales": list(queryset)}
                return JsonResponse(instances, status=HTTP_200_OK, content_type="application/json")
            elif kwargs["date"] == "last_month":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=30), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Buy.objects.filter(
                    invoice__date_record__range=(today_min, today_max))
                print(queryset)
                queryset = queryset.extra({'date': "date(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))"}).values(
                    'date')
                instances = {"sales": list(queryset)}
                return JsonResponse(instances, status=HTTP_200_OK, content_type="application/json")
            elif kwargs["date"] == "last_4week":
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today() - dt.timedelta(days=30), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.date.today(), dt.time.max))
                queryset = Buy.objects.filter(
                    invoice__date_record__range=(today_min, today_max))
                print(queryset)
                queryset = queryset.extra(
                    {'year': "year(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))", 'month': "month(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))", 'week': "week(CONVERT_TZ(invoice_app_sale.date_record, '+00:00', '-05:00'))"}).values(
                    'year', 'month', 'week')
                instances = {"sales": list(queryset)}
                return JsonResponse(instances, status=HTTP_200_OK, content_type="application/json")
            else:
                split = kwargs['date'].split('-')
                today_min = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.datetime(int(split[0]), int(split[1]), int(split[2])), dt.time.min))
                today_max = pytz.timezone('America/Bogota').localize(
                    dt.datetime.combine(dt.datetime(int(split[0]), int(split[1]), int(split[2])), dt.time.max))
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
        # sale.record_payments({
        #     "payments": request.data["payments"],
        #     "serializer": RegisterPaymentSerializer,
        # })
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
        # buy.record_payments({
        #     "payments": request.data["payments"],
        #     "serializer": RegisterPaymentSerializer,
        # })
        buy = buy.record_buy({
            "buy": request.data["buy"],
            "serializer": RegisterBuySerializer
        })
        return Response({"buy": BuySerializer(buy).data, })


class UploadBuysAPI(generics.GenericAPIView):
    serializer_class = RegisterInvoiceSerializer
    serializer_buy = RegisterBuySerializer
    serializer_detail = RegisterDetailSerializer
    serializer_payment = RegisterPaymentSerializer

    invoice = None

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES["csv_file"]
        if not csv_file.name.endswith(".csv"):
            return HttpResponse(status=HTTP_400_BAD_REQUEST)
        file_data = csv_file.read().decode("utf-8")
        lines = file_data.split("\n")
        response = "Revisar filas:\n"
        i = 0
        for line in lines:
            fields = line.split(",")
            if line and line == 0:
                # register invoice
                provider = User.objects.get(personal_id=fields[1])
                data = {"user": provider}
                data = json.dumps(data)
                data = json.loads(data)
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.invoice = serializer.save()
            if line and line == 1:
                # Register buy
                ref = fields[1]
                data = {"ref": ref, invoice: self.invoice}
                data = json.dumps(data)
                data = json.loads(data)
                serializer = self.serializer_buy(data=data)
                serializer.is_valid(raise_exception=True)
                buy = serializer.save()
            if line and i > 2:
                # register details
                ref_product = fields[0]
                amount_product = int(field[1])
                total = float(fields[3])
                amount = int(fields[4])
                product = Product.objects.get(
                    ref=ref_product, amount=amount_product)
                data = {"invoice": invoice, "product": product,
                        "amount": amount, "total": total}
                data = json.dumps(data)
                data = json.loads(data)
                serializer = self.serializer_detail(data=data)
                serializer.is_valid(raise_exception=True)
                detail = serializer.save()
            i += 1
        queryset = Product.objects.filter(id=0)
        return Response({"products": ProductSerializer(queryset, many=True).data})
