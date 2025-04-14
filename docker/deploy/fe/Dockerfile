FROM --platform=linux/amd64 node:16 AS builder

WORKDIR /app


COPY ./src/frontend/package.json ./src/frontend/package-lock.json ./
RUN npm install
COPY ./src/frontend ./
RUN rm -rf .env
RUN npm run build


FROM --platform=linux/amd64 nginx:latest

COPY ./docker/deploy/fe/nginx.conf /etc/nginx/conf.d/app.conf

RUN mkdir -p /frontend
COPY --from=builder /app/dist /frontend/

EXPOSE 83
