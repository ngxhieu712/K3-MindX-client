import { DEFAULTS } from "../../constants/app";

function FlightCard({ flight, onSelect }) {
  return <article className="flight-card"><div className="airline-mark" style={{ color: flight.provider?.color }}>{flight.provider?.shortName}</div><div className="flight-airline"><strong>{flight.provider?.name}</strong><span>▣ {flight.baggage}</span></div><div className="flight-route"><strong>{flight.departure}</strong><small>{flight.origin}</small><span>{flight.duration}<i />Bay thẳng<i /></span><strong>{flight.arrival}</strong><small>{flight.destination}</small></div><div className="flight-price"><strong>{flight.price.toLocaleString("vi-VN")} VND</strong><small>Tiết kiệm 160.773 VND</small><em>◉ Mức giá đặc biệt</em></div><button className="select-flight" onClick={() => onSelect(flight, DEFAULTS.FLIGHT_DEFAULT_CLASS)}>Chọn</button><div className="flight-tags"><span>🇻🇳 Đặt vé Lễ sớm giá hời</span><span>⏱ Giá đặc biệt</span></div></article>;
}

export default FlightCard;
