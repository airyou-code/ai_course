from django.contrib.auth.models import User

from django_filters import rest_framework as filters
from .models import Task


class TaskFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    completed = filters.BooleanFilter()
    user = filters.ModelChoiceFilter(queryset=User.objects.all())

    class Meta:
        model = Task
        fields = ['title', 'completed', 'user']
