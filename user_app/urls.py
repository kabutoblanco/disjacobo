from django.urls import path, include
from .api import RegisterAPI, UpdateAPI, UserAPI, LoginAPI, ListProvidersAPI, ListClientAPI
from knox import views as knox_views

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/update', UpdateAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),

    path('api/provider', ListProvidersAPI.as_view()),
    path('api/client', ListClientAPI.as_view()),
]