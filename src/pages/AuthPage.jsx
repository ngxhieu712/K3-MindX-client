import { useState } from "react";
import { AUTH_MODE, REQUEST_STATUS } from "../constants/app";
import { authService } from "../services/authService";
import Icon from "../components/common/Icon";


// const AUTH_STORAGE_KEY = "hn_user";

function AuthPage({ onBack, onLogin }) {
  const [mode, setMode] = useState(AUTH_MODE.LOGIN);
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "", confirmPassword: "" });
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
  setError("");
  if (mode === AUTH_MODE.REGISTER && form.password !== form.confirmPassword) {
    setError("Mật khẩu xác nhận không khớp!");
    return;
  }
  if (!form.email || !form.password) {
    setError("Vui lòng điền đầy đủ thông tin!");
    return;
  }
  if (mode === AUTH_MODE.REGISTER && !form.name) {
    setError("Vui lòng nhập họ tên!");
    return;
  }

  setStatus(REQUEST_STATUS.LOADING);
  const res = await authService.submitAuth({ mode, payload: form });

  if (res.isSuccessful) {
    setStatus(REQUEST_STATUS.SUCCESS);
    // refreshToken server đã set qua cookie httpOnly, client không đụng tới
    // accessToken giữ ở state/context bên App, KHÔNG lưu localStorage
    onLogin?.(res.user, res.accessToken);
    onBack?.();
  } else {
    setStatus(REQUEST_STATUS.ERROR);
    setError(res.message || "Đăng nhập thất bại. Vui lòng thử lại.");
  }
};

  return (
    <div className="auth-page page-scroll">
      <div className="top-bar">
        {onBack && <button className="top-bar-icon-btn" onClick={onBack}><Icon name="back" size={20} /></button>}
        <span className="top-bar-title">Tài khoản</span>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div className="auth-header">
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎬</div>
          <h1>H&N Cinema</h1>
          <p>Đặt vé, chọn ghế, tận hưởng phim</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === AUTH_MODE.LOGIN ? " active" : ""}`}
            onClick={() => { setMode(AUTH_MODE.LOGIN); setError(""); }}
          >
            Đăng nhập
          </button>
          <button
            className={`auth-tab${mode === AUTH_MODE.REGISTER ? " active" : ""}`}
            onClick={() => { setMode(AUTH_MODE.REGISTER); setError(""); }}
          >
            Đăng ký
          </button>
        </div>

        {mode === AUTH_MODE.REGISTER && (
          <>
            <div className="auth-form-group">
              <label className="auth-label">Họ và tên</label>
              <input className="auth-input" placeholder="Nguyễn Văn A" value={form.name} onChange={set("name")} />
            </div>
            <div className="auth-form-group">
              <label className="auth-label">Số điện thoại</label>
              <input className="auth-input" placeholder="0901234567" value={form.phone} onChange={set("phone")} type="tel" />
            </div>
          </>
        )}

        <div className="auth-form-group">
          <label className="auth-label">Email</label>
          <input className="auth-input" placeholder="email@example.com" value={form.email} onChange={set("email")} type="email" />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Mật khẩu</label>
          <input className="auth-input" placeholder="••••••••" value={form.password} onChange={set("password")} type="password" />
        </div>

        {mode === AUTH_MODE.REGISTER && (
          <div className="auth-form-group">
            <label className="auth-label">Xác nhận mật khẩu</label>
            <input className="auth-input" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} type="password" />
          </div>
        )}

        {error && (
          <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12, textAlign: "center" }}>
            ⚠️ {error}
          </div>
        )}

        <button
          className="auth-submit-btn"
          onClick={handleSubmit}
          disabled={status === REQUEST_STATUS.LOADING}
        >
          {status === REQUEST_STATUS.LOADING
            ? "Đang xử lý..."
            : mode === AUTH_MODE.LOGIN ? "Đăng nhập" : "Đăng ký"}
        </button>

        <div className="auth-social-divider">hoặc</div>

        <button
          className="auth-social-btn"
          onClick={() => alert("Tính năng đăng nhập Facebook chưa được tích hợp")}
        >
          <span>📘</span> Tiếp tục với Facebook
        </button>
        <button
          className="auth-social-btn"
          onClick={() => alert("Tính năng đăng nhập Google chưa được tích hợp")}
        >
          <span>🔴</span> Tiếp tục với Google
        </button>

        {mode === AUTH_MODE.LOGIN && (
          <button
            className="auth-link"
            style={{ background:"none", border:"none", width:"100%", cursor:"pointer" }}
            onClick={() => alert("Vui lòng liên hệ hỗ trợ: support@hncinema.vn")}
          >
            Quên mật khẩu?
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
