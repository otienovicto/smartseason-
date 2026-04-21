from rest_framework import serializers
from .models import Field, FieldUpdate
from django.contrib.auth import get_user_model

User = get_user_model()


class FieldUpdateSerializer(serializers.ModelSerializer):
    agent = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = FieldUpdate
        fields = ("id", "field", "agent", "stage", "notes", "created_at")
        read_only_fields = ("id", "agent", "created_at")


class FieldSerializer(serializers.ModelSerializer):
    assigned_agent = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Field
        fields = ("id", "name", "crop_type", "planting_date", "current_stage", "assigned_agent", "created_by", "created_at", "status")
        read_only_fields = ("id", "created_by", "created_at", "status")
