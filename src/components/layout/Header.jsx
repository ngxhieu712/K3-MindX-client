import { useState } from "react";
import { PAGE, UI_TEXT } from "../../constants/app";
import Logo from "../common/Logo";

function Header({ page, onNavigate, cinema, cinemas, onCinemaChange }) {
  const [isCinemaMenuOpen, setCinemaMenuOpen] = useState(false);

  const handleCinemaSelect = (cinemaName) => {
    setCinemaMenuOpen(false);
    onCinemaChange(cinemaName);
    onNavigate(PAGE.SHOWTIMES);
  };

  return (
    <>
      <div className="topbar"><div className="topbar-inner"><span>{UI_TEXT.APP_PROMOTION}</span><div><button onClick={() => onNavigate(PAGE.AUTH)}>Đăng nhập</button><span className="divider">|</span><button onClick={() => onNavigate(PAGE.AUTH)}>Đăng ký</button><span className="flag">🇬🇧</span></div></div></div>
      <header className="site-header"><div className="header-inner">
        <button className="brand-button" onClick={() => onNavigate(PAGE.MOVIES)}><Logo /></button>
        <div className="cinema-picker-wrap">
          <button className="cinema-picker" onClick={() => setCinemaMenuOpen((isOpen) => !isOpen)}>{cinema}<span>⌄</span></button>
          {isCinemaMenuOpen && <div className="cinema-menu"><div className="menu-col"><strong>Hà Nội</strong>{UI_TEXT.CITIES.map((city) => <button key={city}>{city}<span>›</span></button>)}</div><div className="menu-col light">{cinemas.map((cinemaName) => <button key={cinemaName} onClick={() => handleCinemaSelect(cinemaName)}>{cinemaName}</button>)}</div></div>}
        </div>
        <nav className="main-nav">{UI_TEXT.NAVIGATION.map(([pageKey, label]) => <button key={pageKey} className={page === pageKey ? "active" : ""} onClick={() => onNavigate(pageKey)}>{label}</button>)}</nav>
      </div></header>
    </>
  );
}

export default Header;
