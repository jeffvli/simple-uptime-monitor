# Generated by Django 3.2 on 2021-05-23 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('host', models.CharField(max_length=512)),
                ('name', models.CharField(max_length=64)),
                ('is_alive', models.BooleanField(default=False)),
                ('status_code', models.IntegerField()),
                ('response_time', models.DecimalField(decimal_places=4, max_digits=5)),
                ('checked_at', models.DateTimeField()),
            ],
        ),
        migrations.RemoveField(
            model_name='monitor',
            name='id',
        ),
        migrations.AlterField(
            model_name='monitor',
            name='is_alive',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='monitor',
            name='name',
            field=models.CharField(max_length=64, primary_key=True, serialize=False),
        ),
    ]
