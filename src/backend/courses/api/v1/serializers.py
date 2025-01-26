from rest_framework import serializers
from courses.models import Lesson, Module, ContentBlock


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['title', 'duration', 'description', 'is_locked', "is_free"]


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True, source='lesson_set')

    class Meta:
        model = Module
        fields = ['title', 'description', 'lessons']


class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ['block_type', 'content_html', 'content_text', 'content_json']
