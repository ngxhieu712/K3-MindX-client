import ServiceSelector from "../components/marketplace/ServiceSelector";

function MarketplaceHomePage({ onNavigate }) {
  return <main className="marketplace-home"><section className="marketplace-hero"><div className="hero-copy"><p className="eyebrow">TICKETHUB MARKETPLACE</p><h1>Một điểm đến cho mọi tấm vé</h1><p>Khám phá, so sánh và đặt vé xem phim, vé máy bay từ những thương hiệu uy tín.</p></div><div className="hero-orbit"><span>✈</span><span>🎬</span><span>✦</span></div></section><ServiceSelector onNavigate={onNavigate} /><section className="marketplace-promo"><div><p className="eyebrow">ƯU ĐÃI MỚI MỖI NGÀY</p><h2>Đi đâu cũng vui,<br />đặt vé thật dễ dàng</h2><p>Ưu đãi độc quyền từ các đối tác hàng đầu được cập nhật liên tục.</p></div><strong>DEAL<br /><span>20%</span></strong></section></main>;
}

export default MarketplaceHomePage;
