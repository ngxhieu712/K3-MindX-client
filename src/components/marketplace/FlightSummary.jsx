function FlightSummary({ flight, fareClass }) {
  return <aside className="flight-summary"><h2>Tóm tắt chuyến đi</h2><div className="summary-trip"><small>Chuyến đi</small><div><strong>{flight.origin}</strong><span>{flight.departure}<br />{flight.duration}<br />Bay thẳng</span><strong>{flight.destination}</strong></div><p>{flight.provider?.name} · {fareClass === "business" ? "Thương gia" : "Phổ thông"}</p></div><div className="summary-price"><span>Giá bạn trả</span><strong>{flight.price.toLocaleString("vi-VN")} VND</strong></div></aside>;
}

export default FlightSummary;
