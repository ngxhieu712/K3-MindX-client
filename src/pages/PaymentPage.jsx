import { useEffect, useState } from "react";
import { DEFAULTS, REQUEST_STATUS, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import { vouchers, loadWallet } from "../data/mockData";
import VoucherBox from "../components/common/VoucherBox";
import Icon from "../components/common/Icon";

const COMBOS = [
  { id: "none",  icon: "🚫", name: "Không",         desc: "",                              price: 0 },
  { id: "small", icon: "🍿", name: "Combo nhỏ",     desc: "1 bắp + 1 nước 32oz",           price: 69 },
  { id: "big",   icon: "🍿🥤",name: "Combo 2 Big",   desc: "1 bắp + 2 nước ngọt size 27oz", price: 109 },
  { id: "vip",   icon: "👑", name: "Combo Kim Cương",desc: "1 ly Kim Cương + 1 bắp 69oz",   price: 149 },
];

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

function PaymentPage({ movie, selectedTime, selectedSeats, onBack, onPay }) {
  const [orderData, setOrderData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [selectedCombo, setSelectedCombo] = useState("none");
  const [discount, setDiscount] = useState(null);
  const [payMethod, setPayMethod] = useState("bank"); // "bank" | "wallet"
  const [wallet, setWallet] = useState(loadWallet);

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getCheckoutSummary({ movie, showtime: selectedTime, selectedSeats }).then(res => {
      if (alive) { setOrderData(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, [movie, selectedTime, selectedSeats]);

  // Reload wallet mỗi khi component mount
  useEffect(() => { setWallet(loadWallet()); }, []);

  if (status === REQUEST_STATUS.LOADING || !orderData) {
    return (
      <div className="page-scroll" style={{ paddingTop:60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải thông tin...
        </div>
      </div>
    );
  }

  const combo = COMBOS.find(c => c.id === selectedCombo);
  const seatTotal = selectedSeats.length * DEFAULTS.VIP_SEAT_PRICE_THOUSAND * 1000;
  const comboTotal = (combo?.price ?? 0) * 1000;
  const subTotal = seatTotal + comboTotal;
  const discountAmt = discount
    ? discount.type === "percent"
      ? Math.round(subTotal * discount.discount / 100)
      : discount.discount * 1000
    : 0;
  const grandTotal = Math.max(0, subTotal - discountAmt);
  const canPayWallet = wallet.balance >= grandTotal;

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
              <span>{orderData.format}</span><br />
              <span>📅 {orderData.date}</span><br />
              <span>⏰ {selectedTime}</span><br />
              <span>🏛 {orderData.cinemaName}</span><br />
              <span>💺 {selectedSeats.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Combo */}
      <div className="payment-card">
        <div className="payment-section-title">🍿 Thêm bắp nước</div>
        <div className="combo-select-row">
          {COMBOS.map(c => (
            <button
              key={c.id}
              className={`combo-select-card${selectedCombo===c.id?" active":""}`}
              onClick={() => setSelectedCombo(c.id)}
            >
              <div className="combo-select-card-icon">{c.icon}</div>
              <div className="combo-select-card-name">{c.name}</div>
              {c.price > 0 && <div className="combo-select-card-price">{c.price}K</div>}
            </button>
          ))}
        </div>
        {combo?.desc && <div style={{ fontSize:12, color:"var(--text-sub)", marginTop:4 }}>{combo.desc}</div>}
      </div>

      {/* Voucher */}
      <VoucherBox cinemaName={orderData.cinemaName} vouchers={vouchers} onApply={setDiscount} />

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
                Số dư: {fmt(wallet.balance)}
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
          <span className="payment-row-label">Ghế ({selectedSeats.length} × {DEFAULTS.VIP_SEAT_PRICE_THOUSAND}K)</span>
          <span className="payment-row-value">{fmt(seatTotal)}</span>
        </div>
        {comboTotal > 0 && (
          <div className="payment-row">
            <span className="payment-row-label">{combo.name}</span>
            <span className="payment-row-value">{fmt(comboTotal)}</span>
          </div>
        )}
        {discountAmt > 0 && (
          <div className="payment-row">
            <span className="payment-row-label">Giảm giá ({discount.code})</span>
            <span className="payment-row-value" style={{ color:"var(--green)" }}>-{fmt(discountAmt)}</span>
          </div>
        )}
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
        onClick={() => onPay(grandTotal, payMethod, selectedSeats, movie)}
      >
        {payMethod==="wallet" ? "💳 " : "🏦 "}
        Thanh toán {fmt(grandTotal)}
      </button>
    </div>
  );
}

export default PaymentPage;
