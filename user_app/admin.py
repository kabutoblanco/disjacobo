from django.contrib import admin
from .models import User, Employee, Client, Provider, Adviser

# Register your models here.
admin.site.register(User)
admin.site.register(Employee)
admin.site.register(Client)
admin.site.register(Provider)
admin.site.register(Adviser)