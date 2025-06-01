from django.core.management.base import BaseCommand
from courses.models import Lesson, ContentBlock
from django.db import models


class Command(BaseCommand):
    help = 'Ensure last content block of each lesson is button_next. If last is button_continue, change to button_next. If not button_next, add button_next.'

    def handle(self, *args, **options):
        updated = 0
        added = 0
        for lesson in Lesson.objects.all():
            blocks = ContentBlock.objects.filter(lesson=lesson).order_by('order')
            if not blocks.exists():
                continue
            last_block = blocks.last()
            if last_block.block_type == 'button_next':
                continue  # Всё ок
            elif last_block.block_type == 'button_continue':
                last_block.block_type = 'button_next'
                last_block.save()
                updated += 1
                self.stdout.write(self.style.SUCCESS(f'Lesson {lesson.id}: Changed last block to button_next'))
            else:
                # Добавить новый блок button_next
                max_order = blocks.aggregate(max_order=models.Max('order'))['max_order'] or 0
                ContentBlock.objects.create(
                    lesson=lesson,
                    title='Next',
                    block_type='button_next',
                    order=max_order + 1
                )
                added += 1
                self.stdout.write(self.style.SUCCESS(f'Lesson {lesson.id}: Added button_next block'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated}, Added: {added}'))
