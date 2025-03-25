from courses.models import Group, ContentBlock, Lesson
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import (
    GroupSerializer,
    ContentBlockSerializer,
    ContentBlockListSerializer,
)
from rest_framework.authentication import SessionAuthentication
from users.models import UserLessonProgress
from openai_chats.utils import get_chat_messages


class GroupReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Group.objects.prefetch_related("module_set__lesson_set")


class LessonContentBlocksViewSet(
    viewsets.GenericViewSet, viewsets.mixins.ListModelMixin
):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ContentBlockListSerializer

    def list(self, request, lesson_uuid: str = None):
        try:
            lesson = Lesson.objects.get(uuid=lesson_uuid)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=404)

        content_blocks = ContentBlock.objects.filter(lesson=lesson).order_by("order")
        last_seen_block = content_blocks.first()

        user = request.user

        progress, is_created = UserLessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            defaults={
                "last_seen_block": last_seen_block,
                "procent_progress": round((1 / content_blocks.count()) * 100),
            },
        )

        blocks = []

        last_seen_block = progress.last_seen_block
        is_found_last_block = False
        for block in content_blocks:
            content = None
            if block.block_type in ["text", "output_dialog"]:
                content = block.content_html
            elif block.block_type in ["choices_field", "test"]:
                content = block.content_json
            else:
                content = block.content_text

            next_lesson_url = None
            if block.block_type == "button_next":
                next_lesson = (
                    Lesson.objects.filter(module=lesson.module, order__gt=lesson.order)
                    .order_by("order")
                    .first()
                )
                if next_lesson:
                    next_lesson_url = f"/lesson/{next_lesson.uuid}"

                progress.is_completed = True
                progress.procent_progress = 100
                progress.save()

            if block.uuid == last_seen_block.uuid:
                is_found_last_block = True

            is_exist_messages = False
            if block.block_type == "input_gpt":
                messages_data: list = get_chat_messages(user, block.uuid)
                if messages_data:
                    is_exist_messages = True
                    blocks += messages_data

            if (
                block.block_type not in ["button_continue", "input_gpt"]
                or is_found_last_block
            ):
                blocks.append(
                    {
                        "type": block.block_type,
                        "content": content if block.block_type != "input_gpt" else "",
                        "avatar": block.avatar if hasattr(block, "avatar") else None,
                        "uuid": block.uuid,
                        "nextLessonUrl": next_lesson_url,
                    }
                )
                if block.block_type == "input_gpt" and is_exist_messages:
                    blocks.append(
                        {
                            "type": "button_continue",
                            "content": _("Continue"),
                            "uuid": "",
                            "nextLessonUrl": next_lesson_url,
                        }
                    )

            if (
                block.block_type in ["button_continue", "input_gpt"]
                and is_found_last_block
            ):
                break

        return Response(
            {
                "blocks": blocks,
                "procent_progress": progress.procent_progress,
                "description": lesson.description,
                "title": lesson.title,
            }
        )


class LessonNextContentBlocksViewSet(
    viewsets.GenericViewSet, viewsets.mixins.ListModelMixin
):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ContentBlockListSerializer

    def list(self, request, lesson_uuid: str = None):
        try:
            lesson = Lesson.objects.get(uuid=lesson_uuid)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=404)

        content_blocks = ContentBlock.objects.filter(lesson=lesson).order_by("order")
        last_seen_block = content_blocks.first()
        blocks_count: int = content_blocks.count()

        user = request.user

        progress, is_created = UserLessonProgress.objects.get_or_create(
            user=user, lesson=lesson, defaults={"last_seen_block": last_seen_block}
        )

        blocks: list = []

        last_seen_block = progress.last_seen_block
        is_found_last_block = False
        is_next_block = False
        next_block_conter: int = 0
        for block in content_blocks:
            next_block_conter += 1
            content = None
            if block.block_type in ["text", "output_dialog"]:
                content = block.content_html
            elif block.block_type in ["choices_field", "test"]:
                content = block.content_json
            else:
                content = block.content_text

            next_lesson_url = None
            if block.block_type == "button_next":
                next_lesson = (
                    Lesson.objects.filter(module=lesson.module, order__gt=lesson.order)
                    .order_by("order")
                    .first()
                )
                if next_lesson:
                    next_lesson_url = f"/lesson/{next_lesson.uuid}"

                progress.is_completed = True
                progress.procent_progress = 100
                progress.save()

            if is_found_last_block and block.block_type == "text":
                is_next_block = True
                progress.last_seen_block = block
                progress.procent_progress = round(
                    (next_block_conter / blocks_count) * 100
                )
                progress.save()

            is_exist_messages = False
            if block.block_type == "input_gpt" and is_found_last_block:
                messages_data: list = get_chat_messages(user, block.uuid)
                if messages_data:
                    is_exist_messages = True
                    # blocks += messages_data

            if is_next_block:
                blocks.append(
                    {
                        "type": block.block_type,
                        "content": content if block.block_type != "input_gpt" else "",
                        "avatar": block.avatar if hasattr(block, "avatar") else None,
                        "uuid": block.uuid,
                        "nextLessonUrl": next_lesson_url,
                    }
                )
                if block.block_type == "input_gpt" and is_exist_messages:
                    blocks.append(
                        {
                            "type": "button_continue",
                            "content": _("Continue"),
                            "uuid": "",
                            "nextLessonUrl": next_lesson_url,
                        }
                    )

            if block.uuid == last_seen_block.uuid:
                is_found_last_block = True
                continue

            if (
                (block.block_type in ["button_continue", "input_gpt"])
                and is_found_last_block
                and is_next_block
            ):
                break

        return Response(
            {
                "blocks": blocks,
                "procent_progress": progress.procent_progress
            }
        )
