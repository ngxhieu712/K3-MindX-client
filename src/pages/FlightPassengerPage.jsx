import { useEffect, useState } from "react";
import { DEFAULTS, REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import FlightSummary from "../components/marketplace/FlightSummary";
import LoadingState from "../components/common/LoadingState";
import PassengerForm from "../components/marketplace/PassengerForm";

function FlightPassengerPage({ flight, fareClass, onBack, onComplete }) {
  const [bookingData, setBookingData] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);
  useEffect(() => {
    let isCurrentRequest = true;
    const loadFareDetails = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getFlightBookingDetails({ flightId: flight.id, fareClass });
      if (isCurrentRequest) { setBookingData(response); setRequestStatus(REQUEST_STATUS.SUCCESS); }
    };
    loadFareDetails();
    return () => { isCurrentRequest = false; };
  }, [fareClass, flight.id]);
  if (requestStatus === REQUEST_STATUS.LOADING || !bookingData) return <main className="flight-passenger-page"><LoadingState label="Đang tải thông tin hạng vé..." /></main>;
  return <main className="flight-passenger-page"><div className="flight-stepper"><span className="done">✓ Chi tiết chuyến đi</span><i>→</i><span className="current">2 &nbsp; Thanh toán</span></div><div className="passenger-layout"><PassengerForm flight={bookingData.flight} fareClass={fareClass} onComplete={onComplete} /><div><FlightSummary flight={bookingData.flight} fareClass={fareClass} /><div className="fare-options"><h3>Chọn loại vé</h3>{bookingData.fareOptions.map((fareOption, index) => <button key={fareOption.name} className={index === DEFAULTS.FLIGHT_RESULT_INDEX ? "active" : ""} onClick={() => undefined}><strong>{fareOption.name}</strong><span>+ {fareOption.price.toLocaleString("vi-VN")} VND</span><small>▣ Hành lý xách tay · {fareOption.baggage}</small></button>)}</div><button className="secondary-button" onClick={onBack}>QUAY LẠI KẾT QUẢ</button></div></div></main>;
}

export default FlightPassengerPage;
