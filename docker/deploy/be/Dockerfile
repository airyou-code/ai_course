FROM --platform=linux/amd64 python:3.12-slim AS base
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install system dependencies
RUN apt-get update \
  # dependencies for building Python packages
  && apt-get install -y build-essential \
  # psycopg2 dependencies
  && apt-get install -y libpq-dev \
  # fix ImportError: failed to find libmagic
  && apt-get install -y libmagic-dev \
  # Translations dependencies
  && apt-get install -y gettext \
  # git is required for pip install from git repo
  && apt-get install -y git ssh \
  # curl for health checks
  && apt-get install -y curl \
  # vim for debugging (optional)
  && apt-get install -y vim \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy UV configuration files for dependency caching
COPY ./src/backend/pyproject.toml ./src/backend/uv.lock ./

# Copy .python-version if it exists
COPY ./src/backend/.python-version .python-version

# Install dependencies using UV (this layer will be cached)
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
RUN uv sync --locked

# Copy scripts and make them executable
COPY ./docker/deploy/be/entrypoint /entrypoint
COPY ./docker/deploy/be/start /start
COPY ./docker/deploy/be/celery/worker/start /start-celeryworker
COPY ./docker/deploy/be/celery/beat/start /start-celerybeat

RUN sed -i 's/\r$//g' /entrypoint /start /start-celeryworker /start-celerybeat \
    && chmod +x /entrypoint /start /start-celeryworker /start-celerybeat

# Copy application code (this should be the last layer for optimal caching)
COPY ./src/backend /app

# Ensure we're using the virtual environment
ENV PATH="/app/.venv/bin:$PATH"
