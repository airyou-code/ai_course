# AI Course

Django-приложение для курсов по ИИ с интеграцией OpenAI.

## About

Проект мигрирован на UV для управления зависимостями Python. Это обеспечивает:
- Быструю установку зависимостей (до 100x быстрее pip)
- Детерминистические сборки с uv.lock
- Лучшее кэширование и управление виртуальными окружениями

## Getting Started

### Требования
- Python 3.12+
- UV (установлен глобально)

### Установка зависимостей
```bash
cd src/backend
uv sync
```

### Настройка переменных окружения
```bash
cp src/backend/.env.exemple src/backend/.env
# Отредактируйте .env файл с вашими настройками
```

## Usage

### Разработка
```bash
cd src/backend

# Запуск сервера разработки
uv run python manage.py runserver

# Или используйте удобный скрипт
./start_dev.sh

# Выполнение миграций
uv run python manage.py migrate

# Создание суперпользователя
uv run python manage.py createsuperuser
```

### Качество кода
```bash
# Проверка кода с помощью Ruff
uv run ruff check .

# Автоисправление проблем
uv run ruff check . --fix

# Форматирование кода
uv run ruff format
```

### Docker
```bash
# Сборка образа
docker build -f docker/deploy/be/Dockerfile -t ai-course-backend .

# Запуск с docker-compose
docker-compose -f docker-compose.deploy.yml up
```

## Технологии

- **Backend**: Django 5.1.4, Django REST Framework
- **Database**: PostgreSQL 
- **Task Queue**: Celery + Redis
- **AI Integration**: OpenAI API
- **Package Management**: UV
- **Code Quality**: Ruff (линтинг + форматирование)
- **Deployment**: Docker, Gunicorn + Uvicorn

## Структура проекта

```
src/backend/
├── api/              # API endpoints
├── core/             # Общие компоненты
├── courses/          # Курсы и контент
├── openai_chats/     # Интеграция с OpenAI
├── users/            # Управление пользователями
├── payments/         # Система платежей
├── mail/             # Email уведомления
├── webapp/           # Настройки Django
├── pyproject.toml    # Конфигурация проекта
└── uv.lock          # Зафиксированные зависимости
```

Больше информации о миграции на UV: [UV_MIGRATION.md](UV_MIGRATION.md)

