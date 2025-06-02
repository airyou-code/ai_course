import tiktoken


def count_tokens(text: str, model_name: str = "gpt-4o") -> int:
    """
    Calculate the number of tokens in the given text for a specific OpenAI model.

    :param text: The input string to tokenize.
    :param model_name: Name of the OpenAI model (e.g., "gpt-3.5-turbo", "gpt-4").
    :return: Number of tokens in the input text as used by the specified model.
    """
    try:
        # Получаем кодировщик для указанной модели
        encoding = tiktoken.encoding_for_model(model_name)
    except KeyError:
        # Если модель не найдена, можно упасть с сообщением об ошибке
        raise ValueError(f"Unknown model: {model_name}")
    # Кодируем текст в последовательность токенов и возвращаем длину
    tokens = encoding.encode(text)
    return len(tokens)
