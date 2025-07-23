#!/bin/bash
# Настройка переменных для подключения и дампа
REMOTE_USER=""
REMOTE_HOST=""
REMOTE_PORT=1234
PGPASSWORD_REMOTE=""
PGDATABASE_NAME="pronpthub"
PGUSER_NAME="pronpthub"


# На удалённом сервере:
# 1. Устанавливаем переменную PGPASSWORD.
# 2. Формируем имя файла дампа на основе даты и времени.
# 3. Выполняем pg_dump для создания дампа.
# 4. Выводим имя созданного файла, чтобы сохранить его локально.
REMOTE_COMMAND="export PGPASSWORD=${PGPASSWORD_REMOTE}; \
FILENAME=app_promthub_\$(date +%Y-%m-%d_%H-%M-%S).tar; \
pg_dump -h 127.0.0.1 -p 5434 -U ${PGUSER_NAME} -d ${PGDATABASE_NAME} -Ft -b -f \"\$FILENAME\"; \
echo \"\$FILENAME\""

echo "Создание дампа базы данных на удалённом сервере..."
REMOTE_FILENAME=$(ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} "$REMOTE_COMMAND")
echo "Дамп создан: ${REMOTE_FILENAME}"

# Скачиваем дамп на локальную машину с использованием scp
echo "Скачивание файла дампа на локальную машину..."
scp -P ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_FILENAME} .

echo "Удаление файла дампа с удалённого сервера..."
ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} "rm ${REMOTE_FILENAME}"

echo "Операция завершена успешно."
