function FlightFilters() {
  return <aside className="flight-filters"><h3>Được đề xuất</h3><label><input type="checkbox" /> Bay thẳng <span>3.125.104 VND</span></label><label><input type="checkbox" /> Hành lý ký gửi <span>3.129.003 VND</span></label><hr /><h3>Hãng hàng không⌃</h3>{["China Eastern Airlines", "Malaysia Airlines", "Philippine Airlines", "Scoot"].map((airline) => <label key={airline}><input type="checkbox" /> {airline}</label>)}<button className="show-more">Hiển thị thêm</button><hr /><h3>Số điểm dừng⌃</h3><label><input type="checkbox" /> Bay thẳng <span>3.125.104 VND</span></label><label><input type="checkbox" /> 1 điểm dừng <span>3.819.590 VND</span></label><label><input type="checkbox" /> 2+ điểm dừng <span>8.184.859 VND</span></label></aside>;
}

export default FlightFilters;
