import { useState } from "react";
import { DEFAULT_FLIGHT_SEARCH, FLIGHT_CLASS, FLIGHT_TRIP_TYPE } from "../../constants/app";

function FlightSearchForm({ airports, onSubmit }) {
  const [form, setForm] = useState(DEFAULT_FLIGHT_SEARCH);
  const updateField = (field) => (event) => setForm((currentForm) => ({ ...currentForm, [field]: event.target.value }));
  const swapAirports = () => setForm((currentForm) => ({ ...currentForm, originCode: currentForm.destinationCode, destinationCode: currentForm.originCode }));
  const origin = airports.find((airport) => airport.code === form.originCode);
  const destination = airports.find((airport) => airport.code === form.destinationCode);

  return <form className="flight-search-card" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}><div className="flight-search-top"><div className="trip-types">{[[FLIGHT_TRIP_TYPE.ONE_WAY, "Một chiều"], [FLIGHT_TRIP_TYPE.ROUND_TRIP, "Khứ hồi"], [FLIGHT_TRIP_TYPE.MULTI_CITY, "Nhiều thành phố"]].map(([value, label]) => <button type="button" key={value} className={form.tripType === value ? "active" : ""} onClick={() => setForm((currentForm) => ({ ...currentForm, tripType: value }))}>{label}</button>)}</div><div className="search-options"><label><input type="checkbox" /> Bay thẳng</label><span>♙ 1 Người lớn, 0 Trẻ em, 0 Em bé⌄</span><span>♧ {form.flightClass === FLIGHT_CLASS.ECONOMY ? "Phổ thông" : "Thương gia"}⌄</span></div></div><div className="flight-fields"><label>Từ<div className="airport-field">✈<select value={form.originCode} onChange={updateField("originCode")}>{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}</select><small>{origin?.name}</small></div></label><button type="button" className="swap-airports" onClick={swapAirports}>⇄</button><label>Đến<div className="airport-field">✈<select value={form.destinationCode} onChange={updateField("destinationCode")}>{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}</select><small>{destination?.name}</small></div></label><label>Ngày khởi hành<input value={form.departureDate} onChange={updateField("departureDate")} /></label><label>Ngày về<input value={form.returnDate} onChange={updateField("returnDate")} /></label><button className="flight-search-button" type="submit">Tìm kiếm chuyến bay</button></div><div className="flight-hint">◉ &nbsp; Cần gợi ý du lịch? <strong>Khám phá điểm đến bay →</strong></div></form>;
}

export default FlightSearchForm;
