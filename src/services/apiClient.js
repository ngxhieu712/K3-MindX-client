import { DEFAULTS } from "../constants/app";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const waitForMockResponse = (payload) => new Promise((resolve) => {
  window.setTimeout(() => resolve(payload), DEFAULTS.MOCK_REQUEST_DELAY_MS);
});

const request = async ({ path, fallback, options }) => {
  if (!API_BASE_URL) return waitForMockResponse(fallback);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return response.json();
  } catch (error) {
    // Mock data remains available when the server or a provider adapter is offline.
    console.warn(`API fallback for ${path}`, error);
    return waitForMockResponse(fallback);
  }
};

export const apiClient = {
  get: (path, fallback) => request({ path, fallback }),
  post: (path, body, fallback) => request({ path, fallback, options: { method: "POST", body: JSON.stringify(body) } }),
};
