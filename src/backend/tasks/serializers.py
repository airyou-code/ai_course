from core.serializers import CoreSerializer
from .models import Task


class TaskSerializer(CoreSerializer):
    class Meta:
        model = Task
        fields = "__all__"
