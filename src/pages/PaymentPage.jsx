import { useEffect, useState } from "react";
import { DEFAULTS, REQUEST_STATUS, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import { vouchers } from "../data/mockData";
import VoucherBox from "../components/common/VoucherBox";
import Icon from "../components/common/Icon";

const COMBOS = [
  { id: "none",   icon: "🚫", name: "Không",        desc: "",                             price: 0 },
  { id: "small",  icon: "🍿", name: "Combo nhỏ",    desc: "1 bắp + 1 nước 32oz",          price: 69 },
  { id: "big",    icon: "🍿🥤",name: "Combo 2 Big",  desc: "1 bắp + 2 nước ngọt size 27oz", price: 109 },
  { id: "vip",    icon: "👑", name: "Combo Kim Cương", desc: "1 ly KimCương + 1 bắp 69oz", price: 149 },
];

function PaymentPage({ movie, selectedTime, selectedSeats, onBack, onPay }) {
  const [orderData, setOrderData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [selectedCombo, setSelectedCombo] = useState("none");
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getCheckoutSummary({ movie, showtime: selectedTime, selectedSeats }).then(res => {
      if (alive) { setOrderData(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, [movie, selectedTime, selectedSeats]);

  if (status === REQUEST_STATUS.LOADING || !orderData) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải thông tin...
        </div>
      </div>
    );
  }

  const combo = COMBOS.find(c => c.id === selectedCombo);
  const seatTotal = selectedSeats.length * DEFAULTS.VIP_SEAT_PRICE_THOUSAND;
  const comboTotal = combo?.price ?? 0;
  const subTotal = seatTotal + comboTotal;
  const discountAmt = discount
    ? discount.type === "percent"
      ? Math.round(subTotal * discount.discount / 100)
      : discount.discount
    : 0;
  const grandTotal = Math.max(0, subTotal - discountAmt);

  return (
    <div className="payment-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onBack}><Icon name="back" size={20} /></button>
        <span className="top-bar-title">Xác nhận & Thanh toán</span>
      </div>

      {/* movie summary card */}
      <div className="payment-card" style={{ marginTop: 16 }}>
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

      {/* customer info */}
      <div className="payment-card">
        <div className="payment-section-title">Thông tin khách hàng</div>
        <div className="payment-row">
          <span className="payment-row-label">Họ tên</span>
          <span className="payment-row-value">{orderData.customer.name}</span>
        </div>
        <div className="payment-row">
          <span className="payment-row-label">Số điện thoại</span>
          <span className="payment-row-value">{orderData.customer.phone}</span>
        </div>
        <div className="payment-row">
          <span className="payment-row-label">Email</span>
          <span className="payment-row-value" style={{ fontSize: 12 }}>{orderData.customer.email}</span>
        </div>
      </div>

      {/* combo picker */}
      <div className="payment-card">
        <div className="payment-section-title">🍿 Thêm bắp nước</div>
        <div className="combo-select-row">
          {COMBOS.map(c => (
            <button
              key={c.id}
              className={`combo-select-card${selectedCombo === c.id ? " active" : ""}`}
              onClick={() => setSelectedCombo(c.id)}
            >
              <div className="combo-select-card-icon">{c.icon}</div>
              <div className="combo-select-card-name">{c.name}</div>
              {c.price > 0 && <div className="combo-select-card-price">{c.price}K</div>}
            </button>
          ))}
        </div>
        {combo && combo.desc && (
          <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 4 }}>{combo.desc}</div>
        )}
      </div>

      {/* voucher */}
      <VoucherBox
        cinemaName={orderData.cinemaName}
        vouchers={vouchers}
        onApply={setDiscount}
      />

      {/* price breakdown */}
      <div className="payment-card">
        <div className="payment-section-title">Chi tiết thanh toán</div>
        <div className="payment-row">
          <span className="payment-row-label">Ghế ({selectedSeats.length} x {DEFAULTS.VIP_SEAT_PRICE_THOUSAND}K)</span>
          <span className="payment-row-value">{formatMoney(seatTotal)}</span>
        </div>
        {comboTotal > 0 && (
          <div className="payment-row">
            <span className="payment-row-label">{combo.name}</span>
            <span className="payment-row-value">{formatMoney(comboTotal)}</span>
          </div>
        )}
        {discountAmt > 0 && (
          <div className="payment-row">
            <span className="payment-row-label">Giảm giá ({discount.code})</span>
            <span className="payment-row-value" style={{ color: "var(--green)" }}>-{formatMoney(discountAmt)}</span>
          </div>
        )}
        <div className="payment-total-row">
          <span>Tổng cộng</span>
          <span>{formatMoney(grandTotal)}</span>
        </div>
      </div>

      {/* pay button */}
      <button
        className="booking-continue-btn"
        style={{ width: "100%", borderRadius: "var(--radius-sm)", padding: "16px", fontSize: 15 }}
        onClick={() => onPay(grandTotal)}
      >
        Thanh toán {formatMoney(grandTotal)}
      </button>
    </div>
  );
}

export default PaymentPage;
