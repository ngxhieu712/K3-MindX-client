function NearbyTheaters({ theaters, onSelect }) {
  return (
    <div className="nearby-section">
      <div className="nearby-header">
        <span className="nearby-icon">📍</span>
        <h2 className="nearby-title">Rạp gần bạn</h2>
        <span className="nearby-sub">Dựa trên vị trí hiện tại</span>
      </div>
      <div className="nearby-grid">
        {theaters.map((theater) => (
          <div className="nearby-card" key={theater.name}>
            <div className="nearby-card-top">
              <div className="nearby-distance-badge">{theater.distance}</div>
              <div className="nearby-screens">{theater.screens} phòng chiếu</div>
            </div>
            <h3 className="nearby-name">{theater.name}</h3>
            <p className="nearby-address">📌 {theater.address}</p>
            <p className="nearby-hotline">📞 {theater.hotline}</p>
            <div className="nearby-actions">
              <button className="nearby-btn primary" onClick={() => onSelect(theater.name)}>
                Xem lịch chiếu
              </button>
              <button className="nearby-btn secondary">
                Chỉ đường
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearbyTheaters;
