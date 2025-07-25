# Generated by Django 5.1.4 on 2025-01-26 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contentblock',
            name='block_type',
            field=models.CharField(choices=[('none', 'None'), ('text', 'Html Text Block'), ('output_dialog', 'Html Output Dialog'), ('button_next', 'Button (Next Lesson)'), ('button_continue', 'Button (Continue)'), ('choices_field', 'Choices Field'), ('test', 'Test'), ('input_gpt', 'Input to Chat GPT')], default='none', max_length=30),
        ),
    ]
