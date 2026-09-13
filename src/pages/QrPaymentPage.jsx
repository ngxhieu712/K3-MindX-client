import { useEffect, useState } from "react";
import { REQUEST_STATUS } from "../constants/app";
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
  return { display: `${m}:${s}`, expired: left <= 0 };
}

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

// QR trang trí cho MÀN HÌNH THÀNH CÔNG (xuất trình tại quầy) — chưa có QR vé
// thật (cần sinh Ticket riêng từng ghế, dự kiến làm sau nếu cần). QR THANH
// TOÁN (màn chờ chuyển khoản) dùng ảnh VietQR thật từ server, không dùng cái này.
function DecorativeQRCode({ data, size = 180 }) {
  const seed = data.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cols = 21;
  const cells = Array.from({ length: cols * cols }, (_, i) => {
    const x = i % cols; const y = Math.floor(i / cols);
    if ((x < 7 && y < 7) || (x > cols-8 && y < 7) || (x < 7 && y > cols-8)) return true;
    return ((seed * (i + 3) * 37 + x * 11 + y * 17) % 3) === 0;
  });
  const cell = Math.floor(size / cols);
  return (
    <div style={{
      background:"white", padding:12, borderRadius:"var(--radius-sm)",
      display:"inline-flex", flexDirection:"column",
    }}>
      {Array.from({ length: cols }, (_, y) => (
        <div key={y} style={{ display:"flex" }}>
          {Array.from({ length: cols }, (_, x) => (
            <div key={x} style={{
              width:cell, height:cell,
              background: cells[y * cols + x] ? "#000" : "#fff",
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function QrPaymentPage({ bookingId, amountThousand, payMethod = "bank", selectedSeats = [], movie = null, cinema = "", selectedTime = "", selectedDate = "", onCancel, onGoToTickets }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [paid, setPaid] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(REQUEST_STATUS.IDLE);
  const [error, setError] = useState("");
  const { display: countdown, expired } = useCountdown(payMethod === "bank" ? 9 * 60 + 56 : 0);

  const amount = amountThousand * 1000;

  // Không có bookingId hợp lệ — chặn sớm, không gọi API với id rỗng.
  const invalidBooking = !bookingId;

  useEffect(() => {
    if (invalidBooking) return;
    let alive = true;

    if (payMethod === "wallet") {
      // Ví: xử lý ngay, không cần hiện QR trước.
      setStatus(REQUEST_STATUS.LOADING);
      cinemaService.payBookingWithWallet(bookingId)
        .then(() => { if (alive) { setPaid(true); setStatus(REQUEST_STATUS.SUCCESS); } })
        .catch(err => { if (alive) { setError(err.message || "Thanh toán bằng ví thất bại"); setStatus(REQUEST_STATUS.ERROR); } });
    } else {
      // Ngân hàng/QR: lấy QR thật trước, chờ bấm nút demo xác nhận.
      setStatus(REQUEST_STATUS.LOADING);
      cinemaService.createQrPayment(bookingId)
        .then(res => { if (alive) { setData(res); setStatus(REQUEST_STATUS.SUCCESS); } })
        .catch(err => { if (alive) { setError(err.message || "Không tạo được mã QR"); setStatus(REQUEST_STATUS.ERROR); } });
    }

    return () => { alive = false; };
  }, [bookingId, payMethod, invalidBooking]);

  // Nút "Demo: đã chuyển khoản" — xác nhận thanh toán ngân hàng thật (server
  // chuyển booking pending -> confirmed), không còn tự bịa vé lưu localStorage.
  const handleSimulatePaid = async () => {
    if (confirmStatus === REQUEST_STATUS.LOADING) return;
    setConfirmStatus(REQUEST_STATUS.LOADING);
    setError("");
    try {
      await cinemaService.confirmBankPaymentDemo(bookingId);
      setPaid(true);
      setConfirmStatus(REQUEST_STATUS.SUCCESS);
    } catch (err) {
      setConfirmStatus(REQUEST_STATUS.ERROR);
      setError(err.message || "Xác nhận thanh toán thất bại");
    }
  };

  if (invalidBooking) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>
          Không tìm thấy thông tin đơn đặt vé.
        </div>
        <button className="booking-continue-btn" onClick={onCancel}>Về trang chủ</button>
      </div>
    );
  }

  if (status === REQUEST_STATUS.LOADING || (!data && payMethod === "bank" && !paid)) {
    return (
      <div className="page-scroll" style={{ paddingTop:60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          {payMethod === "wallet" ? "Đang xử lý thanh toán..." : "Đang tạo mã QR..."}
        </div>
      </div>
    );
  }

  if (status === REQUEST_STATUS.ERROR && !paid) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--red)", marginBottom: 16 }}>⚠️ {error}</div>
        <button className="booking-continue-btn" onClick={onCancel}>Về trang chủ</button>
      </div>
    );
  }

  /* ── Màn hình thành công ── */
  if (paid) {
    const qrData = `HN-${bookingId}`;
    return (
      <div className="qr-page page-scroll">
        <div className="top-bar">
          <button className="top-bar-icon-btn" onClick={onCancel}>
            <Icon name="close" size={20} />
          </button>
          <span className="top-bar-title">Thanh toán thành công</span>
        </div>

        <div style={{ padding:"40px 16px 0", textAlign:"center" }}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"rgba(34,197,94,0.15)", border:"2px solid var(--green)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:36, margin:"0 auto 16px",
          }}>✓</div>
          <div style={{ fontSize:20, fontWeight:900, color:"var(--text)", marginBottom:8 }}>
            Đặt vé thành công!
          </div>
          <div style={{ fontSize:14, color:"var(--text-sub)", marginBottom:24 }}>
            Vé của bạn đã được lưu vào lịch sử vé. Xuất trình QR tại quầy soát vé.
          </div>
        </div>

        {/* QR vé (trang trí — vé thật xem trong Lịch sử vé) */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <DecorativeQRCode data={qrData} size={180} />
        </div>

        <div className="payment-card">
          {[
            { label:"Phim",        value: movie?.title || "—" },
            { label:"Rạp",         value: cinema || "—" },
            { label:"Ngày chiếu",  value: selectedDate || "—" },
            { label:"Giờ chiếu",   value: selectedTime || "—" },
            { label:"Ghế",         value: (selectedSeats||[]).join(", ") || "—" },
            { label:"Số tiền",     value: fmt(amount), accent: true },
            { label:"Phương thức", value: payMethod==="wallet" ? "Ví H&N Cinema" : "Chuyển khoản ngân hàng" },
            { label:"Thời gian",   value: new Date().toLocaleString("vi-VN") },
          ].map(r => (
            <div key={r.label} style={{
              display:"flex", justifyContent:"space-between",
              padding:"8px 0", borderBottom:"1px solid var(--border)", fontSize:13,
            }}>
              <span style={{ color:"var(--text-sub)" }}>{r.label}</span>
              <span style={{ fontWeight:700, color: r.accent ? "var(--accent)" : "var(--text)", textAlign:"right", maxWidth:"60%" }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:8, padding:"0 0 16px" }}>
          <button
            onClick={onGoToTickets}
            className="booking-continue-btn"
            style={{ flex:1, borderRadius:"var(--radius-sm)", padding:14 }}
          >
            Xem lịch sử vé
          </button>
          <button
            onClick={onCancel}
            style={{
              flex:1, padding:14,
              background:"var(--bg-card)", border:"1px solid var(--border)",
              borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:14, color:"var(--text-sub)",
            }}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  /* ── Màn hình chờ thanh toán ngân hàng (QR THẬT từ server) ── */
  return (
    <div className="qr-page page-scroll">
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onCancel}>
          <Icon name="close" size={20} />
        </button>
        <span className="top-bar-title">Quét mã thanh toán</span>
      </div>

      <div className="qr-card" style={{ marginTop:16 }}>
        <div className="qr-bank-name">🏦 {data.bankName}</div>
        <div className="qr-amount">{fmt(data.amount)}</div>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <img src={data.qrImageUrl} alt="VietQR" width={220} style={{ borderRadius: "var(--radius-sm)" }} />
        </div>

        {!expired ? (
          <div className="qr-countdown">
            <Icon name="clock" size={14} color="var(--gold)" />
            Hết hạn sau {countdown}
          </div>
        ) : (
          <div style={{ color:"var(--red)", fontWeight:700, fontSize:13 }}>⚠️ Mã đã hết hạn</div>
        )}
      </div>

      <div className="payment-card">
        <div className="payment-section-title">Thông tin chuyển khoản</div>
        {[
          { label:"Số tài khoản",  value: data.accountNumber },
          { label:"Chủ tài khoản", value: data.accountName },
          { label:"Số tiền",       value: fmt(data.amount) },
          { label:"Nội dung CK",   value: data.transferContent },
        ].map(r => (
          <div key={r.label} className="qr-info-row">
            <span className="qr-info-label">{r.label}</span>
            <span className="qr-info-value">{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ padding:"0 16px 8px", fontSize:12, color:"var(--text-muted)", textAlign:"center", lineHeight:1.6 }}>
        Vé sẽ được cấp tự động sau khi xác nhận thanh toán thành công.
      </div>

      {error && (
        <div style={{ padding: "0 16px 8px", color: "var(--red)", fontSize: 13, textAlign: "center" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Demo button — xác nhận thật với server (không còn tự bịa ở client) */}
      <div style={{ padding:"0 16px 8px" }}>
        <button
          onClick={handleSimulatePaid}
          disabled={confirmStatus === REQUEST_STATUS.LOADING}
          style={{
            width:"100%", padding:14, borderRadius:"var(--radius-sm)",
            background:"var(--green)", color:"white", fontWeight:700, fontSize:14,
          }}
        >
          {confirmStatus === REQUEST_STATUS.LOADING ? "Đang xác nhận..." : "✓ Mô phỏng đã thanh toán (Demo)"}
        </button>
      </div>

      <div style={{ padding:"0 16px 16px" }}>
        <button className="qr-cancel-btn" onClick={onCancel}>Hủy giao dịch</button>
      </div>
    </div>
  );
}

export default QrPaymentPage;
