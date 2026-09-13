import { useEffect, useState } from "react";
import { REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import Icon from "../components/common/Icon";

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

function PaymentPage({ movie, selectedTime, booking, onBack, onPay }) {
  const [payMethod, setPayMethod] = useState("bank"); // "bank" | "wallet"
  const [wallet, setWallet] = useState(null);
  const [walletStatus, setWalletStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let alive = true;
    setWalletStatus(REQUEST_STATUS.LOADING);
    cinemaService.getWallet()
      .then(w => { if (alive) { setWallet(w); setWalletStatus(REQUEST_STATUS.SUCCESS); } })
      .catch(() => { if (alive) setWalletStatus(REQUEST_STATUS.ERROR); });
    return () => { alive = false; };
  }, []);

  // Không có booking hợp lệ (vd người dùng vào thẳng trang này bằng cách nào
  // đó bất thường) — hiếm khi xảy ra vì BookingPage luôn tạo booking trước khi
  // điều hướng tới đây, nhưng vẫn cần chặn để không hiện giá 0đ/undefined.
  if (!booking) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>
          Không tìm thấy thông tin đặt vé. Vui lòng quay lại chọn ghế.
        </div>
        <button className="booking-continue-btn" onClick={onBack}>Quay lại</button>
      </div>
    );
  }

  const seatLabels = booking.seatDetails?.map(s => s.seatName) ?? [];
  // LƯU Ý: bỏ combo/voucher khỏi trang này — trước đây chúng chỉ cộng/trừ ở
  // client mà không hề được server biết tới, nên số tiền hiển thị ở đây có thể
  // KHÁC số tiền thật sự bị trừ ví/yêu cầu chuyển khoản (booking.totalAmount).
  // Giữ nguyên combo/voucher như cũ sẽ tạo ra 1 lỗi thanh toán sai số tiền thật
  // — nằm ngoài 4 yêu cầu gốc nên tạm ẩn cho tới khi có API tính giá kèm combo/voucher.
  const grandTotal = booking.totalAmount; // giá thật theo đúng loại ghế, tính sẵn khi giữ ghế (B3)
  const canPayWallet = walletStatus === REQUEST_STATUS.SUCCESS && wallet.balance >= grandTotal;

  return (
    <div className="payment-page page-scroll">
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onBack}>
          <Icon name="back" size={20} />
        </button>
        <span className="top-bar-title">Xác nhận & Thanh toán</span>
      </div>

      {/* Movie summary */}
      <div className="payment-card" style={{ marginTop:16 }}>
        <div className="payment-section-title">Thông tin phim</div>
        <div className="payment-movie-row">
          <div className="payment-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>
          <div>
            <div className="payment-movie-title">{movie.title}</div>
            <div className="payment-movie-meta">
              {booking.format && <><span>{booking.format}</span><br /></>}
              <span>📅 {booking.date}</span><br />
              <span>⏰ {selectedTime}</span><br />
              <span>🏛 {booking.cinema}</span><br />
              <span>💺 {seatLabels.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phương thức thanh toán ── */}
      <div className="payment-card">
        <div className="payment-section-title">Phương thức thanh toán</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

          {/* Ví H&N */}
          <button
            onClick={() => setPayMethod("wallet")}
            style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"14px 16px",
              borderRadius:"var(--radius-sm)",
              border:`2px solid ${payMethod==="wallet" ? "var(--accent)" : "var(--border)"}`,
              background: payMethod==="wallet" ? "rgba(232,67,58,0.08)" : "var(--bg-elevated)",
              textAlign:"left",
            }}
          >
            <div style={{
              width:40, height:40, borderRadius:"var(--radius-sm)",
              background:"rgba(232,67,58,0.15)", display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0,
            }}>💳</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>Ví H&N Cinema</div>
              <div style={{ fontSize:12, marginTop:2, color: canPayWallet ? "var(--green)" : "var(--red)" }}>
                Số dư: {wallet ? fmt(wallet.balance) : "..."}
                {!canPayWallet && " — Không đủ tiền"}
              </div>
            </div>
            <div style={{
              width:20, height:20, borderRadius:"50%",
              border:`2px solid ${payMethod==="wallet" ? "var(--accent)" : "var(--border)"}`,
              background: payMethod==="wallet" ? "var(--accent)" : "transparent",
              flexShrink:0,
            }} />
          </button>

          {/* Ngân hàng / QR */}
          <button
            onClick={() => setPayMethod("bank")}
            style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"14px 16px",
              borderRadius:"var(--radius-sm)",
              border:`2px solid ${payMethod==="bank" ? "var(--accent)" : "var(--border)"}`,
              background: payMethod==="bank" ? "rgba(232,67,58,0.08)" : "var(--bg-elevated)",
              textAlign:"left",
            }}
          >
            <div style={{
              width:40, height:40, borderRadius:"var(--radius-sm)",
              background:"rgba(59,130,246,0.15)", display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0,
            }}>🏦</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>Ứng dụng ngân hàng / QR</div>
              <div style={{ fontSize:12, color:"var(--text-sub)", marginTop:2 }}>
                VietQR · MoMo · ZaloPay · Thẻ nội địa
              </div>
            </div>
            <div style={{
              width:20, height:20, borderRadius:"50%",
              border:`2px solid ${payMethod==="bank" ? "var(--accent)" : "var(--border)"}`,
              background: payMethod==="bank" ? "var(--accent)" : "transparent",
              flexShrink:0,
            }} />
          </button>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="payment-card">
        <div className="payment-section-title">Chi tiết thanh toán</div>
        <div className="payment-row">
          <span className="payment-row-label">Ghế ({seatLabels.length} ghế)</span>
          <span className="payment-row-value">{fmt(grandTotal)}</span>
        </div>
        <div className="payment-total-row">
          <span>Tổng cộng</span>
          <span>{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Pay button */}
      <button
        className="booking-continue-btn"
        style={{ width:"100%", borderRadius:"var(--radius-sm)", padding:16, fontSize:15, margin:"0 0 16px" }}
        disabled={payMethod==="wallet" && !canPayWallet}
        onClick={() => onPay(grandTotal, payMethod, seatLabels, movie)}
      >
        {payMethod==="wallet" ? "💳 " : "🏦 "}
        Thanh toán {fmt(grandTotal)}
      </button>
    </div>
  );
}

export default PaymentPage;
