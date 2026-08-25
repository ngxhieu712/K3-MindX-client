import { useState } from "react";
import { AUTH_MODE, REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";

const EMPTY_FORM = Object.freeze({
  email: "",
  password: "",
  fullName: "",
  confirmPassword: "",
  birthday: "",
  gender: "",
  phone: "",
  captcha: "",
});

function AuthPage() {
  const [mode, setMode] = useState(AUTH_MODE.LOGIN);
  const [form, setForm] = useState(EMPTY_FORM);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);

  const updateField = (field) => (event) =>
    setForm((currentForm) => ({ ...currentForm, [field]: event.target.value }));
  const submitAuth = async (event) => {
    event.preventDefault();
    setRequestStatus(REQUEST_STATUS.LOADING);
    await cinemaService.submitAuth({ mode, payload: form });
    setRequestStatus(REQUEST_STATUS.SUCCESS);
  };

  const isLoading = requestStatus === REQUEST_STATUS.LOADING;
  return (
    <main className="auth-page page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={mode === AUTH_MODE.LOGIN ? "active" : ""}
            onClick={() => setMode(AUTH_MODE.LOGIN)}
          >
            ĐĂNG NHẬP
          </button>
          <button
            className={mode === AUTH_MODE.REGISTER ? "active" : ""}
            onClick={() => setMode(AUTH_MODE.REGISTER)}
          >
            ĐĂNG KÝ
          </button>
        </div>
        {mode === AUTH_MODE.LOGIN ? (
          <form className="auth-form" onSubmit={submitAuth}>
            <label>
              Email
              <input
                value={form.email}
                onChange={updateField("email")}
                placeholder="✉  Email"
              />
            </label>
            <label>
              Mật khẩu
              <input
                type="password"
                value={form.password}
                onChange={updateField("password")}
                placeholder="🔒  Mật khẩu"
              />
            </label>
            <a href="#forgot">Quên mật khẩu?</a>
            <div className="captcha-row">
              <div className="captcha">62332</div>
              <b>⟳</b>
              <input
                value={form.captcha}
                onChange={updateField("captcha")}
                placeholder="Mã xác thực"
              />
            </div>
            <button className="primary-button" disabled={isLoading}>
              {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP BẰNG TÀI KHOẢN"}
            </button>
            <button type="button" className="facebook-button">
              ĐĂNG NHẬP BẰNG FACEBOOK
            </button>
          </form>
        ) : (
          <form className="register-form" onSubmit={submitAuth}>
            <div className="form-columns">
              <label>
                * Họ tên
                <input
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  placeholder="Họ tên"
                />
              </label>
              <label>
                * Email
                <input
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="Email"
                />
              </label>
              <label>
                * Mật khẩu
                <input
                  type="password"
                  value={form.password}
                  onChange={updateField("password")}
                  placeholder="Mật khẩu"
                />
              </label>
              <label>
                * Xác nhận lại mật khẩu
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  placeholder="Xác nhận lại mật khẩu"
                />
              </label>
              <label>
                * Ngày sinh
                <input
                  value={form.birthday}
                  onChange={updateField("birthday")}
                  placeholder="Ngày sinh"
                />
              </label>
              <label>
                Giới tính
                <select value={form.gender} onChange={updateField("gender")}>
                  <option value="" disabled>
                    Giới tính
                  </option>
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </label>
              <label>
                * Số điện thoại
                <input
                  value={form.phone}
                  onChange={updateField("phone")}
                  placeholder="Số điện thoại"
                />
              </label>
            </div>
            <div className="captcha-row">
              <div className="captcha">23764</div>
              <b>⟳</b>
              <input
                value={form.captcha}
                onChange={updateField("captcha")}
                placeholder="Mã xác thực"
              />
            </div>
            <label className="check">
              <input type="checkbox" /> Tôi cam kết tuân theo{" "}
              <a href="#policy">chính sách bảo mật và điều khoản sử dụng</a> của
              BetaCinemas.
            </label>
            <button className="primary-button" disabled={isLoading}>
              {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
            </button>
            <button type="button" className="facebook-button">
              TIẾP TỤC VỚI FACEBOOK
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default AuthPage;
