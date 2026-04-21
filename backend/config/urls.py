from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Simple API root (optional but useful)
@api_view(["GET"])
def api_root(request):
    return Response({
        "message": "SmartSeason API is running",
        "status": "ok"
    })

urlpatterns = [
    path("", api_root),  # safe landing endpoint

    path("admin/", admin.site.urls),

    # JWT auth
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # apps
    path("api/users/", include("apps.users.urls")),
    path("api/fields/", include("apps.fields.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
]
