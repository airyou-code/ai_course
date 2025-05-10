"""
Management command to clone a Russian course into English by translating titles and descriptions, preserving HTML formatting.

Usage:
    python manage.py clone_translate_course <course_id>

This command finds the course with the given ID, translates its fields and all related objects (groups, modules, lessons, content blocks)
from Russian to English using the Google Translator (`googletrans` library). It preserves HTML structure by translating only text nodes via BeautifulSoup parsing.
"""
import asyncio
from django.core.management.base import BaseCommand
from googletrans import Translator
from bs4 import BeautifulSoup, NavigableString
from courses.models import Course, Group, Module, Lesson, ContentBlock


class Command(BaseCommand):
    help = 'Clone a course and translate it to English, preserving HTML formatting'

    def add_arguments(self, parser):
        parser.add_argument('course_id', type=int, help='ID of the Russian course to clone')

    def translate_text(self, translator, text: str, src: str = 'ru', dest: str = 'en') -> str:
        if not text or text.strip() == '':
            return text
        coro = translator.translate(text, src=src, dest=dest)
        result = asyncio.get_event_loop().run_until_complete(coro)
        return getattr(result, 'text', text)

    def translate_html(self, translator, html: str) -> str:
        if not html or html.strip() == '':
            return html
        soup = BeautifulSoup(html, 'html.parser')
        for node in soup.find_all(string=True):
            # Only translate text nodes that are not pure whitespace
            if isinstance(node, NavigableString) and node.strip():
                translated = self.translate_text(translator, str(node))
                node.replace_with(translated)
        return str(soup)

    def handle(self, *args, **options):
        translator = Translator()
        original = Course.objects.get(pk=options['course_id'])

        # Translate course
        title_en = self.translate_text(translator, original.title)
        desc_en = self.translate_text(translator, original.description or '')
        clone = Course.objects.create(
            title=title_en,
            description=desc_en,
            language='en'
        )
        self.stdout.write(f'Created English course `{clone.title}` (ID={clone.id})')

        # Clone groups, modules, lessons, content blocks
        for group in original.group_set.all().order_by('order'):
            grp_title = self.translate_text(translator, group.title)
            grp_desc = self.translate_text(translator, group.description or '')
            grp_clone = Group.objects.create(
                course=clone,
                title=grp_title,
                description=grp_desc,
                order=group.order
            )
            for module in group.module_set.all().order_by('order'):
                mod_title = self.translate_text(translator, module.title)
                mod_desc = self.translate_text(translator, module.description or '')
                mod_clone = Module.objects.create(
                    group=grp_clone,
                    title=mod_title,
                    description=mod_desc,
                    order=module.order
                )
                for lesson in module.lesson_set.all().order_by('order'):
                    les_title = self.translate_text(translator, lesson.title)
                    les_desc = self.translate_text(translator, lesson.description or '')
                    lesson_clone = Lesson.objects.create(
                        module=mod_clone,
                        title=les_title,
                        description=les_desc,
                        duration=lesson.duration,
                        prompt=lesson.prompt,
                        is_free=lesson.is_free,
                        order=lesson.order
                    )
                    for block in lesson.contentblock_set.all().order_by('order'):
                        blk_title = self.translate_text(translator, block.title)
                        blk_html = self.translate_html(translator, block.content_html or '')
                        blk_text = self.translate_text(translator, block.content_text or '')
                        ContentBlock.objects.create(
                            lesson=lesson_clone,
                            title=blk_title,
                            content_html=blk_html,
                            content_text=blk_text,
                            content_json=block.content_json,
                            block_type=block.block_type,
                            order=block.order
                        )
        self.stdout.write(self.style.SUCCESS('Course successfully cloned and translated to English with formatting preserved.'))
