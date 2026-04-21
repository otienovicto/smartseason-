from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"", views.UserViewSet, basename="user")

urlpatterns = [
    path("me/", views.MeAPIView.as_view(), name="me"),
    path("register/", views.RegisterAPIView.as_view(), name="register"),
]

urlpatterns += router.urls
