import re
import json
import markdown
import asyncio
import time
import httpx
from bs4 import BeautifulSoup, NavigableString
from courses.models import Lesson, ContentBlock


def get_openai_completion():
    pass


def process_lesson_to_json(text: str) -> dict:
    blocks = []
    current_block = []
    block_type = "text"

    # Обновленные паттерны для кнопок и инпутов
    button_pattern = re.compile(
        r".*кнопка:.*[“\"'(\[\{«](.*?)[”\"'\)\]\}»].*$",
        re.IGNORECASE
    )
    input_prompt_pattern = re.compile(
        r".*инпут.*:.*$",
        re.IGNORECASE
    )

    lines = text.split("\n")

    for line in lines:
        button_match = button_pattern.match(line)
        input_prompt_match = input_prompt_pattern.match(line)

        if button_match:
            if current_block:
                blocks.append(
                    {
                        "block_type": block_type,
                        "content_html": markdown.markdown("\n".join(current_block)),
                    }
                )
                current_block = []

            blocks.append(
                {
                    "block_type": "button_continue",
                    "content_text": button_match.group(1)
                }
            )
            continue

        if input_prompt_match:
            if current_block:
                blocks.append(
                    {
                        "block_type": block_type,
                        "content_html": markdown.markdown("\n".join(current_block)),
                    }
                )
                current_block = []

            blocks.append({"block_type": "input_gpt"})
            continue

        current_block.append(line)

    if current_block:
        blocks.append(
            {
                "block_type": block_type,
                "content_html": markdown.markdown("\n".join(current_block)),
            }
        )

    return {"blocks": blocks}


# ------- Traslation -------
def add_arguments(self, parser):
    parser.add_argument('course_id', type=int, help='ID of the Russian course to clone')

def translate_text(self, translator, text: str, src: str = 'ru', dest: str = 'en') -> str:
    if not text or text.strip() == '':
        return text
    for attempt in range(3):
        try:
            coro = translator.translate(text, src=src, dest=dest)
            result = asyncio.get_event_loop().run_until_complete(coro)
            return getattr(result, 'text', text)
        except httpx.ReadTimeout:
            self.stderr.write(f'Timeout translating text, attempt {attempt+1}/3')
            if attempt < 2:
                time.sleep(2)
            else:
                self.stderr.write('Failed to translate after 3 attempts, using original text')
                return text
        except Exception as e:
            self.stderr.write(f'Unexpected error during translation: {e}')
            return text

def translate_html(self, translator, html: str) -> str:
    if not html or html.strip() == '':
        return html
    soup = BeautifulSoup(html, 'html.parser')
    for node in soup.find_all(string=True):
        if isinstance(node, NavigableString) and node.strip():
            translated = self.translate_text(translator, str(node))
            node.replace_with(translated)
    return str(soup)


def translate_lesson(lesson, translator, mod_clone):
    lesson_clone = Lesson.objects.create(
        module=mod_clone,
        title=translate_text(translator, lesson.title),
        description=translate_text(translator, lesson.description or ''),
        duration=lesson.duration,
        prompt=lesson.prompt,
        lesson_en=lesson,
        is_free=lesson.is_free,
        order=lesson.order
    )

    for block in lesson.contentblock_set.all().order_by('order'):
        ContentBlock.objects.create(
            lesson=lesson_clone,
            title=translate_text(translator, block.title or ''),
            content_html=translate_html(translator, block.content_html or ''),
            content_text=translate_text(translator, block.content_text or ''),
            content_json=block.content_json,
            block_type=block.block_type,
            order=block.order
        )
