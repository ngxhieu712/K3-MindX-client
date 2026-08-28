function ChainDetailPage({ chain, onSelectCinema, onBack }) {
  return (
    <main className="chain-detail-page">
      <div className="chain-detail-header" style={{ "--chain-color": chain.color }}>
        <button className="back-btn" onClick={onBack}>← Quay lại</button>
        <div className="chain-detail-brand">
          <span className="chain-detail-logo">{chain.logo}</span>
          <div>
            <h1 className="chain-detail-name">{chain.name}</h1>
            <p className="chain-detail-desc">{chain.description}</p>
          </div>
        </div>
      </div>

      <div className="chain-detail-content">
        <h2 className="chain-detail-section">📍 Chọn rạp tại Hà Nội</h2>
        <div className="cinema-list">
          {chain.cinemas.map((cinema) => (
            <button
              key={cinema.id}
              className="cinema-list-card"
              onClick={() => onSelectCinema(cinema)}
              style={{ "--chain-color": chain.color }}
            >
              <div className="cinema-list-left">
                <div className="cinema-list-dot" />
                <div>
                  <h3 className="cinema-list-name">{cinema.name}</h3>
                  <p className="cinema-list-address">📌 {cinema.address}</p>
                  <div className="cinema-list-tags">
                    <span className="cinema-tag distance">🗺 {cinema.distance}</span>
                    <span className="cinema-tag screens">🎞 {cinema.screens} phòng chiếu</span>
                  </div>
                </div>
              </div>
              <div className="cinema-list-right">
                <span className="cinema-list-cta">Chọn phim →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ChainDetailPage;
