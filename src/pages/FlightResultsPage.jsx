import { useEffect, useState } from "react";
import { DEFAULTS, REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import FlightCard from "../components/marketplace/FlightCard";
import FlightFilters from "../components/marketplace/FlightFilters";
import LoadingState from "../components/common/LoadingState";

function FlightResultsPage({ searchCriteria, onSelectFlight, onBack }) {
  const [result, setResult] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);
  useEffect(() => {
    let isCurrentRequest = true;
    const search = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.searchFlights(searchCriteria);
      if (isCurrentRequest) { setResult(response); setRequestStatus(REQUEST_STATUS.SUCCESS); }
    };
    search();
    return () => { isCurrentRequest = false; };
  }, [searchCriteria]);
  if (requestStatus === REQUEST_STATUS.LOADING || !result) return <main className="flight-results-page"><LoadingState label="Đang tìm chuyến bay từ các hãng hàng không..." /></main>;
  return <main className="flight-results-page"><div className="results-toolbar"><button onClick={onBack}>← Thay đổi tìm kiếm</button><h1>{result.searchCriteria.originCode} → {result.searchCriteria.destinationCode}</h1><span>{result.searchCriteria.departureDate} · {result.searchCriteria.tripType === "round-trip" ? "Khứ hồi" : "Một chiều"}</span></div><div className="flight-results-layout"><FlightFilters /><section className="results-content"><div className="result-heading"><div><h2>Chuyến bay phù hợp cho bạn</h2><p>{result.flights.length} lựa chọn từ nhiều hãng hàng không</p></div><select defaultValue="recommended"><option value="recommended">Ưu tiên bay thẳng</option><option value="price">Giá thấp nhất</option><option value="duration">Thời gian bay ngắn nhất</option></select></div>{result.flights.slice(DEFAULTS.FLIGHT_RESULT_INDEX, DEFAULTS.FLIGHT_RESULT_INDEX + DEFAULTS.FLIGHT_RESULT_COUNT).map((flight) => <FlightCard key={flight.id} flight={flight} onSelect={onSelectFlight} />)}</section></div></main>;
}

export default FlightResultsPage;
