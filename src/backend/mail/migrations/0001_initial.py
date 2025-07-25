# Generated by Django 4.2.3 on 2024-08-26 14:17

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Mail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('email', models.CharField(max_length=255)),
                ('is_send', models.BooleanField(default=False)),
                ('subject', models.CharField(max_length=500, verbose_name='Subject')),
                ('body', models.TextField()),
                ('created_at', models.DateTimeField(auto_now=True, verbose_name='Created at')),
            ],
        ),
    ]
