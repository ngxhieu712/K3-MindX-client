import { useEffect, useState } from "react";
import { DEFAULTS, MOVIE_TAB, PAGE } from "../constants/app";
import { banners, movies, reviews, vouchers } from "../data/mockData";
import Icon from "../components/common/Icon";

/* ─── helpers ─── */
function AgeBadge({ age }) {
  return <span className={`age-badge ${age === "P" ? "P" : age === "T16" ? "T16" : ""}`}>{age}</span>;
}

function StarRating({ value }) {
  return (
    <span className="review-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i <= value ? " filled" : ""}`}>★</span>
      ))}
    </span>
  );
}

/* ─── Featured carousel (top 4 hot movies) ─── */
function FeaturedCarousel({ hotMovies, onBuy }) {
  const [active, setActive] = useState(0);

  // Chỉ lấy tối đa 4 phim nổi bật
  const items = hotMovies.slice(0, 4);

  return (
    <section className="featured-section">
      <div className="section-row">
        <span className="section-title">🔥 Phim nổi bật</span>
      </div>

      {/* Hiển thị featured item chính ở giữa + 2 bên */}
      <div className="featured-main" onClick={() => onBuy(items[active])}>
        <img src={items[active]?.poster} alt={items[active]?.title} className="featured-main-img" />
        <span className={`age-badge ${items[active]?.age === "P" ? "P" : items[active]?.age === "T16" ? "T16" : ""}`}>
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

      {/* Dot navigation */}
      <div className="carousel-dots" style={{ marginTop: 10 }}>
        {items.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="featured-thumbs">
        {items.map((movie, i) => (
          <button
            key={movie.id}
            className={`featured-thumb${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            <img src={movie.poster} alt={movie.title} />
            <span className="featured-thumb-num">{i + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─── Horizontal movie row ─── */
function MovieRow({ title, movies: list, onBuy, onSeeAll }) {
  // Chỉ hiển thị tối đa 6 phim trong row
  const items = list.slice(0, 6);
  return (
    <section style={{ marginBottom: 24 }}>
      <div className="section-row">
        <span className="section-title">{title}</span>
        <button className="section-more" onClick={onSeeAll}>
          Xem tất cả <Icon name="chevronRight" size={14} />
        </button>
      </div>
      <div className="movies-row">
        {items.map((movie) => {
          const avg = reviews[movie.id]
            ? (reviews[movie.id].reduce((s, r) => s + r.rating, 0) / reviews[movie.id].length).toFixed(1)
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
              {avg && (
                <div className="movie-row-rating">★ {avg}/10</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Promo banner (auto-slide) ─── */
function PromoBanner() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(p => (p + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);
  const slide = banners[cur];
  return (
    <div className="home-banner" style={{ marginBottom: 8 }}>
      <div
        className="home-banner-slide"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="home-banner-overlay" />
        <div className="home-banner-content">
          <span className="home-banner-badge">{slide.badge}</span>
          <div className="home-banner-title">{slide.title}</div>
        </div>
      </div>
      <div className="home-banner-dots">
        {banners.map((_, i) => (
          <div key={i} className={`home-banner-dot${i === cur ? " active" : ""}`} />
        ))}
      </div>
    </div>
  );
}

/* ─── Promo / voucher strip ─── */
function PromoStrip() {
  return (
    <div className="promo-strip">
      <div className="promo-strip-text">
        <b>Mở vũ trụ ưu đãi 🎉</b>
        Sở hữu item phim độc quyền tại K3-MindX
      </div>
      <span className="promo-strip-btn">Vào ngay</span>
    </div>
  );
}

/* ─── Promotion cards ─── */
function PromoCards() {
  const items = [
    { amount: "50K", unit: "/vé 2D", title: "Beta: Thứ 2 Vui Vẻ", sub: "Thứ 2 hàng tuần" },
    { amount: "65K", unit: "/vé 2D", title: "CGV: Happy Friday", sub: "Thứ 6 hàng tuần" },
    { amount: "30%", unit: "giảm", title: "Galaxy: Thứ 4 Giảm Sốc", sub: "Tất cả suất chiếu" },
  ];
  return (
    <section style={{ marginBottom: 24 }}>
      <div className="section-row">
        <span className="section-title">💰 Ưu đãi dành cho bạn</span>
        <button className="section-more">Xem tất cả ›</button>
      </div>
      <div className="promos-row">
        {items.map((p, i) => (
          <div key={i} className="promo-card">
            <div className="promo-badge">
              <span className="promo-badge-amount">{p.amount}</span>
              <span className="promo-badge-unit">{p.unit}</span>
            </div>
            <div className="promo-card-text">
              <div className="promo-card-title">{p.title}</div>
              <div className="promo-card-sub">{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main ─── */
function HomePage({ movies: allMovies, onBuy, onNavigate }) {
  const hotMovies = allMovies.filter(m => m.hot);
  const nowPlaying = allMovies.slice(0, 6);
  const comingSoon = allMovies.slice(DEFAULTS.UPCOMING_MOVIE_START_INDEX);

  return (
    <div className="home-page page-scroll">
      {/* top bar */}
      <div className="home-top-bar">
        <div className="home-logo">
          <span>K3</span>
          <span style={{ background: "none", WebkitTextFillColor: "var(--text-sub)", fontSize: 14, fontWeight: 500 }}>
            &nbsp;Cinema
          </span>
        </div>
        <div className="home-top-actions">
          <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.AUTH)}>
            <Icon name="bell" size={20} />
          </button>
          <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.AUTH)}>
            <Icon name="user" size={20} />
          </button>
        </div>
      </div>

      {/* search */}
      <div className="search-bar">
        <Icon name="search" size={16} />
        <input placeholder="Tìm tên phim hoặc rạp..." readOnly />
      </div>

      {/* featured */}
      <FeaturedCarousel hotMovies={hotMovies} onBuy={onBuy} />

      {/* now playing */}
      <MovieRow
        title="🎬 Phim hay đang chiếu"
        movies={nowPlaying}
        onBuy={onBuy}
        onSeeAll={() => onNavigate(PAGE.MOVIES)}
      />

      {/* promo banner */}
      <PromoBanner />

      {/* promo strip */}
      <PromoStrip />

      {/* promo cards */}
      <PromoCards />

      {/* coming soon */}
      <MovieRow
        title="🗓 Phim sắp chiếu"
        movies={comingSoon}
        onBuy={onBuy}
        onSeeAll={() => onNavigate(PAGE.MOVIES)}
      />

      <div style={{ height: 16 }} />
    </div>
  );
}

export default HomePage;
