from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from convert import ImageConversionError, convert_base64_image

app = FastAPI()

class ConvertRequest(BaseModel):
    image_base64: str
    target_format: str

@app.get("/health")
def

@app.post("/convert")
def convert_image(request: ConvertRequest):
    result_b64 = convert_base64_image(request.image_base64, request.target_format)
    return {"converted_image_base64": result_b64}

@app.exception_handler(ImageConversionError)
async def image_conversion_exception_handler(request, exc):
    raise HTTPException(status_code=400, detail=str(exc))
