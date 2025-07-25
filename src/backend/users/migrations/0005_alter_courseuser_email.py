# Generated by Django 5.1.4 on 2025-05-07 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_userlessonprogress_is_completed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courseuser',
            name='email',
            field=models.EmailField(help_text='User email address, used as login and must be unique', max_length=254, unique=True, verbose_name='email address'),
        ),
    ]
