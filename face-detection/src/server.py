import base64
from typing import List

import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ultralytics import YOLO

app = FastAPI()

# Load YOLO model (will auto-download on first run)
model = YOLO("yolov8n.pt")  # Using nano model for speed


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

        # Run YOLO inference
        results = model(img, classes=[0], verbose=False)  # class 0 = person

        # Extract face regions using bounding boxes
        cropped_faces = []

        for result in results:
            boxes = result.boxes

            if len(boxes) == 0:
                continue

            for box in boxes:
                # Get bounding box coordinates
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)

                # Calculate head/face region (upper 40% of detected person)
                height = y2 - y1
                face_y1 = y1
                face_y2 = int(y1 + height * 0.4)  # Top 40% of person detection

                # Add some margin for better cropping
                margin_x = int((x2 - x1) * 0.1)
                margin_y = int((face_y2 - face_y1) * 0.1)

                face_x1 = max(0, x1 - margin_x)
                face_x2 = min(img.shape[1], x2 + margin_x)
                face_y1 = max(0, face_y1 - margin_y)
                face_y2 = min(img.shape[0], face_y2 + margin_y)

                # Crop face from original image
                face_img = img[face_y1:face_y2, face_x1:face_x2]

                # Skip if crop is too small
                if face_img.size == 0:
                    continue

                # Encode to base64
                _, buffer = cv2.imencode(".jpg", face_img)
                face_base64 = base64.b64encode(buffer).decode("utf-8")
                cropped_faces.append(face_base64)

        if len(cropped_faces) == 0:
            raise HTTPException(status_code=404, detail="No faces detected")

        return ImageResponse(faces=cropped_faces)

    except ValueError as e:
        if "base64" in str(e).lower() or "invalid" in str(e).lower():
            raise HTTPException(status_code=400, detail="Invalid base64 encoding")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
