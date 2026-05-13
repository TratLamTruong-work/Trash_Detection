import requests
import qrcode
from PIL import Image

BASE_URL = "http://127.0.0.1:3000/api"  # Chỉnh lại theo be

def generate_qr():
    r = requests.post(f"{BASE_URL}/qr/generate")
    r.raise_for_status()
    data = r.json()
    print("API response:", data)
    return data["data"]["code"]

if __name__ == "__main__":
    code = generate_qr()
    print("Generated code:", code)

    img = qrcode.make(code).resize((400, 400))
    img.save("test_qr.png")
    Image.open("test_qr.png").show()
