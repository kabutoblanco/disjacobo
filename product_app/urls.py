from django.urls import path, include
from .api import MetaproductListAPI, ProductListAPI, CategoryListAPI, TrademarkListAPI, PresentationListAPI, RegisterMetaproductAPI, RegisterProductAPI, UpdateProductAPI

urlpatterns = [
    path('api/category', CategoryListAPI.as_view()),
    path('api/trademark', TrademarkListAPI.as_view()),
    path('api/presentation', PresentationListAPI.as_view()),
    path('api/metaproduct', MetaproductListAPI.as_view()),
    path('api/metaproduct/add', RegisterMetaproductAPI.as_view()),
    path('api/product/<int:category>/category', ProductListAPI.as_view()),
    path('api/product/add', RegisterProductAPI.as_view()),
    path('api/product/<int:id>', UpdateProductAPI.as_view()),
]
