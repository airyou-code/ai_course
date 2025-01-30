from courses.models import Group, ContentBlock, Lesson
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import GroupSerializer, ContentBlockSerializer, ContentBlockListSerializer
from rest_framework.authentication import SessionAuthentication


class GroupReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Group.objects.prefetch_related('module_set__lesson_set')


class LessonContentBlocksViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin
):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ContentBlockListSerializer

    def list(self, request, lesson_uuid: str = None):
        try:
            lesson = Lesson.objects.get(uuid=lesson_uuid)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=404)

        content_blocks = ContentBlock.objects.filter(lesson=lesson).order_by('order')
        blocks = []

        for block in content_blocks:
            content = None
            if block.block_type in ['text', 'output_dialog']:
                content = block.content_html
            elif block.block_type in ['choices_field', 'test']:
                content = block.content_json
            else:
                content = block.content_text

            blocks.append({
                'type': block.block_type,
                'content': content,
                'avatar': block.avatar if hasattr(block, 'avatar') else None,
                'nextLessonUrl': block.nextLessonUrl if hasattr(block, 'nextLessonUrl') else None,
            })

        return Response({'blocks': blocks})

    # def create(self, request, lesson_uuid: str = None):
    #     serializer = self.get_serializer(
    #         data=request.data,
    #     )
    #     serializer.is_valid(raise_exception=True)
    #     validated_data = serializer.validated_data

    #     blocks_data = validated_data.get('blocks')

    #     lesson = Lesson.objects.get(uuid=lesson_uuid)
    #     for block_data in blocks_data:
    #         ContentBlock.objects.create(lesson=lesson, **block_data)

    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
