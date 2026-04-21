from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from django.shortcuts import get_object_or_404

from .models import Field
from .serializers import FieldSerializer, FieldUpdateSerializer
from common.permissions import IsAssignedAgentOrAdmin, IsAdminRole


class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all().order_by("id")
    serializer_class = FieldSerializer
    permission_classes = (IsAuthenticated, IsAssignedAgentOrAdmin)

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", "").upper() == "ADMIN":
            return Field.objects.all().order_by("id")
        # agents only see assigned fields
        return Field.objects.filter(assigned_agent=user).order_by("id")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_permissions(self):
        # Admins only for create/update/destroy
        if self.action in ("create", "update", "partial_update", "destroy"):
            permission_classes = (IsAuthenticated, IsAdminRole)
        else:
            permission_classes = (IsAuthenticated, IsAssignedAgentOrAdmin)
        return [p() for p in permission_classes]

    @action(detail=True, methods=["get", "post"], url_path="updates")
    def updates(self, request, pk=None):
        """List or create updates for a field. POST will create a FieldUpdate and update Field.current_stage."""
        field = get_object_or_404(Field, pk=pk)

        # object-level permission check
        for perm in self.get_permissions():
            if hasattr(perm, "has_object_permission"):
                if not perm.has_object_permission(request, self, field):
                    return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        if request.method == "GET":
            updates = field.updates.order_by("-created_at")
            serializer = FieldUpdateSerializer(updates, many=True)
            return Response(serializer.data)

        # POST
        serializer = FieldUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        update = serializer.save(agent=request.user, field=field)

        # update field current_stage
        if update.stage:
            field.current_stage = update.stage
            field.save()

        return Response(FieldUpdateSerializer(update).data, status=status.HTTP_201_CREATED)
