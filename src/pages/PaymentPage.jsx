import { useEffect, useMemo, useState } from "react";
import { REQUEST_STATUS, UI_TEXT, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import LoadingState from "../components/common/LoadingState";
import MoviePoster from "../components/movies/MoviePoster";

function PaymentPage({ movie, selectedTime, selectedSeats, onBack, onPay }) {
  const [summary, setSummary] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);
  const [comboQuantity, setComboQuantity] = useState(0);

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
    return () => {
      isCurrentRequest = false;
    };
  }, [movie, selectedSeats, selectedTime]);

  const totalPriceThousand = useMemo(
    () => (summary?.seatPriceThousand ?? 0) * selectedSeats.length,
    [selectedSeats.length, summary?.seatPriceThousand],
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
            <p>
              Họ Tên:<strong>{summary.customer.name}</strong>
            </p>
            <p>
              Số điện thoại:<strong>{summary.customer.phone}</strong>
            </p>
            <p>
              Email:<strong>{summary.customer.email}</strong>
            </p>
          </div>
          <div className="selected-order">
            <b>GHẾ VIP</b>
            <span>
              {selectedSeats.length} × {formatMoney(summary.seatPriceThousand)}
            </span>
            <strong>= {formatMoney(totalPriceThousand)}</strong>
          </div>
          <h2 className="combo-title">♧ &nbsp; COMBO ƯU ĐÃI</h2>
          <div className="combo-row">
            <div className="combo-art">🍿</div>
            <div>
              <b>{summary.combo.name}</b>
              <p>{summary.combo.description}</p>
            </div>
            <div className="quantity">
              {comboQuantity} &nbsp;{" "}
              <button
                onClick={() => setComboQuantity((quantity) => quantity + 1)}
              >
                ＋
              </button>
              <button
                onClick={() =>
                  setComboQuantity((quantity) => Math.max(0, quantity - 1))
                }
              >
                −
              </button>
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
          </dl>
          <div className="side-actions">
            <button className="secondary-button" onClick={onBack}>
              QUAY LẠI
            </button>
            <button
              className="primary-button"
              onClick={() => onPay(totalPriceThousand)}
            >
              THANH TOÁN
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default PaymentPage;
