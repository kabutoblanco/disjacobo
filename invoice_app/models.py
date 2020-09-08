from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.utils.translation import ugettext_lazy as _
from polymorphic.models import PolymorphicModel
from product_app.models import Metaproduct, Product, Duty, Presentation
from user_app.models import User
# from .serializers import RegisterDetailSerializer

import pytz
import datetime as dt


# Create your models here.
class Invoice(PolymorphicModel):
    TYPE_CHOICES = ((1, _("CONTADO")), (2, _("CREDITO")))

    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             blank=True,
                             null=True)
    type = models.IntegerField(choices=TYPE_CHOICES, default=1)
    reteiva = models.FloatField(default=0.0)
    reteica = models.FloatField(default=0.0)
    retefuente = models.FloatField(default=0.0)
    home_delivery = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=False)
    date_update = models.DateTimeField(auto_now=False)

    def record_details(self, validated_data):
        details = validated_data["details"]
        serializer_detail = validated_data["serializer"]
        is_sale = validated_data["is_sale"]
        for detail in details:
            detail["invoice"] = self.id
            product = Product.objects.get(pk=detail["product"])
            if is_sale:
                product.stock -= detail["amount"]
            else:
                product.stock += detail["amount"]
            product.save()
            serializer = serializer_detail(data=detail)
            serializer.is_valid(raise_exception=True)
            serializer.save()

    def record_payments(self, validated_data):
        payments = validated_data["payments"]
        serializer_payment = validated_data["serializer"]
        is_sale = validated_data["is_sale"]
        for payment in payments:
            payment["invoice"] = self.id
            serializer = serializer_payment(data=payment)
            serializer.is_valid(raise_exception=True)
            serializer.save()

    def __str__(self):
        return "[{}] {}".format(self.id, self.total)


class Detail(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    product = models.ForeignKey(Product,
                                on_delete=models.CASCADE)
    amount = models.FloatField(default=0.0)
    ico = models.FloatField(default=0.0)
    iva = models.FloatField(default=0.0)
    discount = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0)
    is_promo = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "[{}] {}".format(self.id, self.invoice)

    class Meta:
        verbose_name = "Detalle"
        verbose_name_plural = "Detalles"


class Pay(models.Model):
    TYPE_CHOICES = ((1, _("CASH")), (2, _("CREDIT_CARD")), (3, _("DEBIT_CARD")), (4, _(
        "PSE")), (6, _("DEPOSIT")), (7, _("TRANSFER")))

    ref = models.CharField(max_length=32, unique=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             blank=True,
                             null=True)
    type = models.IntegerField(choices=TYPE_CHOICES, default=1)
    payment = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "[{}] {}".format(self.ref, self.invoice)

    class Meta:
        verbose_name = "Pago"
        verbose_name_plural = "Pagos"


class Sale(Invoice):
    TYPE_CHOICES = ((1, _("LOCAL")), (2, _("DOMICILIO")))

    ref = models.CharField(max_length=32, unique=True)
    mode = models.IntegerField(choices=TYPE_CHOICES, default=1)

    class Meta:
        verbose_name = "Venta"
        verbose_name_plural = "Ventas"


class Buy(Invoice):
    ref = models.CharField(max_length=32, unique=True)

    class Meta:
        verbose_name = "Compra"
        verbose_name_plural = "Compras"
