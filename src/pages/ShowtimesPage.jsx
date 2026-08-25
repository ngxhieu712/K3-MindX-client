import { useEffect, useState } from "react";
import { DEFAULTS, REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import DateStrip from "../components/booking/DateStrip";
import Icon from "../components/common/Icon";
import LoadingState from "../components/common/LoadingState";
import MoviePoster from "../components/movies/MoviePoster";

function ShowtimesPage({ cinema, dates, onBuy }) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(
    DEFAULTS.SELECTED_DATE_INDEX,
  );
  const [showtimeData, setShowtimeData] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let isCurrentRequest = true;
    const loadShowtimes = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getShowtimes({
        cinemaName: cinema,
        date: dates[selectedDateIndex],
      });
      if (isCurrentRequest) {
        setShowtimeData(response);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
      }
    };
    loadShowtimes();
    return () => {
      isCurrentRequest = false;
    };
  }, [cinema, dates, selectedDateIndex]);

  return (
    <main className="page showtimes-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">LỊCH CHIẾU HÔM NAY</p>
          <h1>{cinema}</h1>
        </div>
        <button className="outline-button">⌖ Đổi rạp</button>
      </div>
      <DateStrip
        dates={dates}
        selectedDateIndex={selectedDateIndex}
        onChange={setSelectedDateIndex}
      />
      <div className="late-note">
        <span /> Suất chiếu muộn từ 22h00
      </div>
      {requestStatus === REQUEST_STATUS.LOADING ? (
        <LoadingState />
      ) : (
        <div className="showtime-list">
          {showtimeData?.movies.map((movie) => (
            <section className="showtime-row" key={movie.id}>
              <MoviePoster movie={movie} compact />
              <div className="showtime-info">
                <h2>{movie.title}</h2>
                <p className="muted">
                  <Icon>⌁</Icon> {movie.genre} <span className="dot">•</span>{" "}
                  <Icon>◷</Icon> {movie.length} phút
                </p>
                <h4>2D PHỤ ĐỀ</h4>
                <div className="time-grid">
                  {movie.showtimes.map((showtime) => (
                    <button
                      key={showtime.time}
                      className={showtime.isHighlighted ? "selected" : ""}
                      onClick={() => onBuy(movie, showtime.time)}
                    >
                      <strong>{showtime.time}</strong>
                      <small>{showtime.availableSeats} ghế trống</small>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

export default ShowtimesPage;
