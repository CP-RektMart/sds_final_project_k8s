import base64

import requests

test_images = [
    "test1.png",  # Image with multiple faces
    "test2.jpeg",  # Image with multiple faces
    "test3.png",  # Image with multiple faces
    "test4.jpg",  # Image with no faces
]

def crop_faces_example():
    """
    Simple example of using the face detection service.
    Replace 'your_image.jpg' with your actual image path.
    """

    for image_path in test_images:
        print(f"\nProcessing image: {image_path}")
        # Example 1: Load image from file

        try:
            # Read and encode image to base64
            with open('./images/' + image_path, "rb") as f:
                image_data = f.read()
                image_base64 = base64.b64encode(image_data).decode("utf-8")

            # Send request to face detection service
            response = requests.post(
                "http://localhost:8000/crop-faces", json={"image": image_base64}
            )

            # Check response
            if response.status_code == 200:
                result = response.json()
                faces = result["faces"]

                print(f"✓ Successfully detected {len(faces)} face(s)!")

                # Save each cropped face
                for i, face_base64 in enumerate(faces):
                    face_data = base64.b64decode(face_base64)
                    output_path = f"{image_path}_cropped_face_{i + 1}.jpg"

                    with open(output_path, "wb") as f:
                        f.write(face_data)

                    print(f"  - Saved face {i + 1} to: {output_path}")

            elif response.status_code == 404:
                print("✗ No faces detected in the image")

            elif response.status_code == 400:
                print("✗ Invalid image data or format")

            else:
                print(f"✗ Error: {response.status_code} - {response.text}")

        except FileNotFoundError:
            print(f"✗ Error: Image file '{image_path}' not found")
            print("\nPlease replace 'your_image.jpg' with an actual image path")

        except requests.exceptions.ConnectionError:
            print("✗ Error: Cannot connect to the service")
            print("\nMake sure the service is running:")
            print("  python src/server.py")

        except Exception as e:
            print(f"✗ Unexpected error: {e}")


def health_check():
    """Check if the service is running"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✓ Service is running")
            return True
        else:
            print("✗ Service returned unexpected status")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Service is not running")
        print("\nStart the service with:")
        print("  python src/server.py")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Face Detection Service - Usage Example")
    print("=" * 60)

    print("\nStep 1: Checking service health...")
    if health_check():
        print("\nStep 2: Detecting and cropping faces...")
        crop_faces_example()

    print("\n" + "=" * 60)
