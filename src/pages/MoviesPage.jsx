import { useMemo, useState } from "react";
import { DEFAULTS, MOVIE_TAB } from "../constants/app";
import MovieCard from "../components/movies/MovieCard";
import MovieTabs from "../components/movies/MovieTabs";

function MoviesPage({ movies, onBuy }) {
  const [activeTab, setActiveTab] = useState(MOVIE_TAB.NOW);
  const visibleMovies = useMemo(() => {
    if (activeTab === MOVIE_TAB.SOON)
      return movies.slice(DEFAULTS.UPCOMING_MOVIE_START_INDEX);
    if (activeTab === MOVIE_TAB.SPECIAL)
      return movies.slice(
        DEFAULTS.SPECIAL_MOVIE_START_INDEX,
        DEFAULTS.SPECIAL_MOVIE_END_INDEX,
      );
    return movies;
  }, [activeTab, movies]);

  return (
    <main className="page movie-page">
      <MovieTabs activeTab={activeTab} onChange={setActiveTab} />
      <div className="movie-grid">
        {visibleMovies.map((movie) => (
          <MovieCard movie={movie} onBuy={onBuy} key={movie.id} />
        ))}
      </div>
    </main>
  );
}

export default MoviesPage;
