import { useEffect, useState } from "react";
import { REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import Icon from "../components/common/Icon";

function ShowtimesPage({ cinema, onBuy, onBack }) {
  const [resolvedCinema, setResolvedCinema] = useState(cinema);
  const [dates, setDates] = useState([]); // [{ iso, day, dow }]
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);

  // Trang này hiện chưa có lối vào khi chưa chọn rạp — nhưng để chắc chắn
  // không bao giờ trắng trang, nếu chưa có rạp thì lấy tạm rạp đầu tiên thật.
  useEffect(() => {
    if (cinema?.id) { setResolvedCinema(cinema); return; }
    let alive = true;
    cinemaService.getCinemas().then(list => {
      if (alive && list.length) setResolvedCinema({ id: list[0].id, name: list[0].name });
    });
    return () => { alive = false; };
  }, [cinema]);

  // Ngày thật còn suất chiếu (thay cho mảng "dates" cố định trước đây)
  useEffect(() => {
    if (!resolvedCinema?.id) return;
    let alive = true;
    cinemaService.getShowDates(resolvedCinema.id).then(res => {
      if (alive) { setDates(res); setSelectedDateIdx(0); }
    });
    return () => { alive = false; };
  }, [resolvedCinema]);

  // Suất chiếu thật cho đúng rạp + ngày đã chọn
  useEffect(() => {
    const dateIso = dates[selectedDateIdx]?.iso;
    if (!resolvedCinema?.id || !dateIso) { setMovies([]); return; }
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getShowtimes({ cinemaId: resolvedCinema.id, date: dateIso }).then(res => {
      if (alive) { setMovies(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, [resolvedCinema, dates, selectedDateIdx]);

  return (
    <div className="showtimes-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onBack}><Icon name="back" size={20} /></button>
        <span className="top-bar-title">{resolvedCinema?.name || "Chọn rạp"}</span>
        <button className="top-bar-icon-btn"><Icon name="search" size={18} /></button>
      </div>

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

      {/* content */}
      {status === REQUEST_STATUS.LOADING ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải lịch chiếu...
        </div>
      ) : dates.length === 0 ? (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)" }}>
          Rạp này hiện chưa có suất chiếu nào sắp tới
        </div>
      ) : movies.length === 0 ? (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)" }}>
          Không có suất chiếu hôm nay
        </div>
      ) : (
        movies.map(movie => (
          <div key={movie.id} className="showtime-movie-row">
            <div className="showtime-movie-info">
              <div className="showtime-movie-poster">
                <img src={movie.poster} alt={movie.title} loading="lazy" />
              </div>
              <div>
                <div className="showtime-movie-title">{movie.title}</div>
                <div className="showtime-movie-meta">
                  {movie.genre} · {movie.length} phút · {movie.age}
                </div>
              </div>
            </div>

            <div className="time-chips">
              {movie.showtimes.map((st) => (
                <button
                  key={st.id}
                  className="time-chip"
                  onClick={() => onBuy(movie, st.time)}
                >
                  {st.time}
                  <small>{st.format}</small>
                </button>
              ))}
            </div>
          </div>
        ))
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

export default ShowtimesPage;
