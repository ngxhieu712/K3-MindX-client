import { useEffect, useState } from "react";
import { cinemaService } from "../services/cinemaService";
import { PAGE, REQUEST_STATUS } from "../constants/app";
import Icon from "../components/common/Icon";

const ALL = "all";

function ChainsPage({ onSelectChain, onNavigate }) {
  const [chains, setChains] = useState([]);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [activeChain, setActiveChain] = useState(ALL);
  const [search, setSearch] = useState("");
  const [showLocation, setShowLocation] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hn_favorites") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getChains().then(res => {
      if (alive) { setChains(res); setStatus(REQUEST_STATUS.SUCCESS); }
    });
    return () => { alive = false; };
  }, []);

  const toggleFav = (cinemaId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(cinemaId) ? prev.filter(id => id !== cinemaId) : [...prev, cinemaId];
      localStorage.setItem("hn_favorites", JSON.stringify(next));
      return next;
    });
  };

  const openMaps = (address, e) => {
    e.stopPropagation();
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, "_blank");
  };

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

  if (status === REQUEST_STATUS.LOADING && chains.length === 0) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải danh sách rạp...
        </div>
      </div>
    );
  }

  return (
    <div className="chains-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <span className="top-bar-title" style={{ marginRight: 0 }}>Chọn theo rạp</span>
        <button className="top-bar-icon-btn" onClick={() => onNavigate?.(PAGE.HOME)}>
          <Icon name="home" size={18} />
        </button>
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
                  <button
                    style={{ background:"none", border:"none", padding:4, cursor:"pointer" }}
                    onClick={e => toggleFav(cinema.id, e)}
                    title="Yêu thích"
                  >
                    <Icon
                      name="heart"
                      size={18}
                      color={favorites.includes(cinema.id) ? "var(--accent)" : "var(--text-muted)"}
                    />
                  </button>
                  <button
                    className="cinema-directions"
                    style={{ background:"none", border:"none", padding:4, cursor:"pointer", fontSize:11, fontWeight:700, color:"var(--accent)" }}
                    onClick={e => openMaps(cinema.address, e)}
                    title="Mở Google Maps"
                  >
                    Tìm đường
                  </button>
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
