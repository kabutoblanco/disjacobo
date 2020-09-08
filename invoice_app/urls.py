from django.urls import path, include
from .api import SaleListAPI, BuyListAPI, DetailListAPI, RegisterSaleAPI, RegisterBuyAPI

urlpatterns = [
    path('api/sale', SaleListAPI.as_view()),
    path('api/buy', BuyListAPI.as_view()),
    path('api/detail/<int:invoice>/invoice', DetailListAPI.as_view()),
    path('api/sale/add', RegisterSaleAPI.as_view(), name='create_sale'),
    path('api/buy/add', RegisterBuyAPI.as_view(), name='create_buy'),
    path('api/sale/<str:date>', SaleListAPI.as_view()),
    path('api/buy/<str:date>', BuyListAPI.as_view()),
]
