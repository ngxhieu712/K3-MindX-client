import { PAGE } from "../constants/app";
import Icon from "../components/common/Icon";

function ChainDetailPage({ chain, cinema, onSelectCinema, onBack }) {
  // If a specific cinema was already selected, go straight to showtimes UI
  const targetChain = chain;

  return (
    <div className="chains-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={onBack}><Icon name="back" size={20} /></button>
        <span className="top-bar-title">{targetChain.name}</span>
        <button className="top-bar-icon-btn"><Icon name="home" size={18} /></button>
      </div>

      {/* chain hero */}
      <div style={{
        padding: "16px",
        background: `linear-gradient(135deg, ${targetChain.color}22 0%, var(--bg-card) 100%)`,
        borderBottom: "1px solid var(--border)",
        marginBottom: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 40 }}>{targetChain.logo}</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{targetChain.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 2 }}>{targetChain.description}</div>
          </div>
        </div>
      </div>

      {/* promo note */}
      {targetChain.promoText && (
        <div style={{
          margin: "0 16px 12px",
          padding: "10px 14px",
          background: "rgba(232,67,58,0.08)",
          border: "1px solid rgba(232,67,58,0.25)",
          borderRadius: "var(--radius-sm)",
          fontSize: 13,
          color: "var(--accent)",
          fontWeight: 600,
        }}>
          🎫 {targetChain.promoText}
        </div>
      )}

      {/* cinema list */}
      <div className="chain-group-header" style={{ marginTop: 8 }}>
        <span className="chain-group-name">📍 Chọn rạp tại Hà Nội</span>
        <span className="chain-group-count">{targetChain.cinemas.length} rạp</span>
      </div>

      {targetChain.cinemas.map(ci => (
        <button
          key={ci.id}
          className="cinema-item"
          onClick={() => onSelectCinema(ci)}
        >
          <div className="cinema-item-logo">{targetChain.logo}</div>
          <div className="cinema-item-body">
            <div className="cinema-item-name">{ci.name}</div>
            <div className="cinema-item-district">
              {ci.address.split(",").slice(-2).join(",").trim()}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <span style={{
                fontSize: 11, background: "var(--bg-elevated)", color: "var(--text-sub)",
                padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 600,
              }}>
                🗺 {ci.distance}
              </span>
              <span style={{
                fontSize: 11, background: "var(--bg-elevated)", color: "var(--text-sub)",
                padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 600,
              }}>
                🎞 {ci.screens} phòng
              </span>
            </div>
          </div>
          <div className="cinema-item-actions">
            <span className="cinema-heart"><Icon name="heart" size={18} /></span>
            <span className="cinema-directions">Chọn phim</span>
          </div>
        </button>
      ))}

      <div style={{ height: 16 }} />
    </div>
  );
}

export default ChainDetailPage;
