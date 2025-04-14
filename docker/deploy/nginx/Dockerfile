FROM airyou/prompthub:be AS backend

FROM --platform=linux/amd64 nginx:latest

COPY ./docker/deploy/nginx/nginx.conf /etc/nginx/conf.d/app.conf

COPY --from=backend /app/static /static/

# Expose ports
EXPOSE 82
