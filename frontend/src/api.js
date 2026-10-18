// One place for the backend address. Set VITE_API_URL in a .env file to change it.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function apiFetch(path, { method = "GET", body, token, signal } = {}) {
    let response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            signal,
            headers: {
                ...(body ? { "Content-Type": "application/json" } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (err) {
        if (err.name === "AbortError") throw err;
        const error = new Error("Can't reach the server. Check that the backend is running.");
        error.status = 0;
        throw error;
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        // response had no JSON body
    }

    if (!response.ok) {
        const error = new Error(data?.message || `Request failed (${response.status})`);
        error.status = response.status;
        throw error;
    }

    return data;
}
