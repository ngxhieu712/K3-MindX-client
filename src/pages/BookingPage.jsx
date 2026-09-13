import { useEffect, useMemo, useState } from "react";
import { DEFAULTS, REQUEST_STATUS, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import Icon from "../components/common/Icon";

function priceForSeatType(type, price) {
  if (!price) return 0;
  if (type === "vip") return price.vip ?? price.standard ?? 0;
  if (type === "couple") return price.couple ?? price.standard ?? 0;
  return price.standard ?? 0;
}

function BookingPage({ movie, selectedTime, selectedShowtimeId, onNext, onBack }) {
  const [data, setData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [submitStatus, setSubmitStatus] = useState(REQUEST_STATUS.IDLE);
  const [error, setError] = useState("");

  const loadSeats = () => {
    if (!selectedShowtimeId) return;
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    setError("");
    cinemaService.getSeatLayout(selectedShowtimeId)
      .then(res => {
        if (!alive) return;
        setData(res);
        setSelectedIds([]); // sơ đồ thật, không còn chọn sẵn ghế nào (bỏ H7/H8/H9 hard-code cũ)
        setStatus(REQUEST_STATUS.SUCCESS);
      })
      .catch(err => {
        if (!alive) return;
        setError(err.message || "Không tải được sơ đồ ghế");
        setStatus(REQUEST_STATUS.ERROR);
      });
    return () => { alive = false; };
  };

  // loadSeats đọc selectedShowtimeId hiện tại qua closure, không cần liệt kê
  // thêm (và nó được định nghĩa lại mỗi render nên đưa vào deps sẽ gây lặp vô ích).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadSeats(), [selectedShowtimeId]);

  const allSeats = useMemo(() => (data?.rows || []).flatMap(r => r.seats), [data]);
  const selectedSeats = useMemo(
    () => allSeats.filter(s => selectedIds.includes(s._id)),
    [allSeats, selectedIds],
  );
  const total = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + priceForSeatType(s.type, data?.showtime?.price), 0),
    [selectedSeats, data],
  );

  const toggleSeat = (seat) => {
    if (seat.status === "unavailable") return;
    setSelectedIds(cur => {
      if (cur.includes(seat._id)) return cur.filter(id => id !== seat._id);
      if (cur.length >= DEFAULTS.MAX_SELECTED_SEATS) return cur;
      return [...cur, seat._id];
    });
  };

  const handleContinue = async () => {
    if (selectedIds.length === 0 || submitStatus === REQUEST_STATUS.LOADING) return;
    setSubmitStatus(REQUEST_STATUS.LOADING);
    setError("");
    try {
      const booking = await cinemaService.createBookingHold({
        showtimeId: selectedShowtimeId,
        seatIds: selectedIds,
      });
      setSubmitStatus(REQUEST_STATUS.SUCCESS);
      onNext({ ...booking, format: data.showtime.format });
    } catch (err) {
      setSubmitStatus(REQUEST_STATUS.ERROR);
      // 409: ghế vừa bị người khác giữ/mua trong lúc mình đang chọn -> tải lại
      // sơ đồ ghế thật để thấy đúng ghế nào còn trống, không cho thanh toán nhầm.
      setError(err.message || "Không đặt được ghế, vui lòng thử lại");
      if (err.status === 409) loadSeats();
    }
  };

  if (!selectedShowtimeId) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>
          Không xác định được suất chiếu. Vui lòng quay lại chọn suất chiếu.
        </div>
        <button className="booking-continue-btn" onClick={onBack}>Quay lại</button>
      </div>
    );
  }

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

  if (status === REQUEST_STATUS.ERROR) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>😕 {error}</div>
        <button className="booking-continue-btn" onClick={loadSeats}>Thử lại</button>
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
            {data.showtime.format} · {selectedTime}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-sub)" }}>
            {data.cinema?.name} · {data.auditorium?.name}
          </div>
        </div>
      </div>

      {/* screen */}
      <div style={{ padding: "20px 32px 4px" }}>
        <div className="screen-bar" />
        <div className="screen-label">MÀN HÌNH</div>
      </div>

      {/* seat map (dữ liệu ghế thật theo đúng phòng của suất chiếu này) */}
      <div className="seat-map-wrap">
        {data.rows.map(({ row, seats }) => (
          <div className="seat-row" key={row}>
            {seats.map((seat) => {
              const label = `${seat.row}${seat.number}`;
              const state = seat.status === "unavailable"
                ? "sold"
                : selectedIds.includes(seat._id) ? "chosen" : "empty";
              return (
                <button
                  key={seat._id}
                  className={`seat ${state}${seat.type === "vip" ? " vip" : ""}`}
                  disabled={seat.status === "unavailable"}
                  onClick={() => toggleSeat(seat)}
                  title={`${label}${seat.type === "vip" ? " (VIP)" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="seat-legend">
        {[
          ["empty", "Trống"],
          ["chosen", "Đang chọn"],
          ["sold", "Đã bán / đang được giữ"],
        ].map(([cls, lbl]) => (
          <div key={cls} className="legend-item">
            <div className={`legend-dot ${cls}`} />
            {lbl}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: -4 }}>
        Còn {data.availableSeats}/{data.totalSeats} ghế trống
      </div>

      {error && submitStatus === REQUEST_STATUS.ERROR && (
        <div style={{ margin: "8px 16px 0", color: "var(--red)", fontSize: 13, textAlign: "center" }}>
          ⚠️ {error}
        </div>
      )}

      {/* bottom summary bar */}
      <div className="booking-summary-bar">
        <div className="booking-summary-info">
          <div className="booking-summary-seats">
            {selectedSeats.length > 0
              ? `Ghế: ${selectedSeats.map(s => `${s.row}${s.number}`).join(", ")}`
              : "Chưa chọn ghế nào"}
          </div>
          <div className="booking-summary-price">
            Tổng: <span>{formatMoney(Math.round(total / 1000))}</span>
          </div>
        </div>
        <button
          className="booking-continue-btn"
          disabled={selectedIds.length === 0 || submitStatus === REQUEST_STATUS.LOADING}
          onClick={handleContinue}
        >
          {submitStatus === REQUEST_STATUS.LOADING ? "Đang giữ ghế..." : "Tiếp tục"}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;
