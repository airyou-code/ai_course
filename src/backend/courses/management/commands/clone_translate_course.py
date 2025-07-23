"""
Management command to clone a Russian course into English by translating titles and descriptions, preserving HTML formatting and handling network timeouts with retries.

Usage:
    python manage.py clone_translate_course <course_id>

This command finds the course with the given ID, translates its fields and all related objects (groups, modules, lessons, content blocks)
from Russian to English using the Google Translator (`googletrans` library). It preserves HTML structure by translating only text nodes via BeautifulSoup parsing, and retries on network timeouts.
"""

import asyncio
import time

import httpx
from bs4 import BeautifulSoup, NavigableString
from django.core.management.base import BaseCommand
from googletrans import Translator

from courses.models import ContentBlock, Course, Group, Lesson, Module


class Command(BaseCommand):
    help = "Clone a course and translate it to English, preserving HTML and retrying on timeouts, with detailed logging"

    def add_arguments(self, parser):
        parser.add_argument(
            "course_id", type=int, help="ID of the Russian course to clone"
        )

    def translate_text(
        self, translator, text: str, src: str = "ru", dest: str = "en"
    ) -> str:
        if not text or text.strip() == "":
            return text
        for attempt in range(3):
            try:
                coro = translator.translate(text, src=src, dest=dest)
                result = asyncio.get_event_loop().run_until_complete(coro)
                return getattr(result, "text", text)
            except httpx.ReadTimeout:
                self.stderr.write(f"Timeout translating text, attempt {attempt + 1}/3")
                if attempt < 2:
                    time.sleep(2)
                else:
                    self.stderr.write(
                        "Failed to translate after 3 attempts, using original text"
                    )
                    return text
            except Exception as e:
                self.stderr.write(f"Unexpected error during translation: {e}")
                return text

    def translate_html(self, translator, html: str) -> str:
        if not html or html.strip() == "":
            return html
        soup = BeautifulSoup(html, "html.parser")
        for node in soup.find_all(string=True):
            if isinstance(node, NavigableString) and node.strip():
                translated = self.translate_text(translator, str(node))
                node.replace_with(translated)
        return str(soup)

    def handle(self, *args, **options):
        translator = Translator(timeout=30)
        original = Course.objects.get(pk=options["course_id"])

        # Translate course
        title_en = self.translate_text(translator, original.title)
        desc_en = self.translate_text(translator, original.description or "")
        clone = Course.objects.create(
            title=title_en, description=desc_en, language="en"
        )
        self.stdout.write(
            self.style.NOTICE(f"Course created: {clone.title} (ID={clone.id})")
        )

        # Clone hierarchy
        for group in original.group_set.all().order_by("order"):
            grp_clone = Group.objects.create(
                course=clone,
                title=self.translate_text(translator, group.title),
                description=self.translate_text(translator, group.description or ""),
                order=group.order,
            )
            self.stdout.write(f"  Group cloned: {grp_clone.title} (ID={grp_clone.id})")

            for module in group.module_set.all().order_by("order"):
                mod_clone = Module.objects.create(
                    group=grp_clone,
                    title=self.translate_text(translator, module.title),
                    description=self.translate_text(
                        translator, module.description or ""
                    ),
                    order=module.order,
                )
                self.stdout.write(
                    f"    Module cloned: {mod_clone.title} (ID={mod_clone.id})"
                )

                for lesson in module.lesson_set.all().order_by("order"):
                    lesson_clone = Lesson.objects.create(
                        module=mod_clone,
                        title=self.translate_text(translator, lesson.title),
                        description=self.translate_text(
                            translator, lesson.description or ""
                        ),
                        is_free=lesson.is_free,
                        order=lesson.order,
                    )
                    self.stdout.write(
                        f"      Lesson cloned: {lesson_clone.title} (ID={lesson_clone.id})"
                    )

                    for block in lesson.contentblock_set.all().order_by("order"):
                        block_clone = ContentBlock.objects.create(
                            lesson=lesson_clone,
                            title=self.translate_text(translator, block.title or ""),
                            content_html=self.translate_html(
                                translator, block.content_html or ""
                            ),
                            content_text=self.translate_text(
                                translator, block.content_text or ""
                            ),
                            content_json=block.content_json,
                            block_type=block.block_type,
                            order=block.order,
                        )
                        self.stdout.write(
                            f"        ContentBlock cloned: {block_clone.uuid} (type={block_clone.block_type})"
                        )

        self.stdout.write(
            self.style.SUCCESS("Course cloned and translated with detailed logging.")
        )
