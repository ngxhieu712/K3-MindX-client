// Lưu access token TRONG MEMORY (biến module-level), KHÔNG dùng localStorage
// (đúng theo lựa chọn bạn đã chốt). Mất khi F5 -> phải gọi /auth/refresh-token
// (cookie refreshToken httpOnly sẽ tự được browser gửi kèm) lúc app khởi động
// để lấy lại access token mới.
let accessToken = null;
const listeners = new Set();

export const tokenStore = {
  get() {
    return accessToken;
  },

  set(token) {
    accessToken = token;
    listeners.forEach((callback) => callback(accessToken));
  },

  clear() {
    this.set(null);
  },

  // Cho phép 1 AuthContext (nếu bạn có) subscribe để re-render UI khi token đổi.
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};

export default tokenStore;
