from courses.models import Module, ContentBlock
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import ModuleSerializer, ContentBlockSerializer
from rest_framework.authentication import SessionAuthentication


class ModuleReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Module.objects.prefetch_related('lesson_set')


class LessonContentBlocksViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def list(self, request, course_id=None, module_id=None, lesson_id=None):
        content_blocks = ContentBlock.objects.filter(lesson_id=lesson_id).order_by('order')
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
