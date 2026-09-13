import { useEffect, useState } from "react";
import { REQUEST_STATUS } from "../../constants/app";
import { cinemaService } from "../../services/cinemaService";

function BookingModal({ movie, cinema, onClose, onConfirm }) {
  const [resolvedCinema, setResolvedCinema] = useState(cinema);
  const [dates, setDates] = useState([]); // [{ iso, day, dow }]
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);

  // Mở modal từ Trang chủ/Tất cả phim (chưa từng chọn rạp) -> tạm lấy rạp đầu
  // tiên thật để vẫn demo được, thay vì hard-code "Beta Thanh Xuân" như trước.
  useEffect(() => {
    if (cinema?.id) { setResolvedCinema(cinema); return; }
    let alive = true;
    cinemaService.getCinemas().then(list => {
      if (alive && list.length) setResolvedCinema({ id: list[0].id, name: list[0].name });
    });
    return () => { alive = false; };
  }, [cinema]);

  useEffect(() => {
    if (!resolvedCinema?.id) return;
    let alive = true;
    cinemaService.getShowDates(resolvedCinema.id).then(res => {
      if (alive) { setDates(res); setSelectedDateIdx(0); }
    });
    return () => { alive = false; };
  }, [resolvedCinema]);

  useEffect(() => {
    const dateIso = dates[selectedDateIdx]?.iso;
    if (!resolvedCinema?.id || !dateIso) { setGroups([]); return; }
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    setSelectedTime(null);
    setSelectedShowtimeId(null);
    cinemaService.getShowtimes({ cinemaId: resolvedCinema.id, date: dateIso }).then(res => {
      if (alive) { setGroups(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, [resolvedCinema, dates, selectedDateIdx]);

  // Đúng suất chiếu của ĐÚNG phim đang mở modal — trước đây lấy nhầm phim đầu
  // tiên trong danh sách mock, không liên quan gì tới phim người dùng bấm vào.
  const allTimes = groups.find(g => String(g.id) === String(movie.id))?.showtimes ?? [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">🎬 {movie.title}</div>
        {resolvedCinema?.name && (
          <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: -8, marginBottom: 10 }}>
            📍 {resolvedCinema.name}
          </div>
        )}

        {/* date strip */}
        {dates.length > 0 && (
          <div className="date-strip">
            {dates.map((d, i) => (
              <button
                key={d.iso}
                className={`date-btn${selectedDateIdx === i ? " active" : ""}`}
                onClick={() => setSelectedDateIdx(i)}
              >
                <span className="date-num">{d.day}</span>
                <span>{d.dow}</span>
              </button>
            ))}
          </div>
        )}

        {/* times */}
        {status === REQUEST_STATUS.LOADING ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Đang tải...
          </div>
        ) : allTimes.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Phim này chưa có suất chiếu vào ngày đã chọn tại rạp này
          </div>
        ) : (
          <div className="time-chips" style={{ marginBottom: 20 }}>
            {allTimes.map((st) => (
              <button
                key={st.id}
                className={`time-chip${selectedShowtimeId === st.id ? " active" : ""}`}
                onClick={() => { setSelectedTime(st.time); setSelectedShowtimeId(st.id); }}
              >
                {st.time}
                <small>{st.format}</small>
              </button>
            ))}
          </div>
        )}

        {/* confirm */}
        <button
          className="booking-continue-btn"
          style={{ width: "100%", borderRadius: "var(--radius-sm)", padding: "14px" }}
          disabled={!selectedTime}
          onClick={() => selectedTime && onConfirm(selectedTime, dates[selectedDateIdx]?.iso, selectedShowtimeId)}
        >
          {selectedTime ? `Xác nhận: ${selectedTime}` : "Chọn suất chiếu"}
        </button>
      </div>
    </div>
  );
}

export default BookingModal;
