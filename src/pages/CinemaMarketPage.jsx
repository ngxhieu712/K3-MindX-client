import { useEffect, useMemo, useState } from "react";
import { REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import CinemaBrandFilter from "../components/movies/CinemaBrandFilter";
import LoadingState from "../components/common/LoadingState";

function CinemaMarketPage({ onSelectCinema }) {
  const [marketData, setMarketData] = useState(null);
  const [activeBrandId, setActiveBrandId] = useState("all");
  const [city, setCity] = useState("all");
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);
  useEffect(() => {
    let isCurrentRequest = true;
    const loadCinemaMarketplace = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getCinemaMarketplace();
      if (isCurrentRequest) { setMarketData(response); setRequestStatus(REQUEST_STATUS.SUCCESS); }
    };
    loadCinemaMarketplace();
    return () => { isCurrentRequest = false; };
  }, []);
  const locations = useMemo(() => marketData?.locations.filter((location) => (activeBrandId === "all" || location.providerId === activeBrandId) && (city === "all" || location.city === city)) ?? [], [activeBrandId, city, marketData]);
  if (requestStatus === REQUEST_STATUS.LOADING || !marketData) return <main className="cinema-market-page page"><LoadingState label="Đang tải hệ thống rạp..." /></main>;
  return <main className="cinema-market-page page"><div className="market-page-heading"><div><p className="eyebrow">TICKETHUB CINEMAS</p><h1>Mua vé theo rạp</h1><p>Chọn thương hiệu và địa điểm rạp yêu thích để xem phim đang chiếu.</p></div><select value={city} onChange={(event) => setCity(event.target.value)}><option value="all">Tất cả thành phố</option><option value="Hà Nội">Hà Nội</option><option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option></select></div><CinemaBrandFilter brands={marketData.brands} activeBrandId={activeBrandId} onChange={setActiveBrandId} /><div className="location-heading"><h2>Cụm rạp nổi bật</h2><span>{locations.length} địa điểm</span></div><div className="cinema-location-grid">{locations.map((location) => <article key={location.id}><div className="location-image"><span>{location.providerId.toUpperCase()}</span></div><div className="location-card-content"><p className="eyebrow">{location.city}</p><h3>{location.name}</h3><p>{location.address}</p><span>{location.cinemaCount} phòng chiếu</span><button onClick={() => onSelectCinema(location.name)}>Xem rạp & lịch chiếu →</button></div></article>)}</div></main>;
}

export default CinemaMarketPage;
