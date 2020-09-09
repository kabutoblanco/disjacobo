from rest_framework import serializers
from .models import Buy, Sale, Detail, Payment, Invoice
from user_app.models import User
from product_app.serializers import ProductSerializer


# Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", )


class InvoiceSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Invoice
        fields = ("id", "user", "total", "date_record")


class BuySerializer(serializers.ModelSerializer):
    invoice = InvoiceSerializer()

    class Meta:
        model = Buy
        fields = ("id", "invoice", "ref")


class SaleSerializer(serializers.ModelSerializer):
    invoice = InvoiceSerializer()

    class Meta:
        model = Sale
        fields = ("id", "invoice", "ref")


class DetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Detail
        fields = ("id", "amount", "product")


# Registers
class RegisterInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"

    def create(self, validated_data):
        return Invoice.objects.create(**validated_data)


class RegisterSaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = "__all__"

    def create(self, validated_data):
        return Sale.objects.create(**validated_data)


class RegisterBuySerializer(serializers.ModelSerializer):
    class Meta:
        model = Buy
        fields = "__all__"

    def create(self, validated_data):
        return Buy.objects.create(**validated_data)


class RegisterDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detail
        fields = "__all__"

    def create(self, validated_data):
        return Detail.objects.create(**validated_data)


class RegisterPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"

    def create(self, validated_data):
        return Payment.objects.create(**validated_data)
