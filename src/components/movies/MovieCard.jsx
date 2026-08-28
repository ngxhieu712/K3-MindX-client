import { useState } from "react";
import Icon from "../common/Icon";
import MoviePoster from "./MoviePoster";
import ReviewStars from "./ReviewStars";

function MovieCard({ movie, onBuy, movieReviews = [] }) {
  const [showReviews, setShowReviews] = useState(false);

  const avgRating = movieReviews.length
    ? Math.round(movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length)
    : 0;

  return (
    <article className="movie-card">
      <MoviePoster movie={movie} />
      <h3>{movie.title}</h3>
      <p><b>Thể loại:</b> {movie.genre}</p>
      <p><b>Thời lượng:</b> {movie.length} phút</p>

      {movieReviews.length > 0 && (
        <div className="movie-card-review">
          <button
            className="review-toggle"
            onClick={() => setShowReviews((v) => !v)}
          >
            <ReviewStars rating={avgRating} />
            <span className="review-count">({movieReviews.length} đánh giá)</span>
            <span className="review-chevron">{showReviews ? "▲" : "▼"}</span>
          </button>

          {showReviews && (
            <div className="review-list">
              {movieReviews.slice(0, 2).map((r, i) => (
                <div className="review-item" key={i}>
                  <div className="review-top">
                    <span className="review-user">{r.user}</span>
                    <ReviewStars rating={r.rating} />
                  </div>
                  <p className="review-comment">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button className="ticket-button" onClick={() => onBuy(movie)}>
        <Icon>✦</Icon> MUA VÉ
      </button>
    </article>
  );
}

export default MovieCard;
