# Generated by Django 5.1.4 on 2025-02-28 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_userlessonprogress'),
    ]

    operations = [
        migrations.AddField(
            model_name='userlessonprogress',
            name='procent_progress',
            field=models.IntegerField(default=0),
        ),
    ]
