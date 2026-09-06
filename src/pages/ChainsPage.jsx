import { useState } from "react";
import { chains } from "../data/mockData";
import Icon from "../components/common/Icon";

const ALL = "all";

function ChainsPage({ onSelectChain }) {
  const [activeChain, setActiveChain] = useState(ALL);
  const [search, setSearch] = useState("");
  const [showLocation, setShowLocation] = useState(true);

  const filtered = chains
    .filter(c => activeChain === ALL || c.id === activeChain)
    .map(c => ({
      ...c,
      cinemas: c.cinemas.filter(ci =>
        ci.name.toLowerCase().includes(search.toLowerCase()) ||
        ci.address.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(c => c.cinemas.length > 0);

  return (
    <div className="chains-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <span className="top-bar-title" style={{ marginRight: 0 }}>Chọn theo rạp</span>
        <button className="top-bar-icon-btn"><Icon name="home" size={18} /></button>
      </div>

      {/* search */}
      <div className="search-bar">
        <Icon name="search" size={16} />
        <input
          placeholder="Tìm rạp phim..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")}>
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      {/* chain filter chips */}
      <div className="chain-filter-row">
        <button
          className={`chain-filter-chip${activeChain === ALL ? " active" : ""}`}
          onClick={() => setActiveChain(ALL)}
        >
          <span className="chain-filter-icon">🎬</span>
          Tất cả
        </button>
        {chains.map(c => (
          <button
            key={c.id}
            className={`chain-filter-chip${activeChain === c.id ? " active" : ""}`}
            onClick={() => setActiveChain(c.id)}
            style={activeChain === c.id ? { "--chip-color": c.color } : {}}
          >
            <span className="chain-filter-icon">{c.logo}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* location banner */}
      {showLocation && (
        <div className="location-banner">
          <div className="location-banner-text">
            <Icon name="location" size={18} color="var(--accent)" />
            Bạn ơi, cho phép K3-MindX xác định vị trí để tìm rạp gần bạn nhé!
          </div>
          <button className="location-close" onClick={() => setShowLocation(false)}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      {/* cinema list grouped by chain */}
      {filtered.length === 0 ? (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)" }}>
          Không tìm thấy rạp nào 🎭
        </div>
      ) : (
        filtered.map(chain => (
          <div key={chain.id} className="chain-group">
            <div className="chain-group-header">
              <span className="chain-group-name">
                {chain.logo} {chain.name} ({chain.cinemas.length})
              </span>
              {chain.promoText && (
                <span style={{
                  fontSize: 11, color: "var(--accent)", fontWeight: 700,
                  background: "rgba(232,67,58,0.1)", padding: "3px 8px",
                  borderRadius: "var(--radius-full)"
                }}>
                  {chain.promoText}
                </span>
              )}
            </div>

            {chain.cinemas.map(cinema => (
              <button
                key={cinema.id}
                className="cinema-item"
                onClick={() => onSelectChain(chain, cinema)}
              >
                <div className="cinema-item-logo">{chain.logo}</div>
                <div className="cinema-item-body">
                  <div className="cinema-item-name">{cinema.name}</div>
                  <div className="cinema-item-district">
                    {cinema.address.split(",").slice(-2).join(",").trim()}
                  </div>
                  <div className="cinema-item-address">{cinema.address}</div>
                </div>
                <div className="cinema-item-actions">
                  <span className="cinema-heart"><Icon name="heart" size={18} /></span>
                  <span className="cinema-directions">Tìm đường</span>
                </div>
              </button>
            ))}
          </div>
        ))
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

export default ChainsPage;
