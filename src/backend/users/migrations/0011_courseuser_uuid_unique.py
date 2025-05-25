import uuid
from django.db import migrations, models

def fill_uuid(apps, schema_editor):
    CourseUser = apps.get_model('users', 'CourseUser')
    for user in CourseUser.objects.all():
        # Обновляем поле у каждого пользователя, чтобы гарантировать уникальные значения
        user.uuid = uuid.uuid4()
        user.save(update_fields=['uuid'])

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_courseuser_uuid'),
    ]

    operations = [
        migrations.RunPython(fill_uuid, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='courseuser',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
