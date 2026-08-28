import { useMemo, useState } from "react";
import { DEFAULTS, MOVIE_TAB } from "../constants/app";
import Banner from "../components/common/Banner";
import MovieCard from "../components/movies/MovieCard";
import MovieTabs from "../components/movies/MovieTabs";
import { banners, reviews } from "../data/mockData";

function HomePage({ movies, onBuy, onGoToChains }) {
  const [activeTab, setActiveTab] = useState(MOVIE_TAB.NOW);

  const visibleMovies = useMemo(() => {
    if (activeTab === MOVIE_TAB.SOON)
      return movies.slice(DEFAULTS.UPCOMING_MOVIE_START_INDEX);
    if (activeTab === MOVIE_TAB.SPECIAL)
      return movies.slice(DEFAULTS.SPECIAL_MOVIE_START_INDEX, DEFAULTS.SPECIAL_MOVIE_END_INDEX);
    return movies;
  }, [activeTab, movies]);

  return (
    <main className="home-page page">
      <Banner banners={banners} onCtaClick={onGoToChains} />

      {/* Quick chain access */}
      <section className="quick-chains">
        <h2 className="section-heading">Chọn theo hãng rạp</h2>
        <div className="quick-chain-list">
          {[
            { id: "cgv", name: "CGV", logo: "🎬", color: "#e60012" },
            { id: "beta", name: "Beta", logo: "🎥", color: "#005b9f" },
            { id: "galaxy", name: "Galaxy", logo: "⭐", color: "#6c3fa0" },
            { id: "lotte", name: "Lotte", logo: "🍀", color: "#e8001c" },
            { id: "cinestar", name: "Cinestar", logo: "💫", color: "#ff6b00" },
          ].map((c) => (
            <button
              key={c.id}
              className="quick-chain-btn"
              style={{ "--chain-color": c.color }}
              onClick={onGoToChains}
            >
              <span className="quick-chain-logo">{c.logo}</span>
              <span className="quick-chain-name">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Movie listing */}
      <section className="movie-section">
        <MovieTabs activeTab={activeTab} onChange={setActiveTab} />
        <div className="movie-grid">
          {visibleMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onBuy={onBuy}
              movieReviews={reviews[movie.id] || []}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
