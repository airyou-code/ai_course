docker buildx create --use
docker buildx build \
  --platform linux/amd64 \
  -f docker/deploy/be/Dockerfile \
  -t airyou/prompthub:be \
  --push \
  .