from copy import error
import requests
from django.utils import timezone
from django.conf import settings

from .models import Monitor, Status
from .serializers import MonitorSerializer, StatusSerializer


def generic_ping(url):
    try:
        ping = requests.get(url)

        req_dict = {
            "host": url,
            "is_alive": ping.status_code == requests.codes.ok,
            "status_code": ping.status_code,
            "response_time": round(ping.elapsed.total_seconds(), 4),
            "checked_at": timezone.now(),
        }

        return req_dict

    except requests.exceptions.RequestException as e:
        raise SystemExit(e)


def create_status_entry(name):
    host = MonitorSerializer(Monitor.objects.get(name=name)).data["host"]

    try:
        previous_status = StatusSerializer(
            Status.objects.filter(name=name).order_by("-id")[0]
        ).data["is_alive"]
    except:
        # Set to false by default if there are no entries
        previous_status = False

    ping = generic_ping(host)

    status_entry = Status(
        host=host,
        name=Monitor.objects.get(name=name),
        is_alive=ping["is_alive"],
        is_alive_previous=previous_status,
        status_code=ping["status_code"],
        response_time=ping["response_time"],
        checked_at=ping["checked_at"],
    )

    return status_entry


def refresh_monitor_status(m):
    try:
        status_entry = create_status_entry(m["name"])
        status_entry.save()
        return {"Monitor": m["name"], "Status": "Success"}
    except Exception as e:
        return {"Monitor": m["name"], "Status": f"Failed: {e}"}


def refresh_hook(task):
    print(task.result)


if __name__ == "__main__":
    settings.configure()

    print(generic_ping("https://google.com/"))
