import { useEffect, useState } from "react";
import { REQUEST_STATUS, PAGE } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import Icon from "../components/common/Icon";

function ShowtimesPage({ cinema, dates, onBuy, onBack }) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getShowtimes({ cinemaName: cinema, date: dates[selectedDate] }).then(res => {
      if (alive) { setData(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, [cinema, selectedDate, dates]);

  const parseDateBtn = (d) => {
    const parts = d.split(" - ");
    return { day: parts[0]?.split("/")[0] ?? d, dow: parts[1] ?? "" };
  };

  return (
    <div className="showtimes-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onBack}><Icon name="back" size={20} /></button>
        <span className="top-bar-title">{cinema}</span>
        <button className="top-bar-icon-btn"><Icon name="search" size={18} /></button>
      </div>

      {/* date strip */}
      <div className="date-strip">
        {dates.map((d, i) => {
          const { day, dow } = parseDateBtn(d);
          return (
            <button
              key={i}
              className={`date-btn${selectedDate === i ? " active" : ""}`}
              onClick={() => setSelectedDate(i)}
            >
              <span className="date-num">{day}</span>
              <span>{dow}</span>
            </button>
          );
        })}
      </div>

      {/* content */}
      {status === REQUEST_STATUS.LOADING || !data ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải lịch chiếu...
        </div>
      ) : data.movies.length === 0 ? (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)" }}>
          Không có suất chiếu hôm nay
        </div>
      ) : (
        data.movies.map(movie => (
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

            <div style={{ marginBottom: 4, fontSize: 12, color: "var(--text-muted)", paddingLeft: 2 }}>
              2D Phụ đề
            </div>
            <div className="time-chips">
              {movie.showtimes.map((st, i) => (
                <button
                  key={i}
                  className={`time-chip${st.isHighlighted ? " active" : ""}`}
                  onClick={() => onBuy(movie, st.time)}
                >
                  {st.time}
                  <small>{st.availableSeats} ghế</small>
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
