import requests
import json

BASE_URL = "http://localhost:3008"

def test_courses():
    url = f"{BASE_URL}/api/courses"

    try:
        response = requests.get(url)
        response.raise_for_status()
        print(json.dumps(response.json(), ensure_ascii=False, indent=2))
    except requests.exceptions.RequestException as err:
        print(f"❌ Request failed: {err}")
    except json.JSONDecodeError:
        print("❌ Failed to decode JSON response.")

if __name__ == "__main__":
    test_courses()
