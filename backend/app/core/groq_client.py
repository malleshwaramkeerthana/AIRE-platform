import json
import re
import time

from groq import Groq, RateLimitError
from app.core.config import settings

client = Groq(
    api_key=settings.GROQ_API_KEY,
    timeout=120
)

MODEL_NAME = "llama-3.1-8b-instant"


def generate_text(prompt: str) -> str:
    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3
            )

            return response.choices[0].message.content

        except RateLimitError:
            wait_time = 5 * (attempt + 1)

            print(
                f"Groq rate limit reached. "
                f"Retrying in {wait_time} seconds..."
            )

            time.sleep(wait_time)

    raise Exception(
        "Groq rate limit exceeded after multiple retries."
    )


def generate_json(prompt: str) -> dict:
    raw = generate_text(prompt)

    cleaned = re.sub(r"^```json", "", raw.strip())
    cleaned = re.sub(r"^```", "", cleaned)
    cleaned = re.sub(r"```$", "", cleaned)
    cleaned = cleaned.strip()

    try:
        print("RAW JSON RESPONSE:")
        print(cleaned)
        return json.loads(cleaned)

    except Exception as e:
        print("JSON PARSE FAILED")
        print(cleaned)

        raise ValueError(
            f"Invalid JSON returned by model:\n{cleaned}"
        )