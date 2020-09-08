from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _


# Create your models here.
class User(AbstractUser):
    ID_CHOICES = (
        (1, _("CEDULA")),
        (2, _("CEDULA_EXTRANJERIA")),
        (3, _("TARJETA_IDENTIDAD")),
        (4, _("NIT")),
    )

    LEGAL_NATURE_CHOICES = (
        (1, _("NATURAL")),
        (2, _("JURIDICA")),
    )

    type_id = models.IntegerField(choices=ID_CHOICES, default=1)
    type_legal_nature = models.IntegerField(choices=LEGAL_NATURE_CHOICES, default=1)
    personal_id = models.CharField(max_length=14, unique=True)
    cellphone = models.CharField(max_length=16)
    telephone = models.CharField(max_length=16, blank=True)
    address = models.CharField(max_length=24, blank=True)
    neighborhod = models.CharField(max_length=24, blank=True)
    country = models.CharField(max_length=16, default="CO")
    government = models.CharField(max_length=16, blank=True)
    city = models.CharField(max_length=16, blank=True)

    def __str__(self):
        return "{} - {}".format(self.personal_id, self.username)

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


class Employee(models.Model):
    TYPE_CHOICES = (
        (1, _("ADMINISTRADOR")),
        (2, _("PRODUCTOR")),
        (3, _("VENDEDOR")),
    )
    
    type = models.IntegerField(choices=TYPE_CHOICES, default=1)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return "{}".format(self.user)

    class Meta:
        verbose_name = "Trabajador"
        verbose_name_plural = "Personal"


class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return "{}".format(self.user)

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"


class Provider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return "{}".format(self.user)

    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"


class Adviser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)

    def __str__(self):
        return "{}".format(self.user)

    class Meta:
        verbose_name = "Asesor"
        verbose_name_plural = "Asesores"

