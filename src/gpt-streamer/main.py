import os
import json
import asyncpg
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
from uuid import UUID
from typing import AsyncGenerator
from pydantic_settings import BaseSettings, SettingsConfigDict
from jose import JWTError, jwt
from openai import OpenAI


# Настройки через pydantic-settings
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    openai_api_key: str
    openai_model: str = "gpt-4.1"
    max_words: int = 1000
    max_messages: int = 50
    jwt_secret_key: str = (
        "django-insecure-c%@zyw#h$&@ga*+cbpqf5l!-z4pm9e)q0@rvjfl1hx=rvc!&nw'"
    )
    jwt_algorithm: str = "HS256"


settings = Settings()


# Жизненный цикл приложения через lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: пул БД и клиент OpenAI
    app.state.db_pool = await asyncpg.create_pool(settings.database_url)
    app.state.openai_client = OpenAI(api_key=settings.openai_api_key)
    yield
    # Shutdown: закрываем пул
    await app.state.db_pool.close()


app = FastAPI(lifespan=lifespan)


# Аутентификация через JWT
async def get_user(request: Request) -> int:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload missing subject",
            )
        return user_id
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token decode error: {str(e)}",
        )


@app.post("/stream/{content_block_uuid}")
async def stream_endpoint(
    request: Request, content_block_uuid: UUID, user_id: int = Depends(get_user)
) -> StreamingResponse:
    data = await request.json()
    user_input = data.get("content", "").strip()
    if not user_input:
        raise HTTPException(status_code=400, detail="Message content is required.")
    if len(user_input.split()) > settings.max_words:
        raise HTTPException(
            status_code=413,
            detail=f"Your message is too long. Please keep it under {settings.max_words} words.",
        )

    # Читаем из БД raw SQL
    async with app.state.db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, content_text FROM content_block WHERE uuid = $1 AND block_type = 'input_gpt'",
            str(content_block_uuid),
        )
        if not row:
            raise HTTPException(status_code=404, detail="ContentBlock not found.")
        block_id, system_text = row["id"], row["content_text"]

        chat_row = await conn.fetchrow(
            "SELECT id FROM chat WHERE user_id = $1 AND content_block_id = $2",
            user_id,
            block_id,
        )
        chat_id = (
            chat_row["id"]
            if chat_row
            else await conn.fetchval(
                "INSERT INTO chat (user_id, content_block_id) VALUES ($1, $2) RETURNING id",
                user_id,
                block_id,
            )
        )

        msg_count = await conn.fetchval(
            "SELECT COUNT(*) FROM chat_message WHERE chat_id = $1", chat_id
        )
        if msg_count >= settings.max_messages:
            raise HTTPException(
                status_code=429,
                detail=f"You have reached the limit of messages ({settings.max_messages}) for this content block.",
            )

        rows = await conn.fetch(
            "SELECT role, content FROM chat_message WHERE chat_id = $1 ORDER BY created_at",
            chat_id,
        )
        conversation = []
        if system_text:
            conversation.append({"role": "system", "content": system_text})
        for r in rows:
            if r["content"] and r["role"] != "system":
                conversation.append({"role": r["role"], "content": r["content"]})
        conversation.append({"role": "user", "content": user_input})

    # Генератор SSE с Streaming Responses API
    async def event_generator() -> AsyncGenerator[str, None]:
        client: OpenAI = app.state.openai_client
        assistant_content = ""
        try:
            stream = client.responses.create(
                model=settings.openai_model, input=conversation, stream=True
            )
            async for event in stream:
                if event.type == "response.output_text.delta":
                    delta = event.delta.get("content")
                    if delta:
                        assistant_content += delta
                        yield f"data: {json.dumps({'error': False, 'content': delta})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': True, 'message': str(e)})}\n\n"
            return

        yield f"data: {json.dumps({'done': True})}\n\n"

        # Сохраняем историю
        async with app.state.db_pool.acquire() as conn:
            if system_text:
                await conn.execute(
                    "INSERT INTO chat_message (chat_id, role, content) VALUES ($1, 'system', $2)",
                    chat_id,
                    system_text,
                )
            await conn.execute(
                "INSERT INTO chat_message (chat_id, role, content) VALUES ($1, 'user', $2)",
                chat_id,
                user_input,
            )
            await conn.execute(
                "INSERT INTO chat_message (chat_id, role, content) VALUES ($1, 'assistant', $2)",
                chat_id,
                assistant_content,
            )

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
