from django.urls import path, include
from .api import ProductListAPI, CategoryListAPI, RegisterProductAPI, UpdateProductAPI, ProductDetailAPI, UploadProductsAPI

urlpatterns = [
    path('api/category', CategoryListAPI.as_view()),
    path('api/product/<int:category>/category', ProductListAPI.as_view()),
    path('api/product/add', RegisterProductAPI.as_view()),
    path('api/product/<int:id>', UpdateProductAPI.as_view()),
    path('api/product/<int:id>/detail', ProductDetailAPI.as_view()),
    path('api/product/upload', UploadProductsAPI.as_view()),
]
