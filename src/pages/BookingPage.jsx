import { useEffect, useMemo, useState } from "react";
import { DEFAULTS, REQUEST_STATUS, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import Icon from "../components/common/Icon";

const getSeatState = (label, rowIndex, colIndex, selected) => {
  if (selected.includes(label)) return "chosen";
  if (rowIndex === DEFAULTS.SOLD_SEAT_ROW_INDEX && colIndex === DEFAULTS.SOLD_SEAT_COLUMN_INDEX)
    return "sold";
  if (rowIndex >= DEFAULTS.RESERVED_SEAT_START_ROW_INDEX && rowIndex <= DEFAULTS.RESERVED_SEAT_END_ROW_INDEX)
    return "reserved";
  return "empty";
};

function BookingPage({ movie, selectedTime, onNext, onBack }) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getSeatLayout({ movieId: movie.id, showtime: selectedTime }).then(res => {
      if (alive) {
        setData(res);
        setSelected(res.defaultSelectedSeats);
        setStatus(REQUEST_STATUS.SUCCESS);
      }
    });
    return () => { alive = false; };
  }, [movie.id, selectedTime]);

  const total = useMemo(() => selected.length * DEFAULTS.VIP_SEAT_PRICE_THOUSAND, [selected]);

  const toggleSeat = (label) => {
    setSelected(cur => {
      if (cur.includes(label)) return cur.filter(s => s !== label);
      if (cur.length >= DEFAULTS.MAX_SELECTED_SEATS) return cur;
      return [...cur, label];
    });
  };

  if (status === REQUEST_STATUS.LOADING || !data) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải sơ đồ ghế...
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onBack}><Icon name="back" size={20} /></button>
        <span className="top-bar-title">Chọn ghế</span>
      </div>

      {/* age warning */}
      <div className="age-warning-bar">
        ⚠️ Phim dành cho khán giả từ {movie.age === "T16" ? "16" : movie.age === "T13" ? "13" : "0"} tuổi trở lên
      </div>

      {/* movie info bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
      }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{ width: 44, height: 62, objectFit: "cover", borderRadius: 6 }}
        />
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{movie.title}</div>
          <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 2 }}>
            {data.format} · {data.date} · {selectedTime}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-sub)" }}>{data.cinemaName}</div>
        </div>
      </div>

      {/* screen */}
      <div style={{ padding: "20px 32px 4px" }}>
        <div className="screen-bar" />
        <div className="screen-label">MÀN HÌNH</div>
      </div>

      {/* seat map */}
      <div className="seat-map-wrap">
        {data.seats.map((row, ri) => (
          <div className="seat-row" key={ri}>
            {row.map((label, ci) => {
              const state = getSeatState(label, ri, ci, selected);
              return (
                <button
                  key={label}
                  className={`seat ${state}`}
                  onClick={() => state !== "sold" && state !== "reserved" && toggleSeat(label)}
                  title={label}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="seat-legend">
        {[
          ["empty",    "Trống"],
          ["chosen",   "Đang chọn"],
          ["sold",     "Đã bán"],
          ["reserved", "Giữ trước"],
        ].map(([cls, lbl]) => (
          <div key={cls} className="legend-item">
            <div className={`legend-dot ${cls}`} />
            {lbl}
          </div>
        ))}
      </div>

      {/* bottom summary bar */}
      <div className="booking-summary-bar">
        <div className="booking-summary-info">
          <div className="booking-summary-seats">
            {selected.length > 0
              ? `Ghế: ${selected.join(", ")}`
              : "Chưa chọn ghế nào"}
          </div>
          <div className="booking-summary-price">
            Tổng: <span>{formatMoney(total)}</span>
          </div>
        </div>
        <button
          className="booking-continue-btn"
          disabled={selected.length === 0}
          onClick={() => onNext(selected)}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}

export default BookingPage;
