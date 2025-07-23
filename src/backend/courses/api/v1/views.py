from django.utils.translation import gettext_lazy as _
from rest_framework import permissions, status, viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from courses.models import ContentBlock, Group, Lesson
from courses.utils import get_chat_messages
from users.models import CourseUser, UserLessonProgress, UserReview

from .serializers import (
    ContentBlockListSerializer,
    GroupSerializer,
)


class GroupReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        user = self.request.user
        return Group.objects.filter(course__language=user.language).prefetch_related(
            "module_set__lesson_set"
        )

    # def list(self, request, *args, **kwargs):
    #     # Создаем уникальный ключ кеша для пользователя
    #     # Это важно, так как разные пользователи могут видеть разные данные
    #     cache_key = f"group_list_{request.user.id}"

    #     # Пробуем получить данные из кеша
    #     cached_data = cache.get(cache_key)

    #     if cached_data is not None:
    #         return Response(cached_data)

    #     # Если данных в кеше нет, выполняем обычный запрос
    #     response = super().list(request, *args, **kwargs)

    #     # Сохраняем результат в кеш на 15 минут (900 секунд)
    #     cache.set(cache_key, response.data, timeout=900)

    #     return response


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
            return Response({"error": _("Lesson not found")}, status=404)

        user: CourseUser = request.user

        if not user.is_has_access(lesson=lesson):
            return Response(
                {"error": _("You do not have access to this lesson")},
                status=status.HTTP_403_FORBIDDEN,
            )

        content_blocks = ContentBlock.objects.filter(lesson=lesson).order_by("order")
        last_seen_block = content_blocks.first()

        progress, is_created = UserLessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            defaults={
                "last_seen_block": last_seen_block,
                "procent_progress": round((1 / content_blocks.count()) * 100)
                if content_blocks.count() > 0
                else 0,
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

                is_has_review = UserReview.objects.filter(
                    lesson=lesson, user=user
                ).exists()
                if not is_has_review:
                    # Добавляем блок "lesson_review" перед кнопкой "button_next"
                    blocks.append(
                        {
                            "type": "lesson_review",
                            "content": "",
                            "uuid": "lesson_review",
                        }
                    )

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
            return Response({"error": _("Lesson not found")}, status=404)

        user: CourseUser = request.user

        if not user.is_has_access(lesson=lesson):
            return Response(
                {"error": _("You do not have access to this lesson")},
                status=status.HTTP_403_FORBIDDEN,
            )

        content_blocks = ContentBlock.objects.filter(lesson=lesson).order_by("order")
        last_seen_block = content_blocks.first()
        blocks_count: int = content_blocks.count()

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

                is_has_review = UserReview.objects.filter(
                    lesson=lesson, user=user
                ).exists()
                if not is_has_review:
                    # Добавляем блок "lesson_review" перед кнопкой "button_next"
                    blocks.append(
                        {
                            "type": "lesson_review",
                            "content": "",
                            "uuid": "lesson_review",
                        }
                    )

                progress.is_completed = True
                progress.procent_progress = 100
                progress.save()

            if is_found_last_block and block.block_type == "text":
                is_next_block = True
                progress.last_seen_block = block
                progress.procent_progress = (
                    round((next_block_conter / blocks_count) * 100)
                    if blocks_count > 0
                    else 0
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
            {"blocks": blocks, "procent_progress": progress.procent_progress}
        )
