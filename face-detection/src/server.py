import base64
from typing import List

import cv2
import face_recognition
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class ImageRequest(BaseModel):
    image: str  # base64 encoded image


class ImageResponse(BaseModel):
    faces: List[str]  # list of base64 encoded cropped face images


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/crop-faces", response_model=ImageResponse)
async def crop_faces(request: ImageRequest):
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image)
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # detect faces in the image
        face_locations = face_recognition.face_locations(image)

        # crop faces
        cropped_faces = []
        for top, right, bottom, left in face_locations:
            face_image = image[top:bottom, left:right]
            face_image = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)
            face_image = cv2.resize(face_image, (256, 256))
            face_image = cv2.imencode(".jpg", face_image)[1].tobytes()
            face_image = base64.b64encode(face_image).decode("utf-8")
            cropped_faces.append(face_image)

        return ImageResponse(faces=cropped_faces)

    except ValueError as e:
        if "base64" in str(e).lower() or "invalid" in str(e).lower():
            raise HTTPException(status_code=400, detail="Invalid base64 encoding")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
