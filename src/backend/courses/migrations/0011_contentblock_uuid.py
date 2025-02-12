# filepath: /Users/artemkirillov/Coder/github/ai_course/src/backend/courses/migrations/XXXX_rename_uuid_temp.py
from django.db import migrations, models

def copy_temp_to_uuid(apps, schema_editor):
    ContentBlock = apps.get_model('courses', 'ContentBlock')
    for obj in ContentBlock.objects.all():
        obj.uuid = obj.uuid_temp
        obj.save()

class Migration(migrations.Migration):
    dependencies = [
        ('courses', '0010_contentblock_uuid_temp'),
    ]

    operations = [
        migrations.AddField(
            model_name='contentblock',
            name='uuid',
            field=models.UUIDField(editable=False, null=True),
        ),
        migrations.RunPython(copy_temp_to_uuid),
        migrations.AlterField(
            model_name='contentblock',
            name='uuid',
            field=models.UUIDField(editable=False, unique=True),
        ),
        migrations.RemoveField(
            model_name='contentblock',
            name='uuid_temp',
        ),
    ]