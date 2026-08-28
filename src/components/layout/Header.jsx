import { useState } from "react";
import { PAGE } from "../../constants/app";
import Logo from "../common/Logo";

const NAV = [
  [PAGE.HOME, "TRANG CHỦ"],
  [PAGE.CHAINS, "ĐẶT VÉ"],
  [PAGE.MOVIES, "PHIM"],
  [PAGE.SHOWTIMES, "LỊCH CHIẾU"],
  [PAGE.CINEMAS, "RẠP"],
  ["prices", "GIÁ VÉ"],
];

function Header({ page, onNavigate, cinema, cinemas, onCinemaChange }) {
  const [isCinemaMenuOpen, setCinemaMenuOpen] = useState(false);

  const handleCinemaSelect = (cinemaName) => {
    setCinemaMenuOpen(false);
    onCinemaChange(cinemaName);
    onNavigate(PAGE.SHOWTIMES);
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>🎬 Đặt vé tại CGV, Beta, Galaxy, Lotte và nhiều hơn nữa</span>
          <div>
            <button onClick={() => onNavigate(PAGE.AUTH)}>Đăng nhập</button>
            <span className="divider">|</span>
            <button onClick={() => onNavigate(PAGE.AUTH)}>Đăng ký</button>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button className="brand-button" onClick={() => onNavigate(PAGE.HOME)}>
            <Logo />
          </button>

          <div className="cinema-picker-wrap">
            <button
              className="cinema-picker"
              onClick={() => setCinemaMenuOpen((o) => !o)}
            >
              {cinema} <span>⌄</span>
            </button>
            {isCinemaMenuOpen && (
              <div className="cinema-menu">
                <div className="menu-col">
                  <strong>Hà Nội</strong>
                  {["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"].map((city) => (
                    <button key={city}>{city} <span>›</span></button>
                  ))}
                </div>
                <div className="menu-col light">
                  {cinemas.map((cinemaName) => (
                    <button key={cinemaName} onClick={() => handleCinemaSelect(cinemaName)}>
                      {cinemaName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <nav className="main-nav">
            {NAV.map(([pageKey, label]) => (
              <button
                key={pageKey}
                className={page === pageKey ? "active" : ""}
                onClick={() => onNavigate(pageKey)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
