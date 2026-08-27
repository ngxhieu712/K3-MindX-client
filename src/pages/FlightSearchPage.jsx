import FlightSearchForm from "../components/marketplace/FlightSearchForm";
import { UI_TEXT } from "../constants/app";

function FlightSearchPage({ airports, onSearch }) {
  return <main className="flight-search-page"><section className="flight-hero"><div><p className="eyebrow">TICKETHUB FLIGHTS</p><h1>{UI_TEXT.FLIGHT_HERO_TITLE}</h1></div></section><FlightSearchForm airports={airports} onSubmit={onSearch} /><section className="flight-deals"><p className="eyebrow">GỢI Ý CHO BẠN</p><h2>Khám phá hành trình mới</h2><div className="deal-grid"><article><span>✈</span><div><strong>Bay quốc tế</strong><p>Đặt vé sớm, giá tốt hơn</p></div></article><article><span>◉</span><div><strong>Đổi lịch linh hoạt</strong><p>An tâm trên mọi hành trình</p></div></article><article><span>♧</span><div><strong>Ưu đãi thành viên</strong><p>Thêm quyền lợi mỗi chuyến đi</p></div></article></div></section></main>;
}

export default FlightSearchPage;
