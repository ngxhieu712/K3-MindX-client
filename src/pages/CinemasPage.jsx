import { useEffect, useState } from "react";
import { PAGE, REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import LoadingState from "../components/common/LoadingState";
import MoviePoster from "../components/movies/MoviePoster";

function CinemasPage({ cinema, onNavigate }) {
  const [cinemaData, setCinemaData] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let isCurrentRequest = true;
    const loadCinemaDetails = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getCinemaDetails(cinema);
      if (isCurrentRequest) {
        setCinemaData(response);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
      }
    };
    loadCinemaDetails();
    return () => { isCurrentRequest = false; };
  }, [cinema]);

  if (requestStatus === REQUEST_STATUS.LOADING || !cinemaData) return <main className="page cinema-page"><LoadingState /></main>;

  return <main className="page cinema-page"><div className="cinema-intro"><p className="eyebrow">BETA CINEMAS</p><h1>{cinemaData.name}, TP Hà Nội</h1><div className="cinema-image" style={{ backgroundImage: `url(${cinemaData.image})` }}><div className="image-label">Không gian rạp hiện đại<br /><strong>Trải nghiệm điện ảnh khác biệt</strong></div></div>{cinemaData.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<button className="primary-button" onClick={() => onNavigate(PAGE.SHOWTIMES)}>XEM LỊCH CHIẾU</button></div><div className="hot-side"><h1>PHIM ĐANG HOT</h1><div className="side-movie-grid">{cinemaData.hotMovies.map((movie) => <div key={movie.id}><MoviePoster movie={movie} compact /><h3>{movie.title}</h3></div>)}</div></div></main>;
}

export default CinemasPage;
