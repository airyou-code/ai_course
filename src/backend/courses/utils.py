import re
import json
import markdown


def process_lesson_to_json(text: str) -> dict:
    blocks = []
    current_block = []
    block_type = "text"

    # Обновленные паттерны для кнопок и инпутов
    button_pattern = re.compile(
        r".*кнопка:.*[“\"'(\[\{](.*?)[”\"'\)\]\}].*$",
        re.IGNORECASE
    )
    input_prompt_pattern = re.compile(
        r".*инпут.*:.*$",
        re.IGNORECASE
    )

    lines = text.split("\n")

    for line in lines:
        button_match = button_pattern.match(line)
        input_prompt_match = input_prompt_pattern.match(line)

        if button_match:
            if current_block:
                blocks.append(
                    {
                        "block_type": block_type,
                        "content_html": markdown.markdown("\n".join(current_block)),
                    }
                )
                current_block = []

            blocks.append(
                {
                    "block_type": "button_continue",
                    "content_text": button_match.group(1)
                }
            )
            continue

        if input_prompt_match:
            if current_block:
                blocks.append(
                    {
                        "block_type": block_type,
                        "content_html": markdown.markdown("\n".join(current_block)),
                    }
                )
                current_block = []

            blocks.append({"block_type": "input_gpt"})
            continue

        current_block.append(line)

    if current_block:
        blocks.append(
            {
                "block_type": block_type,
                "content_html": markdown.markdown("\n".join(current_block)),
            }
        )

    return {"blocks": blocks}
