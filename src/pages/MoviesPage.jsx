import { useMemo, useState } from "react";
import { MOVIE_TAB, PAGE } from "../constants/app";
import { reviews } from "../data/mockData";
import Icon from "../components/common/Icon";

function AgeBadge({ age }) {
  return <span className={`age-badge ${age === "P" ? "P" : age === "T16" ? "T16" : ""}`}>{age}</span>;
}

function MoviesPage({ movies, onBuy, onNavigate }) {
  const [activeTab, setActiveTab] = useState(MOVIE_TAB.NOW);
  const [search, setSearch] = useState("");

  const tabs = [
    { key: MOVIE_TAB.NOW,     label: "Đang chiếu" },
    { key: MOVIE_TAB.SOON,    label: "Sắp chiếu" },
    { key: MOVIE_TAB.SPECIAL, label: "Đặc biệt" },
  ];

  const byTab = useMemo(() => {
    if (activeTab === MOVIE_TAB.SOON)
      return movies.filter(m => m.showingStatus === "coming_soon");
    if (activeTab === MOVIE_TAB.SPECIAL)
      return movies.filter(m => m.hot); // phim nổi bật — dùng lại cờ "hot" thật, không còn slice cứng theo index
    return movies.filter(m => m.showingStatus !== "coming_soon");
  }, [activeTab, movies]);

  const visible = useMemo(() => {
    if (!search.trim()) return byTab;
    const q = search.toLowerCase();
    return byTab.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q)
    );
  }, [byTab, search]);

  return (
    <div className="movies-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.HOME)}>
          <Icon name="back" size={20} />
        </button>
        <span className="top-bar-title">Tất cả phim</span>
      </div>

      {/* search */}
      <div className="search-bar">
        <Icon name="search" size={16} />
        <input
          placeholder="Tìm tên phim, thể loại..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ color:"var(--text-muted)" }}>
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {/* tabs */}
      <div className="movies-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`movies-tab-btn${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="movies-grid">
        {visible.length === 0 ? (
          <div style={{ gridColumn:"1/-1", padding:"40px 0", textAlign:"center", color:"var(--text-muted)" }}>
            Không tìm thấy phim nào
          </div>
        ) : visible.map(movie => {
          const avg = reviews[movie.id]
            ? (reviews[movie.id].reduce((s, r) => s + r.rating, 0) / reviews[movie.id].length).toFixed(1)
            : null;
          return (
            <div key={movie.id} className="movie-grid-card">
              <div className="movie-grid-poster" onClick={() => onBuy(movie)}>
                <img src={movie.poster} alt={movie.title} loading="lazy" />
                <AgeBadge age={movie.age} />
                {movie.hot && <span className="hot-badge">HOT</span>}
              </div>
              {avg && (
                <div className="movie-grid-rating">★ {avg}/10</div>
              )}
              <div className="movie-grid-title">{movie.title}</div>
              <div className="movie-grid-sub">{movie.genre.split(",")[0]}{movie.length ? `, ${movie.length} phút` : ""}</div>
              <button className="movie-buy-btn" onClick={() => onBuy(movie)}>Mua vé</button>
            </div>
          );
        })}
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
}

export default MoviesPage;
