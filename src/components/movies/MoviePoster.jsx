function MoviePoster({ movie, compact = false }) {
  return <div className={`poster-wrap ${compact ? "compact" : ""}`}><img src={movie.poster} alt={movie.title} /><span className={`age-badge age-${movie.age}`}>{movie.age}</span>{movie.hot && <span className="hot-ribbon">HOT</span>}</div>;
}

export default MoviePoster;
