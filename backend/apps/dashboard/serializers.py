from rest_framework import serializers

class DashboardSerializer(serializers.Serializer):
    summary = serializers.DictField()
