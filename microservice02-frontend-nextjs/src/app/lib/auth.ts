// Login function that calls microservice03 on port 3001
// For host frontend, Docker backend: use host.docker.internal
export async function loginWithMicroservice(identifier: string, password: string) {
  try {
    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    // { role, token }
    return data;
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
