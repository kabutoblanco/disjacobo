from django.contrib import admin
from .models import Buy, Detail, Invoice, Payment, Sale

# Register your models here.
admin.site.register(Buy)
admin.site.register(Detail)
admin.site.register(Invoice)
admin.site.register(Payment)
admin.site.register(Sale)
