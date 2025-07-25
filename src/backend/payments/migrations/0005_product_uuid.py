# Generated by Django 5.1.4 on 2025-05-25 12:37

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0004_cloudpaymentoptions'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, help_text='Unique identifier for the product', unique=True),
        ),
    ]
