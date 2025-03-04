from rest_framework import serializers
from courses.models import Lesson, Group, Module, ContentBlock


class LessonSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['title', 'duration', 'description', 'progress', 'is_completed', 'is_locked', "is_free", "uuid"]

    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.get_progress(request.user)
        return None
    
    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_completed(request.user)
        return False


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True, source='lesson_set')

    class Meta:
        model = Module
        fields = ['title', 'description', 'lessons']


class GroupSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True, source='module_set')

    class Meta:
        model = Group
        fields = ['title', 'description', 'modules']


class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ['block_type', 'content_html', 'content_text', 'content_json']


class ContentBlockListSerializer(serializers.ModelSerializer):
    blocks = ContentBlockSerializer(many=True)

    class Meta:
        model = Lesson
        fields = ['blocks']
