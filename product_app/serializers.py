from rest_framework import serializers
from .models import Product, Category


# Serializers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "ref", "name", "stock", "amount",
                  "capacity", "price_cost", "price_sale")


# Registers
class RegisterProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):
        return Product.objects.create(**validated_data)


class UpdateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("stock", "price_cost", "price_sale")

    def update(self, instance, validated_data):
        instance.stock = validated_data["stock"]
        instance.price_cost = validated_data["price_cost"]
        instance.price_sale = validated_data["price_sale"]
        instance.save()
        return instance
