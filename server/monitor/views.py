from django.shortcuts import render
from rest_framework import generics, viewsets, filters
from django.http import JsonResponse, HttpResponse
from django_q.tasks import async_task, result
from django.db.models import Avg, Max, Min

from .models import Monitor, Status
from .serializers import MonitorSerializer, StatusSerializer
from .utils import create_status_entry, generic_ping
from .tasks import refresh_monitors


class MonitorViewSet(viewsets.ModelViewSet):
    queryset = Monitor.objects.all()
    serializer_class = MonitorSerializer


class StatusView(generics.ListCreateAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

    def create(self, request, *args, **kwargs):
        name = self.request.query_params.get("name")
        host = MonitorSerializer(Monitor.objects.get(name=name)).data["host"]
        try:
            previous_status = Status.objects.filter(name=name).order_by("-id")[0]
        except:
            previous_status = False

        if host is not None:
            try:
                status_entry = create_status_entry(name)
                status_entry.save()
                obj = StatusSerializer(status_entry).data
                return JsonResponse(obj)
            except Exception as e:
                return JsonResponse({"Result": f"Failed: {e}"})


class CurrentStatusView(generics.ListAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

    def get(self, request, *args, **kwargs):
        name = self.request.query_params.get("name")
        monitors = Monitor.objects.all()
        current_status_obj = []

        if name:
            obj = StatusSerializer(Status.objects.filter(name=name).latest("id")).data
            return JsonResponse(obj)

        else:
            latest_status = Status.objects.order_by("name", "-id").distinct("name")
            obj = StatusSerializer(latest_status, many=True).data

            for status in obj:
                try:
                    status_set = Status.objects.filter(host=status["host"])
                    total_status_entries = float(status_set.count())

                    total_alive_count = float(
                        Status.objects.filter(
                            host=status["host"], is_alive=True
                        ).count()
                    )

                    response_time_average = status_set.aggregate(Avg("response_time"))
                    response_time_max = status_set.aggregate(Max("response_time"))

                    uptime = str(
                        float(round(total_alive_count / total_status_entries, 3))
                    )
                except:
                    uptime = "0.0"

                status.update(
                    {
                        "uptime": uptime,
                        "average_response_time": response_time_average[
                            "response_time__avg"
                        ],
                        "max_response_time": response_time_max["response_time__max"],
                    }
                )
                current_status_obj.append(status)
            return JsonResponse(current_status_obj, safe=False)


class RefreshAll(generics.ListAPIView):
    queryset = Monitor.objects.all()
    serializer_class = MonitorSerializer

    def get(self, request, *args, **kwargs):
        refresh_monitors()
        return JsonResponse({"Succeeded": "True"})


class GlobalStats(generics.ListAPIView):
    queryset = Monitor.objects.all()

    def get(self, request, *args, **kwargs):
        all_status = Status.objects.all()
        alive_status = Status.objects.filter(is_alive=True)
        total_alive_count = alive_status.count()

        currently_alive_count = (
            Status.objects.order_by("name", "-id")
            .distinct("name")
            .filter(is_alive=True)
        ).count()

        monitor_count = Monitor.objects.all().count()
        uptime_percentage = total_alive_count / all_status.count()
        response_time_average = all_status.aggregate(Avg("response_time"))[
            "response_time__avg"
        ]
        response_time_max = all_status.aggregate(Max("response_time"))[
            "response_time__max"
        ]
        response_time_min = all_status.aggregate(Min("response_time"))[
            "response_time__min"
        ]

        alive_response_time_average = alive_status.aggregate(Avg("response_time"))[
            "response_time__avg"
        ]

        alive_response_time_max = alive_status.aggregate(Max("response_time"))[
            "response_time__max"
        ]
        alive_response_time_min = alive_status.aggregate(Min("response_time"))[
            "response_time__min"
        ]

        return JsonResponse(
            {
                "monitor_count": monitor_count,
                "monitor_alive_count": currently_alive_count,
                "uptime_percentage": uptime_percentage,
                "response_time_average": response_time_average,
                "response_time_max": response_time_max,
                "response_time_min": response_time_min,
                "alive_response_time_average": alive_response_time_average,
                "alive_response_time_max": alive_response_time_max,
                "alive_response_time_min": alive_response_time_min,
            }
        )


class UptimeView(generics.ListAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

    def get(self, request, *args, **kwargs):
        name = self.request.query_params.get("name")

        if name:
            total_status_entries = float(
                Status.objects.filter(name=Monitor.objects.get(name=name)).count()
            )

            total_alive_entries = float(
                Status.objects.filter(
                    name=Monitor.objects.get(name=name), is_alive=True
                ).count()
            )

            uptime = total_alive_entries / total_status_entries

            obj = {
                "name": name,
                "uptime": uptime,
            }
            return JsonResponse(obj)
        else:
            obj = []
            monitors = Monitor.objects.all()
            for monitor in monitors:
                try:
                    total_status_entries = float(
                        Status.objects.filter(name=monitor).count()
                    )
                    total_alive_entries = float(
                        Status.objects.filter(name=monitor, is_alive=True).count()
                    )
                    uptime = total_alive_entries / total_status_entries

                except:
                    uptime = "0.0"

                obj.append(
                    {"name": MonitorSerializer(monitor).data["name"], "uptime": uptime}
                )

            return JsonResponse(obj, safe=False)
