import requests

def test_login():
    url = "http://127.0.0.1:8002/auth/login"
    data = {
        "username": "admin@livrocaixa.local",
        "password": "admin123"
    }
    try:
        response = requests.post(url, data=data) 
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
