// Client gọi API thật ở /api/customer/*. Dùng fetch() có sẵn của trình duyệt,
// không cần cài thêm axios (đồng bộ với cách authService.js đang làm).
//
// QUY ƯỚC: VITE_API_URL là ORIGIN GỐC của server (vd "http://localhost:8080"),
// KHÔNG kèm "/api/..." — giống hệt quy ước authService.js đang dùng cho
// "/api/auth". File này tự thêm "/api/customer".
import { tokenStore } from "../../lib/tokenStore";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_BASE_URL = `${API_ORIGIN}/api/customer`;

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  if (options.auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // response không có JSON body (vd 204) — bỏ qua
  }

  if (!res.ok || body?.success === false) {
    const err = new Error(body?.message || `Yêu cầu thất bại (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return body?.data;
}

export const apiClient = {
  get: (path, options = {}) => request(path, { method: "GET", ...options }),
  post: (path, data, options = {}) =>
    request(path, { method: "POST", body: JSON.stringify(data), ...options }),
};

export default apiClient;
