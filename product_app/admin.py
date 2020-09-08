from django.contrib import admin
from .models import Category, Trademark, Metaproduct, Presentation, Product, Unit, Quote, Duty

# Register your models here.
admin.site.register(Category)
admin.site.register(Trademark)
admin.site.register(Metaproduct)
admin.site.register(Presentation)
admin.site.register(Product)
admin.site.register(Unit)
admin.site.register(Quote)
admin.site.register(Duty)