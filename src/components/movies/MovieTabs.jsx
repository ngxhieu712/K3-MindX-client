import { MOVIE_TAB, UI_TEXT } from "../../constants/app";

function MovieTabs({ activeTab, onChange }) {
  return <div className="movie-tabs">{Object.values(MOVIE_TAB).map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => onChange(tab)}>{UI_TEXT.MOVIE_TAB_LABELS[tab]}</button>)}</div>;
}

export default MovieTabs;
