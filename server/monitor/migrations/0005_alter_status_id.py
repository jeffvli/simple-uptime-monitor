# Generated by Django 3.2.3 on 2021-05-26 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0004_remove_monitor_is_alive'),
    ]

    operations = [
        migrations.AlterField(
            model_name='status',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]
