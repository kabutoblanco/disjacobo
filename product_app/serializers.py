from rest_framework import serializers
from .models import Metaproduct, Product, Presentation, Category, Trademark


# Serializers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")


class TrademarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trademark
        fields = ("id", "name")

class PresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presentation
        fields = ("id", "name", "amount")


class MetaproductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metaproduct
        fields = ("id", "name", "description")


class ProductSerializer(serializers.ModelSerializer):
    metaproduct = MetaproductSerializer()
    presentation = PresentationSerializer()

    class Meta:
        model = Product
        fields = ("id", "ref", "metaproduct", "presentation", "stock",
                  "capacity", "price_cost", "price_sale", "is_atomic")


# Registers
class RegisterMetaproductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metaproduct
        fields = "__all__"

    def create(self, validated_data):
        return Metaproduct.objects.create(**validated_data)


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


class RegisterPresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presentation
        fields = "__all__"

    def create(self, validated_data):
        presentation = Presentation.objects.create(validated_data)
        presentation.save()
        return presentation
