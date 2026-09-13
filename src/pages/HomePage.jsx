import { useEffect, useState } from "react";
import { PAGE } from "../constants/app";
import { reviews } from "../data/mockData";
import Icon from "../components/common/Icon";

function AgeBadge({ age }) {
  return <span className={`age-badge ${age==="P"?"P":age==="T16"?"T16":""}`}>{age}</span>;
}

/* ── Featured carousel ── */
function FeaturedCarousel({ hotMovies, onBuy }) {
  const [active, setActive] = useState(0);
  const items = hotMovies.slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="featured-section">
      <div className="section-row">
        <span className="section-title">🔥 Phim nổi bật</span>
      </div>
      <div className="featured-main" onClick={() => onBuy(items[active])}>
        <img src={items[active]?.poster} alt={items[active]?.title} className="featured-main-img" />
        <span className={`age-badge ${items[active]?.age==="P"?"P":items[active]?.age==="T16"?"T16":""}`}>
          {items[active]?.age}
        </span>
        <div className="featured-main-overlay">
          <div className="featured-rating">
            ★ {reviews[items[active]?.id]
              ? (reviews[items[active].id].reduce((s,r)=>s+r.rating,0)/reviews[items[active].id].length).toFixed(1)
              : "8.5"}/10
          </div>
          <div className="featured-main-title">{items[active]?.title}</div>
          <div className="featured-genre">{items[active]?.genre}</div>
        </div>
        <div className="featured-main-rank">{active + 1}</div>
      </div>
      <div className="carousel-dots" style={{ marginTop:10 }}>
        {items.map((_, i) => (
          <button key={i} className={`carousel-dot${i===active?" active":""}`} onClick={() => setActive(i)} />
        ))}
      </div>
      <div className="featured-thumbs">
        {items.map((movie, i) => (
          <button key={movie.id} className={`featured-thumb${i===active?" active":""}`} onClick={() => setActive(i)}>
            <img src={movie.poster} alt={movie.title} />
            <span className="featured-thumb-num">{i + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ── Horizontal movie row ── */
function MovieRow({ title, movies: list, onBuy, onSeeAll }) {
  return (
    <section style={{ marginBottom:24 }}>
      <div className="section-row">
        <span className="section-title">{title}</span>
        <button className="section-more" onClick={onSeeAll}>
          Xem tất cả <Icon name="chevronRight" size={14} />
        </button>
      </div>
      <div className="movies-row">
        {list.slice(0, 6).map(movie => {
          const avg = reviews[movie.id]
            ? (reviews[movie.id].reduce((s,r)=>s+r.rating,0)/reviews[movie.id].length).toFixed(1)
            : null;
          return (
            <div key={movie.id} className="movie-row-card" onClick={() => onBuy(movie)}>
              <div className="movie-row-poster">
                <img src={movie.poster} alt={movie.title} loading="lazy" />
                <AgeBadge age={movie.age} />
                {movie.hot && <span className="hot-badge">HOT</span>}
              </div>
              <div className="movie-row-title">{movie.title}</div>
              <div className="movie-row-sub">{movie.genre.split(",")[0]}</div>
              {avg && <div className="movie-row-rating">★ {avg}/10</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Promo banner (dữ liệu thật từ GET /api/customer/banners) ── */
function PromoBanner({ banners }) {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    setCur(0);
  }, [banners]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCur(p => (p+1)%banners.length), 4000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return null;
  const slide = banners[cur];

  return (
    <div className="home-banner" style={{ marginBottom:8 }}>
      <div className="home-banner-slide" style={{ backgroundImage:`url(${slide.image})` }}>
        <div className="home-banner-overlay" />
        <div className="home-banner-content">
          {slide.badge && <span className="home-banner-badge">{slide.badge}</span>}
          <div className="home-banner-title">{slide.title}</div>
          {slide.subtitle && <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:4 }}>{slide.subtitle}</div>}
        </div>
      </div>
      {banners.length > 1 && (
        <div className="home-banner-dots">
          {banners.map((_, i) => (
            <button key={i} className={`home-banner-dot${i===cur?" active":""}`} onClick={() => setCur(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Promo strip ── */
function PromoStrip({ onNavigate }) {
  return (
    <button className="promo-strip" onClick={() => onNavigate(PAGE.COMBO)} style={{ width:"calc(100% - 32px)", textAlign:"left" }}>
      <div className="promo-strip-text">
        <b>Mở vũ trụ ưu đãi 🎉</b>
        Sở hữu combo phim độc quyền tại H&N Cinema
      </div>
      <span className="promo-strip-btn">Vào ngay</span>
    </button>
  );
}

/* ── Promo cards ── */
function PromoCards({ onNavigate }) {
  const items = [
    { amount:"50K", unit:"/vé 2D", title:"Beta: Thứ 2 Vui Vẻ",  sub:"Thứ 2 hàng tuần" },
    { amount:"65K", unit:"/vé 2D", title:"CGV: Happy Friday",    sub:"Thứ 6 hàng tuần" },
    { amount:"30%", unit:"giảm",   title:"Galaxy: Thứ 4 Giảm",  sub:"Tất cả suất chiếu" },
  ];
  return (
    <section style={{ marginBottom:24 }}>
      <div className="section-row">
        <span className="section-title">💰 Ưu đãi dành cho bạn</span>
        <button className="section-more" onClick={() => onNavigate(PAGE.CHAINS)}>Xem tất cả ›</button>
      </div>
      <div className="promos-row">
        {items.map((p, i) => (
          <button key={i} className="promo-card" onClick={() => onNavigate(PAGE.CHAINS)} style={{ textAlign:"left" }}>
            <div className="promo-badge">
              <span className="promo-badge-amount">{p.amount}</span>
              <span className="promo-badge-unit">{p.unit}</span>
            </div>
            <div className="promo-card-text">
              <div className="promo-card-title">{p.title}</div>
              <div className="promo-card-sub">{p.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ── Main ── */
function HomePage({ movies: allMovies, banners = [], onBuy, onNavigate, user }) {
  const [search, setSearch] = useState("");

  const hotMovies  = allMovies.filter(m => m.hot);
  const nowPlaying = allMovies.filter(m => m.showingStatus !== "coming_soon");
  const comingSoon = allMovies.filter(m => m.showingStatus === "coming_soon");

  const searchResults = search.trim()
    ? allMovies.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.genre.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div className="home-page page-scroll">
      {/* top bar */}
      <div className="home-top-bar">
        <div className="home-logo">
          <span>H&N</span>
          <span style={{ background:"none", WebkitTextFillColor:"var(--text-sub)", fontSize:14, fontWeight:500 }}>
            &nbsp;Cinema
          </span>
        </div>
        <div className="home-top-actions">
          <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.PROFILE)}>
            <Icon name="bell" size={20} />
          </button>
          <button className="top-bar-icon-btn" onClick={() => onNavigate(user ? PAGE.PROFILE : PAGE.AUTH)}>
            <Icon name="user" size={20} />
          </button>
        </div>
      </div>

      {/* search */}
      <div className="search-bar">
        <Icon name="search" size={16} />
        <input
          placeholder="Tìm tên phim hoặc rạp..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ color:"var(--text-muted)" }}>
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {/* Kết quả tìm kiếm */}
      {searchResults ? (
        <div style={{ padding:"4px 16px" }}>
          <div style={{ fontSize:13, color:"var(--text-sub)", marginBottom:12, fontWeight:600 }}>
            {searchResults.length > 0 ? `Tìm thấy ${searchResults.length} phim` : "Không tìm thấy phim nào"}
          </div>
          <div className="movies-grid">
            {searchResults.map(movie => {
              const avg = reviews[movie.id]
                ? (reviews[movie.id].reduce((s,r)=>s+r.rating,0)/reviews[movie.id].length).toFixed(1)
                : null;
              return (
                <div key={movie.id} className="movie-grid-card">
                  <div className="movie-grid-poster" onClick={() => onBuy(movie)}>
                    <img src={movie.poster} alt={movie.title} loading="lazy" />
                    <AgeBadge age={movie.age} />
                    {movie.hot && <span className="hot-badge">HOT</span>}
                  </div>
                  {avg && <div className="movie-grid-rating">★ {avg}/10</div>}
                  <div className="movie-grid-title">{movie.title}</div>
                  <div className="movie-grid-sub">{movie.genre.split(",")[0]}</div>
                  <button className="movie-buy-btn" onClick={() => onBuy(movie)}>Mua vé</button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <FeaturedCarousel hotMovies={hotMovies} onBuy={onBuy} />
          <MovieRow title="🎬 Phim hay đang chiếu" movies={nowPlaying} onBuy={onBuy} onSeeAll={() => onNavigate(PAGE.MOVIES)} />
          <PromoBanner banners={banners} />
          <PromoStrip onNavigate={onNavigate} />
          <PromoCards onNavigate={onNavigate} />
          <MovieRow title="🗓 Phim sắp chiếu" movies={comingSoon} onBuy={onBuy} onSeeAll={() => onNavigate(PAGE.MOVIES)} />
          <div style={{ height:16 }} />
        </>
      )}
    </div>
  );
}

export default HomePage;
