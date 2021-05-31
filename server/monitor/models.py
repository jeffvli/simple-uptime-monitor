from django.db import models


class Monitor(models.Model):
    def __str__(self):
        return self.name + " - " + self.host

    name = models.CharField(primary_key=True, max_length=64)
    host = models.CharField(max_length=512)
    refresh_interval = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Status(models.Model):
    def __str__(self):
        return (
            str(self.id)
            + " - "
            + self.host
            + " - "
            + str(self.status_code)
            + " - "
            + str(self.checked_at)
        )

    id = models.BigAutoField(primary_key=True)
    host = models.CharField(max_length=512)
    name = models.ForeignKey(Monitor, on_delete=models.CASCADE)
    is_alive = models.BooleanField(default=False)
    is_alive_previous = models.BooleanField(default=False)
    status_code = models.IntegerField()
    response_time = models.DecimalField(max_digits=5, decimal_places=4)
    checked_at = models.DateTimeField()
    note = models.CharField(max_length=512, null=True)
