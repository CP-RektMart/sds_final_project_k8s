from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="Image Processing BFF", version="1.0.0")


def get_required_env(env_var_name: str) -> str:
    """
    Get a required environment variable.
    Raises ValueError if not set.
    """
    value = os.getenv(env_var_name)
    if not value:
        raise ValueError(f"{env_var_name} is not set")
    # print(f"{env_var_name}: {value}")
    return value


FILE_CONVERTER_URL = get_required_env("FILE_CONVERTER_URL")
FACE_DETECTION_URL = get_required_env("FACE_DETECTION_URL")

# FACE_DETECTION_URL="http://localhost:8000" FILE_CONVERTER_URL="http://localhost:8001" uv run fastapi dev src/server.py --port 8002

# ==================== Models ====================


class ConvertImageRequest(BaseModel):
    image_base64: str
    target_format: str


class ConvertImageResponse(BaseModel):
    converted_image_base64s: list[str]


class DetectFacesResponse(BaseModel):
    cropped_faces: list[str]


# ==================== Endpoints ====================


@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/detect-faces", response_model=DetectFacesResponse)
async def detect_faces(request: ConvertImageRequest):
    """
    Face detection pipeline endpoint.

    Workflow:
    1. Converts image to target format via file converter service
    2. Sends to face detection service to crop faces
    3. Returns cropped face images
    """
    try:
        async with httpx.AsyncClient() as client:
            # Step 1: Convert image format
            convert_response = await client.post(
                f"{FILE_CONVERTER_URL}/convert",
                json={
                    "image_base64": request.image_base64,
                    "target_format": request.target_format,
                },
                timeout=30.0,
            )
            convert_response.raise_for_status()
            convert_result = convert_response.json()
            converted_image_base64 = convert_result["converted_image_base64"]

            # Strip data URI prefix if present (e.g., data:image/jpeg;base64,)
            if converted_image_base64.startswith("data:"):
                # Extract the base64 part after the comma
                converted_image_base64 = converted_image_base64.split(",", 1)[1]

            # Step 2: Detect and crop faces
            face_detection_response = await client.post(
                f"{FACE_DETECTION_URL}/crop-faces",
                json={
                    "image": converted_image_base64,
                },
                timeout=60.0,  # Face detection may take longer
            )
            face_detection_response.raise_for_status()
            face_result = face_detection_response.json()
            cropped_faces = face_result["faces"]
            # print(f"Detected {len(cropped_faces)} faces")

            return DetectFacesResponse(cropped_faces=cropped_faces)

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Service timeout")
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Service error: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to service: {str(e)}",
        )
