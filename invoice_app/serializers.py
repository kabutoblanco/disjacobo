from rest_framework import serializers
from .models import Buy, Sale, Detail, Pay, Invoice
from user_app.models import User
from product_app.serializers import ProductSerializer


# Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", )

class BuySerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Buy
        fields = ("id", "ref", "user", "total", "date_record")


class SaleSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Sale
        fields = ("id", "ref", "user", "total", "date_record")


class DetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Detail
        fields = ("id", "amount", "product")


# Registers
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


class RegisterPaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pay
        fields = "__all__"

    def create(self, validated_data):
        return Pay.objects.create(**validated_data)
