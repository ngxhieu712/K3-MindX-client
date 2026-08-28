import { useEffect, useMemo, useState } from "react";
import { REQUEST_STATUS, UI_TEXT, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import LoadingState from "../components/common/LoadingState";
import MoviePoster from "../components/movies/MoviePoster";
import VoucherBox from "../components/common/VoucherBox";
import { vouchers } from "../data/mockData";

function PaymentPage({ movie, selectedTime, selectedSeats, onBack, onPay }) {
  const [summary, setSummary] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);
  const [comboQuantity, setComboQuantity] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  useEffect(() => {
    let isCurrentRequest = true;
    const loadCheckoutSummary = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getCheckoutSummary({
        movie,
        showtime: selectedTime,
        selectedSeats,
      });
      if (isCurrentRequest) {
        setSummary(response);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
      }
    };
    loadCheckoutSummary();
    return () => { isCurrentRequest = false; };
  }, [movie, selectedSeats, selectedTime]);

  const comboPrice = 89;

  const seatTotal = useMemo(
    () => (summary?.seatPriceThousand ?? 0) * selectedSeats.length,
    [selectedSeats.length, summary?.seatPriceThousand],
  );

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === "percent")
      return Math.round((seatTotal * appliedVoucher.discount) / 100);
    return appliedVoucher.discount;
  }, [appliedVoucher, seatTotal]);

  const totalPriceThousand = useMemo(
    () => seatTotal + comboQuantity * comboPrice - discountAmount,
    [seatTotal, comboQuantity, discountAmount],
  );

  if (requestStatus === REQUEST_STATUS.LOADING || !summary)
    return (
      <main className="payment-page page">
        <LoadingState label="Đang tải thông tin thanh toán..." />
      </main>
    );

  return (
    <main className="payment-page page">
      <div className="breadcrumbs">
        Trang chủ <span>›</span> Đặt vé <span>›</span> Thông tin thanh toán
      </div>
      <div className="age-warning">{UI_TEXT.UNDER_AGE_WARNING}</div>
      <div className="booking-layout">
        <section className="payment-content">
          <h2>◯ &nbsp; THÔNG TIN THANH TOÁN</h2>
          <div className="customer-grid">
            <p>Họ Tên:<strong>{summary.customer.name}</strong></p>
            <p>Số điện thoại:<strong>{summary.customer.phone}</strong></p>
            <p>Email:<strong>{summary.customer.email}</strong></p>
          </div>

          <div className="selected-order">
            <b>GHẾ VIP</b>
            <span>{selectedSeats.length} × {formatMoney(summary.seatPriceThousand)}</span>
            <strong>= {formatMoney(seatTotal)}</strong>
          </div>

          <h2 className="combo-title">♧ &nbsp; COMBO ƯU ĐÃI</h2>
          <div className="combo-row">
            <div className="combo-art">🍿</div>
            <div>
              <b>{summary.combo.name}</b>
              <p>{summary.combo.description}</p>
              <p className="combo-price-tag">{formatMoney(comboPrice)} / phần</p>
            </div>
            <div className="quantity">
              <span className="quantity-count">{comboQuantity}</span>
              <button onClick={() => setComboQuantity((q) => q + 1)}>＋</button>
              <button onClick={() => setComboQuantity((q) => Math.max(0, q - 1))}>−</button>
            </div>
          </div>

          <VoucherBox
            cinemaName={summary.cinemaName}
            vouchers={vouchers}
            onApply={setAppliedVoucher}
          />

          <div className="price-summary">
            <div className="price-row">
              <span>Ghế ({selectedSeats.length} ghế)</span>
              <span>{formatMoney(seatTotal)}</span>
            </div>
            {comboQuantity > 0 && (
              <div className="price-row">
                <span>Combo × {comboQuantity}</span>
                <span>{formatMoney(comboQuantity * comboPrice)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="price-row discount">
                <span>Giảm giá ({appliedVoucher.code})</span>
                <span>-{formatMoney(discountAmount)}</span>
              </div>
            )}
            <div className="price-row total">
              <span>Tổng cộng</span>
              <strong>{formatMoney(totalPriceThousand)}</strong>
            </div>
          </div>
        </section>

        <aside className="booking-side">
          <MoviePoster movie={movie} compact />
          <h2>{movie.title}</h2>
          <h3>{summary.format}</h3>
          <dl>
            <dt>♜ Rạp chiếu</dt>
            <dd>{summary.cinemaName}</dd>
            <dt>▣ Ngày chiếu</dt>
            <dd>{summary.date}</dd>
            <dt>◷ Giờ chiếu</dt>
            <dd>{selectedTime}</dd>
            <dt>♙ Ghế ngồi</dt>
            <dd>{selectedSeats.join(", ")}</dd>
            {discountAmount > 0 && (
              <>
                <dt>🎟️ Voucher</dt>
                <dd className="voucher-applied-label">{appliedVoucher.code}</dd>
              </>
            )}
          </dl>
          <div className="payment-total-side">
            <span>Tổng thanh toán</span>
            <strong>{formatMoney(totalPriceThousand)}</strong>
          </div>
          <div className="side-actions">
            <button className="secondary-button" onClick={onBack}>QUAY LẠI</button>
            <button className="primary-button" onClick={() => onPay(totalPriceThousand)}>
              THANH TOÁN
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default PaymentPage;
