import base64
import json
from pathlib import Path

import requests

def test_face_detection(image_path: str, output_dir: str = "output"):
    """
    Test the face detection service with an image file.

    Args:
        image_path: Path to the input image
        output_dir: Directory to save cropped face images
    """
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(exist_ok=True)

    # Read and encode image to base64
    with open(image_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

    # Prepare request
    payload = {"image": encoded_image}

    # prepare saved image name
    image_name = image_path.split("/")[-1].split(".")[0]

    # Send request to the service
    try:
        response = requests.post("http://localhost:8000/crop-faces", json=payload)
        response.raise_for_status()

        result = response.json()
        faces = result["faces"]

        print(f"✓ Detected {len(faces)} face(s)")

        # Save cropped faces
        for i, face_base64 in enumerate(faces):
            face_data = base64.b64decode(face_base64)
            output_path = Path(output_dir) / f"{image_name}_face_{i + 1}.jpg"

            with open(output_path, "wb") as f:
                f.write(face_data)

            print(f"  Saved face {i + 1} to: {output_path}")

        return faces

    except requests.exceptions.RequestException as e:
        print(f"✗ Error: {e}")
        if hasattr(e, "response") and e.response is not None:
            print(f"  Response: {e.response.text}")
        return None


def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        response.raise_for_status()
        print(f"✓ Health check: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"✗ Health check failed: {e}")
        return False


if __name__ == "__main__":
    import sys

    print("=" * 50)
    print("Face Detection Service Test Client")
    print("=" * 50)

    # Test health endpoint
    print("\n1. Testing health endpoint...")
    if not test_health():
        print("\nService is not running. Start it with:")
        print("  python src/server.py")
        sys.exit(1)

    # Test face detection
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        print(f"\n2. Testing face detection with: {image_path}")
        test_face_detection(image_path)
    else:
        print("\nUsage: python test_client.py <image_path>")
        print("Example: python test_client.py test_image.jpg")
