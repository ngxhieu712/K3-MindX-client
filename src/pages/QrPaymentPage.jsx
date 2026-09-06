import { useEffect, useState } from "react";
import { REQUEST_STATUS, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import Icon from "../components/common/Icon";

function useCountdown(seconds) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [left]);
  const m = String(Math.floor(left / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function QrPaymentPage({ amountThousand, onCancel }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const countdown = useCountdown(9 * 60 + 56);

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.createQrPayment({ amountThousand }).then(res => {
      if (alive) { setData(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, [amountThousand]);

  if (status === REQUEST_STATUS.LOADING || !data) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tạo mã QR...
        </div>
      </div>
    );
  }

  return (
    <div className="qr-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onCancel}><Icon name="close" size={20} /></button>
        <span className="top-bar-title">Quét mã thanh toán</span>
      </div>

      <div className="qr-card" style={{ marginTop: 16 }}>
        <div className="qr-bank-name">🏦 {data.bankName}</div>
        <div className="qr-amount">{formatMoney(data.amountThousand)}</div>

        {/* QR placeholder – replace with real QR image from API */}
        <div className="qr-img-wrap">
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📱</div>
            <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>
              Quét mã QR bằng<br />ứng dụng ngân hàng
            </div>
          </div>
        </div>

        <div className="qr-countdown">
          <Icon name="clock" size={14} color="var(--gold)" /> Hết hạn sau {countdown}
        </div>
      </div>

      {/* transfer details */}
      <div className="payment-card">
        <div className="payment-section-title">Thông tin chuyển khoản</div>
        <div className="qr-info-list">
          <div className="qr-info-row">
            <span className="qr-info-label">Số tài khoản</span>
            <span className="qr-info-value">{data.accountNumber}</span>
          </div>
          <div className="qr-info-row">
            <span className="qr-info-label">Số tiền</span>
            <span className="qr-info-value" style={{ color: "var(--accent)" }}>{formatMoney(data.amountThousand)}</span>
          </div>
          <div className="qr-info-row">
            <span className="qr-info-label">Nội dung CK</span>
            <span className="qr-info-value">{data.transferContent}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 16px", fontSize: 12, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
        Vé sẽ được gửi qua email sau khi xác nhận thanh toán thành công.
      </div>

      <div style={{ padding: "0 16px" }}>
        <button className="qr-cancel-btn" onClick={onCancel}>
          Hủy giao dịch
        </button>
      </div>
    </div>
  );
}

export default QrPaymentPage;
