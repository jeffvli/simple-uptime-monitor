from django.urls import path
from rest_framework import permissions
from rest_framework.routers import SimpleRouter
from .views import (
    GlobalStats,
    MonitorViewSet,
    StatusView,
    CurrentStatusView,
    RefreshAll,
    UptimeView,
    GlobalStats,
)

router = SimpleRouter()
router.register("monitors", MonitorViewSet, basename="monitors")

urlpatterns = [
    path("status/", StatusView.as_view(), name="status"),
    path("currentstatus/", CurrentStatusView.as_view(), name="currentstatus"),
    path("refreshall/", RefreshAll.as_view(), name="refreshall"),
    path("uptime/", UptimeView.as_view(), name="uptime"),
    path("globalstats/", GlobalStats.as_view(), name="globalstats"),
]

urlpatterns += router.urls
