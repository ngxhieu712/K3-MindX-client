import { useEffect, useState } from "react";
import { REQUEST_STATUS } from "../../constants/app";
import { cinemaService } from "../../services/cinemaService";
import { dates as allDates } from "../../data/mockData";

function BookingModal({ movie, onClose, onConfirm }) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService
      .getShowtimes({ cinemaName: "Beta Thanh Xuân", date: allDates[selectedDate] })
      .then(res => {
        if (alive) { setData(res); setStatus(REQUEST_STATUS.SUCCESS); }
      });
    return () => { alive = false; };
  }, [selectedDate]);

  const parseDateBtn = (d) => {
    const parts = d.split(" - ");
    return { day: parts[0]?.split("/")[0] ?? d, dow: parts[1] ?? "" };
  };

  const allTimes = data?.movies?.[0]?.showtimes ?? [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">🎬 {movie.title}</div>

        {/* date strip */}
        <div className="date-strip">
          {allDates.map((d, i) => {
            const { day, dow } = parseDateBtn(d);
            return (
              <button
                key={i}
                className={`date-btn${selectedDate === i ? " active" : ""}`}
                onClick={() => { setSelectedDate(i); setSelectedTime(null); }}
              >
                <span className="date-num">{day}</span>
                <span>{dow}</span>
              </button>
            );
          })}
        </div>

        {/* times */}
        {status === REQUEST_STATUS.LOADING ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Đang tải...
          </div>
        ) : (
          <div className="time-chips" style={{ marginBottom: 20 }}>
            {allTimes.map((st, i) => (
              <button
                key={i}
                className={`time-chip${selectedTime === st.time ? " active" : ""}`}
                onClick={() => setSelectedTime(st.time)}
              >
                {st.time}
                <small>{st.availableSeats} ghế</small>
              </button>
            ))}
          </div>
        )}

        {/* confirm */}
        <button
          className="booking-continue-btn"
          style={{ width: "100%", borderRadius: "var(--radius-sm)", padding: "14px" }}
          disabled={!selectedTime}
          onClick={() => selectedTime && onConfirm(selectedTime)}
        >
          {selectedTime ? `Xác nhận: ${selectedTime}` : "Chọn suất chiếu"}
        </button>
      </div>
    </div>
  );
}

export default BookingModal;
