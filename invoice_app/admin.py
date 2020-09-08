from django.contrib import admin
from .models import Buy, Detail, Invoice, Pay, Sale

# Register your models here.
admin.site.register(Buy)
admin.site.register(Detail)
admin.site.register(Invoice)
admin.site.register(Pay)
admin.site.register(Sale)
