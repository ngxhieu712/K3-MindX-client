import { useEffect, useMemo, useState } from "react";
import {
  DEFAULTS,
  REQUEST_STATUS,
  UI_TEXT,
  formatMoney,
} from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import LoadingState from "../components/common/LoadingState";
import MoviePoster from "../components/movies/MoviePoster";
import Seat from "../components/booking/Seat";

const getSeatState = (label, rowIndex, columnIndex, selectedSeats) => {
  if (selectedSeats.includes(label)) return "chosen";
  if (
    rowIndex === DEFAULTS.SOLD_SEAT_ROW_INDEX &&
    columnIndex === DEFAULTS.SOLD_SEAT_COLUMN_INDEX
  )
    return "sold";
  if (
    rowIndex >= DEFAULTS.RESERVED_SEAT_START_ROW_INDEX &&
    rowIndex <= DEFAULTS.RESERVED_SEAT_END_ROW_INDEX
  )
    return "reserved";
  return "empty";
};

function BookingPage({ movie, selectedTime, onNext }) {
  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let isCurrentRequest = true;
    const loadSeatLayout = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getSeatLayout({
        movieId: movie.id,
        showtime: selectedTime,
      });
      if (isCurrentRequest) {
        setSeatData(response);
        setSelectedSeats(response.defaultSelectedSeats);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
      }
    };
    loadSeatLayout();
    return () => {
      isCurrentRequest = false;
    };
  }, [movie.id, selectedTime]);

  const totalPriceThousand = useMemo(
    () => selectedSeats.length * DEFAULTS.VIP_SEAT_PRICE_THOUSAND,
    [selectedSeats],
  );
  const toggleSeat = (seatLabel) =>
    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatLabel))
        return currentSeats.filter((seat) => seat !== seatLabel);
      if (currentSeats.length >= DEFAULTS.MAX_SELECTED_SEATS)
        return currentSeats;
      // TODO: Call POST /api/showtimes/:id/seats/:seatLabel/hold before updating the local selection.
      return [...currentSeats, seatLabel];
    });

  if (requestStatus === REQUEST_STATUS.LOADING || !seatData)
    return (
      <main className="booking-page page">
        <LoadingState label="Đang tải sơ đồ ghế..." />
      </main>
    );

  return (
    <main className="booking-page page">
      <div className="breadcrumbs">
        Trang chủ <span>›</span> Đặt vé <span>›</span> {movie.title}
      </div>
      <div className="age-warning">{UI_TEXT.UNDER_AGE_WARNING}</div>
      <div className="booking-layout">
        <section className="seat-section">
          <div className="legend">
            <span>
              <i className="seat-demo empty" /> Ghế trống
            </span>
            <span>
              <i className="seat-demo chosen" /> Ghế đang chọn
            </span>
            <span>
              <i className="seat-demo held" /> Ghế đang giữ
            </span>
            <span>
              <i className="seat-demo sold" /> Ghế đã bán
            </span>
            <span>
              <i className="seat-demo reserved" /> Ghế đặt trước
            </span>
          </div>
          <div className="screen">MÀN HÌNH CHIẾU</div>
          <div className="seat-map">
            {seatData.seats.map((row, rowIndex) => (
              <div className="seat-row" key={rowIndex}>
                {row.map((seatLabel, columnIndex) => (
                  <Seat
                    key={seatLabel}
                    label={seatLabel}
                    state={getSeatState(
                      seatLabel,
                      rowIndex,
                      columnIndex,
                      selectedSeats,
                    )}
                    onClick={() => toggleSeat(seatLabel)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="seat-summary">
            <div>
              <b>Ghế thường</b>
              <b>Ghế VIP</b>
              <b>Ghế đôi</b>
            </div>
            <div>
              <span>Tổng tiền</span>
              <strong>{formatMoney(totalPriceThousand)}</strong>
            </div>
            <div>
              <span>Thời gian còn lại</span>
              <strong>{seatData.holdDuration}</strong>
            </div>
          </div>
        </section>
        <aside className="booking-side">
          <MoviePoster movie={movie} compact />
          <h2>{movie.title}</h2>
          <h3>{seatData.format}</h3>
          <dl>
            <dt>⌁ Thể loại</dt>
            <dd>{movie.genre.split(",")[0]}</dd>
            <dt>◷ Thời lượng</dt>
            <dd>{movie.length} phút</dd>
            <dt>♜ Rạp chiếu</dt>
            <dd>{seatData.cinemaName}</dd>
            <dt>▣ Ngày chiếu</dt>
            <dd>{seatData.date}</dd>
            <dt>◷ Giờ chiếu</dt>
            <dd>{selectedTime}</dd>
            <dt>♙ Ghế ngồi</dt>
            <dd>{selectedSeats.join(", ")}</dd>
          </dl>
          <button
            className="primary-button"
            onClick={() => onNext(selectedSeats)}
          >
            TIẾP TỤC
          </button>
        </aside>
      </div>
    </main>
  );
}

export default BookingPage;
