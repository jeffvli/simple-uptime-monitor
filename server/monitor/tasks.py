""" from django_q.tasks import schedule
from django_q.models import Schedule

from .utils import refresh_all_monitors


schedule(
    refresh_all_monitors,
    schedule_type=Schedule.MINUTES,
    minutes=1,
    repeats=-1,
)
 """
from django_q.tasks import async_task
from .models import Monitor
from .serializers import MonitorSerializer
from django_q.models import Schedule

from .utils import refresh_hook, refresh_monitor_status

"""
# Run in django shell to import scheduled tasks

from django_q.models import Schedule
from django_q.tasks import schedule


# 1 minute refresh monitors
schedule(
    "monitor.tasks.refresh_monitors",
    60,
    hook="monitor.utils.refresh_hook",
    schedule_type=Schedule.CRON,
    cron="*/1 * * * *",
)

# 5 minute refresh monitors
schedule(
    "monitor.tasks.refresh_monitors",
    300,
    hook="monitor.utils.refresh_hook",
    schedule_type=Schedule.CRON,
    cron="*/5 * * * *",
)

# 15 minute refresh monitors
schedule(
    "monitor.tasks.refresh_monitors",
    900,
    hook="monitor.utils.refresh_hook",
    schedule_type=Schedule.CRON,
    cron="*/15 * * * *",
)
 """


def refresh_monitors(refresh_interval=0):

    if refresh_interval == 0:
        monitors = Monitor.objects.all()
    else:
        monitors = Monitor.objects.filter(refresh_interval=refresh_interval)

    for monitor in monitors:
        serialized_monitor = MonitorSerializer(monitor).data
        async_task(refresh_monitor_status, serialized_monitor, hook=refresh_hook)
