import axios from "axios";
import { tokenStore } from "./tokenStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  // BẮT BUỘC true để browser tự gửi kèm cookie httpOnly `refreshToken`
  // trong mọi request (kể cả request gọi /auth/refresh-token).
  withCredentials: true,
});

// Gắn access token (nếu có) vào mọi request.
axiosClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gom nhiều request 401 cùng lúc thành 1 lần gọi refresh duy nhất.
let refreshPromise = null;

const refreshAccessToken = async () => {
  // QUAN TRỌNG: không dùng axiosClient ở đây để tránh vòng lặp interceptor.
  //
  // ⚠️ LƯU Ý — có mâu thuẫn cần bạn kiểm tra lại ở BACKEND:
  // Controller `refreshToken` bạn gửi trước đó đọc token từ `req.body.refreshToken`,
  // nhưng `refreshToken` lại được set là cookie httpOnly (JS không thể đọc để nhét
  // vào body). Để flow cookie hoạt động đúng, backend cần sửa lại thành đọc từ
  // `req.cookies.refreshToken` (cần thêm middleware `cookie-parser`), thay vì
  // `req.body.refreshToken`. Đoạn code dưới đây được viết theo giả định là bạn sẽ
  // sửa lại backend theo hướng đọc cookie, nên KHÔNG gửi refreshToken trong body.
  const res = await axios.post(
    `${API_BASE_URL}/auth/refresh-token`, // TODO: đổi path này cho khớp route thật của bạn
    {},
    { withCredentials: true },
  );

  const newAccessToken = res.data?.accessToken ?? res.data?.data?.accessToken;
  tokenStore.set(newAccessToken);
  return newAccessToken;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        tokenStore.clear();
        // TODO: điều hướng người dùng về trang đăng nhập ở đây nếu cần,
        // ví dụ: window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
