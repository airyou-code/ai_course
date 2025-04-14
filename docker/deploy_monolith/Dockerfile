FROM --platform=linux/amd64 python:3.12-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && apt-get install -y \
    nginx \
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

COPY ./docker/deploy_monolith/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./docker/deploy_monolith/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

COPY ./src/backend /app/
COPY ./src/frontend /app/frontend

RUN rm -rf /app/frontend/.env
RUN npm run build --prefix /app/frontend

# Copy Nginx configuration file
COPY ./docker/deploy_monolith/nginx.conf /etc/nginx/conf.d/app.conf

# Remove default Nginx configuration
RUN rm /etc/nginx/sites-enabled/default

# Expose ports
EXPOSE 81
EXPOSE 8000

# Check Nginx configuration on a non-privileged port
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/app.conf
RUN nginx -t -c /etc/nginx/nginx.conf
RUN sed -i 's/listen 8080;/listen 80;/' /etc/nginx/conf.d/app.conf

