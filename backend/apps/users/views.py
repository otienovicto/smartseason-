from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from .serializers import UserSerializer, RegisterSerializer


User = get_user_model()


class RegisterAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class MeAPIView(APIView):
    """Return current authenticated user's data."""
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserViewSet(viewsets.ModelViewSet):
    """User endpoints. Admins can update/delete users; others can list/read."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        # Only admins can update or delete users
        if self.action in ("update", "partial_update", "destroy"):
            from common.permissions import IsAdminRole
            permission_classes = (IsAuthenticated, IsAdminRole)
        else:
            permission_classes = (IsAuthenticated,)
        return [p() for p in permission_classes]
