from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="Image Processing BFF", version="1.0.0")


FILE_CONVERTER_URL = os.getenv("FILE_CONVERTER_URL")
if not FILE_CONVERTER_URL:
    raise ValueError("FILE_CONVERTER_URL is not set")

# ==================== Models ====================


class ConvertImageRequest(BaseModel):
    image_base64: str
    target_format: str


class ConvertImageResponse(BaseModel):
    converted_image_base64s: list[str]


# ==================== Endpoints ====================


@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/detect-faces", response_model=ConvertImageResponse)
async def detect_faces(request: ConvertImageRequest):
    """
    Face detection pipeline endpoint.

    Workflow:
    1. Converts image to target format via file converter service
    2. Sends to face detection service (TODO: not yet implemented)
    3. Returns detection results
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{FILE_CONVERTER_URL}/convert",
                json={
                    "image_base64": request.image_base64,
                    "target_format": request.target_format,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            result = response.json()

            converted_image_base64 = result["converted_image_base64"]

            return ConvertImageResponse(converted_image_base64=converted_image_base64)

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="File converter service timeout")
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"File converter service error: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to file converter service: {str(e)}",
        )
