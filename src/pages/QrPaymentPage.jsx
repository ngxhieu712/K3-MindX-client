import { useEffect, useState } from "react";
import { REQUEST_STATUS, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import { loadWallet, saveWallet, loadTickets, saveTickets } from "../data/mockData";
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

// Tạo QR pattern giả từ seed
function QRCode({ data, size = 180 }) {
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

function QrPaymentPage({ amountThousand, payMethod = "bank", selectedSeats = [], movie = null, cinema = "", selectedTime = "", selectedDate = "", onCancel, onGoToTickets }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [paid, setPaid] = useState(false);
  const [ticketId] = useState("TK" + Date.now().toString().slice(-6));
  const { display: countdown, expired } = useCountdown(payMethod === "bank" ? 9 * 60 + 56 : 0);

  const amount = amountThousand * 1000;
  const qrData = `HN-${ticketId}-${(selectedSeats || []).join("")}-${Date.now()}`;

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.createQrPayment({ amountThousand }).then(res => {
      if (alive) { setData(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, [amountThousand]);

  // Nếu thanh toán bằng ví → tự động xử lý ngay
  useEffect(() => {
    if (payMethod === "wallet" && data && !paid) {
      const wallet = loadWallet();
      if (wallet.balance >= amount) {
        // Trừ tiền ví
        const tx = {
          id: "W" + Date.now(),
          type: "payment",
          amount: -amount,
          desc: `Thanh toán vé ${ticketId}`,
          date: new Date().toLocaleString("vi-VN"),
          status: "success",
        };
        saveWallet({ balance: wallet.balance - amount, transactions: [tx, ...wallet.transactions] });
        // Tạo vé
        _createTicket();
        setPaid(true);
      }
    }
  }, [data, payMethod]);

  const _createTicket = () => {
    const tickets = loadTickets();
    const now = new Date();
    const newTicket = {
      id: ticketId,
      bookingId: "BK" + Date.now(),
      movie: movie?.title ?? "Phim",
      poster: movie?.poster ?? "",
      cinema: cinema || "Rạp chiếu",
      room: "Phòng 1",
      format: "2D Phụ đề",
      date: selectedDate || now.toLocaleDateString("vi-VN"),
      time: selectedTime || "—",
      seats: selectedSeats || [],
      total: amount,
      payMethod,
      status: "active",
      purchasedAt: now.toLocaleString("vi-VN"),
      qrData,
    };
    saveTickets([newTicket, ...tickets]);
  };

  // Giả lập thanh toán ngân hàng thành công sau 5 giây (demo)
  const handleSimulatePaid = () => {
    _createTicket();
    setPaid(true);
  };

  if (status === REQUEST_STATUS.LOADING || !data) {
    return (
      <div className="page-scroll" style={{ paddingTop:60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          {payMethod === "wallet" ? "Đang xử lý thanh toán..." : "Đang tạo mã QR..."}
        </div>
      </div>
    );
  }

  /* ── Màn hình thành công ── */
  if (paid) {
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
            Mã vé của bạn đã được tạo. Xuất trình QR tại quầy soát vé.
          </div>
        </div>

        {/* QR vé */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <QRCode data={qrData} size={180} />
        </div>

        <div style={{ textAlign:"center", fontSize:11, color:"var(--text-muted)", marginBottom:16, fontFamily:"monospace", letterSpacing:1 }}>
          {qrData}
        </div>

        <div className="payment-card">
          {[
            { label:"Mã vé",       value: ticketId },
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

  /* ── Màn hình chờ thanh toán ngân hàng ── */
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
        <div className="qr-amount">{fmt(amount)}</div>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <QRCode data={data.accountNumber + amount} size={180} />
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
          { label:"Số tiền",       value: fmt(amount) },
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

      {/* Demo button */}
      <div style={{ padding:"0 16px 8px" }}>
        <button
          onClick={handleSimulatePaid}
          style={{
            width:"100%", padding:14, borderRadius:"var(--radius-sm)",
            background:"var(--green)", color:"white", fontWeight:700, fontSize:14,
          }}
        >
          ✓ Mô phỏng đã thanh toán (Demo)
        </button>
      </div>

      <div style={{ padding:"0 16px 16px" }}>
        <button className="qr-cancel-btn" onClick={onCancel}>Hủy giao dịch</button>
      </div>
    </div>
  );
}

export default QrPaymentPage;
