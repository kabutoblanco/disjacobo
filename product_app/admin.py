from django.contrib import admin
from .models import Category, Product, Quote, Trademark

# Register your models here.
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Quote)
admin.site.register(Trademark)