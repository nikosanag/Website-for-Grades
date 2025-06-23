import requests

BASE_URL = "http://localhost:3008"
COURSE_ID = "3206"  # Adjust this if needed

def test_distribution(course_id):
    url = f"{BASE_URL}/api/grades/distribution/{course_id}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise for HTTP errors
        print(response.text)  # Print raw JSON response as string
    except requests.exceptions.HTTPError as http_err:
        print(f"❌ HTTP error: {http_err} - Status Code: {response.status_code}")
        try:
            print(response.text)
        except Exception:
            print("⚠️ Non-JSON response.")
    except requests.exceptions.RequestException as req_err:
        print(f"❌ Request failed: {req_err}")

if __name__ == "__main__":
    test_distribution(COURSE_ID)
