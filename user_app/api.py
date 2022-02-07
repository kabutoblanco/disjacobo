from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.auth import AuthToken
from .models import User, Provider, Client
from .serializers import UserSerializer, RegisterSerializer, UpdateSerializer, LoginSerializer, UserCustomSerializer


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user":
            UserSerializer(user, context=self.get_serializer_context()).data,
            "token":
            AuthToken.objects.create(user)[1]
        })


class UpdateAPI(generics.GenericAPIView):
    serializer_class = UpdateSerializer

    def post(self, request, *args, **kwargs):
        user = User.objects.get(username=request.data['username'])
        serializer = self.get_serializer(instance=user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user":
            UserSerializer(user, context=self.get_serializer_context()).data,
            "token":
            AuthToken.objects.create(user)[1]
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user":
            UserSerializer(user, context=self.get_serializer_context()).data,
            "token":
            AuthToken.objects.create(user)[1]
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ListProvidersAPI(generics.RetrieveAPIView):
    serializer_class = UserCustomSerializer

    def get(self, request, *args, **kwargs):
        queryset = Provider.objects.all()
        return Response({"providers": UserCustomSerializer(queryset, many=True).data})


class ListClientAPI(generics.RetrieveAPIView):
    serializer_class = UserCustomSerializer

    def get(self, request, *args, **kwargs):
        queryset = Client.objects.all()
        return Response({"clients": UserCustomSerializer(queryset, many=True).data})