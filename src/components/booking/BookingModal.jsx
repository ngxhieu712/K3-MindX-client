import { useEffect, useState } from "react";
import { BOOKING, DEFAULTS, REQUEST_STATUS } from "../../constants/app";
import { cinemaService } from "../../services/cinemaService";
import DateStrip from "./DateStrip";
import LoadingState from "../common/LoadingState";

function BookingModal({ movie, dates, time, onClose, onConfirm }) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(DEFAULTS.SELECTED_DATE_INDEX);
  const [showtimeData, setShowtimeData] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let isCurrentRequest = true;
    const loadShowtimes = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getShowtimes({ cinemaName: BOOKING.CINEMA_NAME, date: dates[selectedDateIndex] });
      if (isCurrentRequest) {
        setShowtimeData(response);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
      }
    };
    loadShowtimes();
    return () => { isCurrentRequest = false; };
  }, [dates, selectedDateIndex]);

  return <div className="modal-backdrop"><div className="schedule-modal"><button className="close-button" onClick={onClose}>×</button><p className="eyebrow">LỊCH CHIẾU</p><h1>{movie.title}</h1><h2>Rạp {BOOKING.CINEMA_NAME}</h2><DateStrip dates={dates} selectedDateIndex={selectedDateIndex} onChange={setSelectedDateIndex} /><div className="modal-showtimes"><h3>2D PHỤ ĐỀ</h3>{requestStatus === REQUEST_STATUS.LOADING ? <LoadingState /> : <button className="time-choice selected" onClick={() => onConfirm(time)}><strong>{time}</strong><small>{showtimeData ? BOOKING.AVAILABLE_SEATS : 0} ghế trống</small></button>}</div></div></div>;
}

export default BookingModal;
