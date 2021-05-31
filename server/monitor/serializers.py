from django.contrib.auth import get_user_model
from rest_framework import serializers, viewsets, permissions
from .models import Monitor, Status


class MonitorSerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"
        model = Monitor


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = [
            "id",
            "host",
            "name",
            "is_alive",
            "is_alive_previous",
            "status_code",
            "response_time",
            "checked_at",
            "note",
        ]
