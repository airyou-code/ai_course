FROM python:3.12-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libmagic-dev \
    gettext \
    git ssh \
    curl \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs

WORKDIR /app

# Requirements are installed here to ensure they will be cached.
COPY ./src/backend/requirements.txt /requirements.txt
COPY ./src/frontend/package.json ./src/frontend/package-lock.json /app/frontend/

RUN pip install --no-cache-dir -r /requirements.txt
RUN npm install --prefix /app/frontend

COPY ./docker/deploy/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./docker/deploy/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

COPY ./src/backend /app/
COPY ./src/frontend /app/frontend

RUN npm run build --prefix /app/frontend

ENTRYPOINT ["/entrypoint"]
