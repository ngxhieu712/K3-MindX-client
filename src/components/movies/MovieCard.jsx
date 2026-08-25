import Icon from "../common/Icon";
import MoviePoster from "./MoviePoster";

function MovieCard({ movie, onBuy }) {
  return <article className="movie-card"><MoviePoster movie={movie} /><h3>{movie.title}</h3><p><b>Thể loại:</b> {movie.genre}</p><p><b>Thời lượng:</b> {movie.length} phút</p><button className="ticket-button" onClick={() => onBuy(movie)}><Icon>✦</Icon> MUA VÉ</button></article>;
}

export default MovieCard;
