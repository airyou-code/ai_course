# performance_test.py
import time
import django
import os
import statistics

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webapp.settings')
django.setup()

from courses.models import ContentBlock, Lesson

def measure_query_time(query_func, iterations=10):
    """Измеряет время выполнения запроса"""
    times = []
    for _ in range(iterations):
        start = time.time()
        result = query_func()
        # Если результат - QuerySet, приведем его к списку для выполнения запроса
        if hasattr(result, '__iter__'):
            list(result)
        end = time.time()
        times.append(end - start)
    
    return {
        'min': min(times),
        'max': max(times),
        'avg': statistics.mean(times),
        'median': statistics.median(times)
    }

# Тестируемые запросы
def test_content_blocks_by_lesson():
    lesson = Lesson.objects.first()
    return ContentBlock.objects.filter(lesson=lesson).order_by('order')

def test_next_lesson():
    lesson = Lesson.objects.first()
    return Lesson.objects.filter(module=lesson.module, order__gt=lesson.order).order_by('order').first()

# Запуск тестов
tests = {
    'Content Blocks by Lesson': test_content_blocks_by_lesson,
    'Next Lesson': test_next_lesson,
}

for test_name, test_func in tests.items():
    result = measure_query_time(test_func)
    print(f"{test_name}:")
    print(f"  Min: {result['min']:.6f}s")
    print(f"  Max: {result['max']:.6f}s")
    print(f"  Avg: {result['avg']:.6f}s")
    print(f"  Median: {result['median']:.6f}s")