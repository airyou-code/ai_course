import uuid
from django.db import migrations

def fill_temp_uuid(apps, schema_editor):
    ContentBlock = apps.get_model('courses', 'ContentBlock')
    for obj in ContentBlock.objects.all():
        obj.uuid_temp = uuid.uuid4()
        obj.save()

class Migration(migrations.Migration):
    dependencies = [
        ('courses', '0009_contentblock_uuid_temp'),
    ]

    operations = [
        migrations.RunPython(fill_temp_uuid),
    ]