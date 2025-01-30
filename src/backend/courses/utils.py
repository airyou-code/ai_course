import re
import json
import markdown


def process_lesson_to_json(text: str) -> dict:
    blocks = []
    current_block = []
    block_type = "text"

    button_pattern = re.compile(r"Кнопка:\s*_(.*?)_")
    input_prompt_pattern = re.compile(r"\*\*Инпут промпта:\*\*")

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
                {"block_type": "button_next", "content_text": button_match.group(1)}
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
