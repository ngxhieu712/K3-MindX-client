// đầu file, cùng chỗ với các import khác
import { AUTH_MODE } from "../constants/app.js";

const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_URL = `${API_URL}/api/auth`;

export const authService = {
  // ...các method khác của authService...

  async submitAuth({ mode, payload }) {
    const endpoint = mode === AUTH_MODE.REGISTER ? "register" : "login";

    const body =
      mode === AUTH_MODE.REGISTER
        ? {
            fullName: payload.name,
            phoneNumber: payload.phone,
            email: payload.email,
            password: payload.password,
          }
        : { email: payload.email, password: payload.password };

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          isSuccessful: false,
          message: data.message || "Có lỗi xảy ra",
        };
      }
      return {
        isSuccessful: true,
        accessToken: data.accessToken,
        user: data.user,
      };
    } catch (err) {
      // lỗi mạng: server chết, CORS chặn, mất kết nối...
      console.error("Lỗi mạng tại hàm submitAuth:", err);
      return {
        isSuccessful: false,
        message: "Không thể kết nối tới server. Vui lòng thử lại sau.",
      };
    }
  },

  // ...các method khác của cinemaService...
};
