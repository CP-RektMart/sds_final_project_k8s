import base64
from io import BytesIO
from PIL import Image

ALLOWED_FORMATS = {"png", "jpeg", "webp"}
MAX_BASE64_SIZE_MB = 5  # maximum allowed size in MB
MIME_TYPES = {
    "png": "image/png",
    "jpeg": "image/jpeg",
    "webp": "image/webp"
}

def convert_base64_image(input_base64: str, target_format: str) -> str:
    if input_base64.startswith("data:"):
        input_format = input_base64.split(",")[0].split("/")[1].split(';')[0]
        if input_format not in ALLOWED_FORMATS:
          raise ImageConversionError(f"Unsupported input format: {target_format}")
        input_base64 = input_base64.split(",")[1]

    if target_format not in ALLOWED_FORMATS:
      raise ImageConversionError(f"Unsupported target format: {target_format}")

    image_data = base64.b64decode(input_base64)

    size_mb = len(image_data) / (1024 * 1024)
    if  size_mb > MAX_BASE64_SIZE_MB:
        raise ImageConversionError(f"Base64 image too large ({size_mb:.2f} MB)")

    image = Image.open(BytesIO(image_data))

    if target_format.lower() in {"jpg", "jpeg"} and image.mode in ("RGBA", "LA"):
        image = image.convert("RGB")

    buffered = BytesIO()
    image.save(buffered, format=target_format.upper())
    converted_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    prefix = f"data:{MIME_TYPES[target_format.lower()]};base64,"

    return prefix + converted_b64

class ImageConversionError(Exception):
    """Raised when image conversion fails."""
    def __init__(self, message: str):
        super().__init__(message)
