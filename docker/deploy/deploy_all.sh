docker service update --image docker.io/airyou/prompthub:fe -d  --force prompthub_frontend && \
docker service update --image docker.io/airyou/prompthub:be -d  --force prompthub_backend && \
docker service update --image docker.io/airyou/prompthub:be -d  --force prompthub_celery_beat && \
docker service update --image docker.io/airyou/prompthub:be  --force prompthub_celery_worker