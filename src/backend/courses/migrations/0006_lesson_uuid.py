# Generated by Django 5.1.4 on 2025-01-26 15:08

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_remove_module_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
