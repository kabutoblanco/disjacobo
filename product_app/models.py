from django.db import models
from django.utils.translation import ugettext_lazy as _
from user_app.models import Provider


# Create your models here.
class Trademark(models.Model):
    name = models.CharField(max_length=124)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.name)

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"


class Category(models.Model):
    name = models.CharField(max_length=124)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.name)

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"


class Product(models.Model):
    ref = models.CharField(max_length=12)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=64, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    trademark = models.ForeignKey(Trademark, on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.IntegerField(default=0)
    stock = models.IntegerField(default=0)
    capacity = models.IntegerField(default=0)
    price_cost = models.FloatField(default=0.0)
    price_sale = models.FloatField(default=0.0)
    is_store = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "[{}] {}".format(self.id, self.name)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        unique_together = ("ref", "amount")


class Image(models.Model):
    image = models.FileField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.code)

    class Meta:
        verbose_name = "Imagen"
        verbose_name_plural = "Imagenes"


class Quote(models.Model):
    price = models.FloatField(default=0.0)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    date_record = models.DateTimeField(auto_now=False)
    date_update = models.DateTimeField(auto_now=False)
