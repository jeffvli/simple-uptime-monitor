from django.shortcuts import render
from rest_framework import generics, viewsets, filters
from django.http import JsonResponse, HttpResponse
from django_q.tasks import async_task, result


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

        if name:
            obj = StatusSerializer(Status.objects.filter(name=name).latest("id")).data
            return JsonResponse(obj)

        else:
            latest_status = Status.objects.order_by("name", "-id").distinct("name")
            obj = StatusSerializer(latest_status, many=True).data
            return JsonResponse(obj, safe=False)


class RefreshAll(generics.ListAPIView):
    queryset = Monitor.objects.all()
    serializer_class = MonitorSerializer

    def get(self, request, *args, **kwargs):
        refresh_monitors()
        return JsonResponse({"Succeeded": "True"})


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

            uptime = round(total_alive_entries / total_status_entries, 3)

            obj = {
                "name": name,
                "uptime": uptime,
            }
            return JsonResponse(obj)
        else:
            obj = []
            # monitors = StatusSerializer(Status.objects.distinct("host")).data
            # print(monitors)

            monitors = Monitor.objects.all()

            for monitor in monitors:

                try:
                    total_status_entries = float(
                        Status.objects.filter(name=monitor).count()
                    )

                    total_alive_entries = float(
                        Status.objects.filter(name=monitor, is_alive=True).count()
                    )

                    uptime = str(
                        float(round(total_alive_entries / total_status_entries, 3))
                    )
                except:
                    uptime = "0.0"

                obj.append(
                    {"name": MonitorSerializer(monitor).data["name"], "uptime": uptime}
                )

            return JsonResponse(obj, safe=False)
