import json
import time

from groq import Groq, RateLimitError
from app.core.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY,
    timeout=120
)

MODEL_NAME = "openai/gpt-oss-20b"


def generate_text(prompt: str) -> str:

    max_retries = 3

    for attempt in range(max_retries):

        try:

            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an AI software engineering assistant. "
                            "Follow the user's instructions exactly."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2
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

    max_retries = 3

    json_prompt = f"""
You are generating structured data for a software engineering system.

IMPORTANT:
Return ONLY valid JSON.
Do not return Markdown.
Do not use ```json.
Do not add explanations before or after the JSON.

{prompt}

The response MUST be a valid JSON object.
"""

    for attempt in range(max_retries):

        try:

            response = client.chat.completions.create(
                model=MODEL_NAME,

                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a software engineering assistant. "
                            "Always return valid JSON when JSON is requested."
                        )
                    },
                    {
                        "role": "user",
                        "content": json_prompt
                    }
                ],

                response_format={
                    "type": "json_object"
                },

                temperature=0.1
            )

            raw = response.choices[0].message.content

            print("RAW JSON RESPONSE:")
            print(raw)

            return json.loads(raw)

        except RateLimitError:

            wait_time = 5 * (attempt + 1)

            print(
                f"Groq rate limit reached. "
                f"Retrying in {wait_time} seconds..."
            )

            time.sleep(wait_time)

        except json.JSONDecodeError as e:

            print("JSON PARSE FAILED")
            print(raw)

            if attempt == max_retries - 1:
                raise ValueError(
                    f"Invalid JSON returned by model:\n{raw}"
                )

        except Exception as e:

            print("GROQ JSON GENERATION ERROR:")
            print(str(e))

            if attempt == max_retries - 1:
                raise

    raise Exception("JSON generation failed after retries.")