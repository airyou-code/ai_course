from rest_framework import serializers

from courses.models import ContentBlock, Group, Lesson, Module
from users.models import CourseUser


class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ["block_type", "content_html", "content_text", "content_json"]


class ContentBlockListSerializer(serializers.ModelSerializer):
    blocks = ContentBlockSerializer(many=True)

    class Meta:
        model = Lesson
        fields = ["blocks"]


class LessonSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    is_locked = serializers.SerializerMethodField()
    # content_blocks = ContentBlockSerializer(
    #     many=True, read_only=True, source="contentblock_set"
    # )

    class Meta:
        model = Lesson
        fields = [
            "title",
            "duration",
            "description",
            "progress",
            "is_completed",
            "is_locked",
            "uuid",
            # "content_blocks",
        ]

    def get_progress(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.get_progress(request.user)
        return None

    def get_is_completed(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.is_completed(request.user)
        return False

    def get_is_locked(self, obj):
        if obj.is_free:
            return False

        request = self.context.get("request")
        user: CourseUser = (
            request.user if request and request.user.is_authenticated else None
        )
        if user:
            # Check if the user has access to the lesson
            return not user.is_has_access(obj)

        return True


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True, source="lesson_set")

    class Meta:
        model = Module
        fields = ["title", "description", "lessons"]


class GroupSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True, source="module_set")

    class Meta:
        model = Group
        fields = ["title", "description", "modules"]
