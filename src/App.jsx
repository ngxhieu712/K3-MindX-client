import { useEffect, useState } from "react";
import "./index.css";
import { DEFAULTS, PAGE, REQUEST_STATUS } from "./constants/app";
import { cinemaService } from "./services/cinemaService";
import Header from "./components/layout/Header";
import LoadingState from "./components/common/LoadingState";
import BookingModal from "./components/booking/BookingModal";

import HomePage      from "./pages/HomePage";
import MoviesPage    from "./pages/MoviesPage";
import ChainsPage    from "./pages/ChainsPage";
import ChainDetailPage from "./pages/ChainDetailPage";
import CinemasPage   from "./pages/CinemasPage";
import ShowtimesPage from "./pages/ShowtimesPage";
import AuthPage      from "./pages/AuthPage";
import BookingPage   from "./pages/BookingPage";
import PaymentPage   from "./pages/PaymentPage";
import QrPaymentPage from "./pages/QrPaymentPage";
import ComboPage     from "./pages/ComboPage";
import ProfilePage   from "./pages/ProfilePage";

/* Pages that hide the bottom nav */
const PAGES_WITHOUT_NAV = [PAGE.BOOKING, PAGE.PAYMENT, PAGE.QR_PAYMENT, PAGE.AUTH];

function App() {
  const [catalog, setCatalog]           = useState(null);
  const [catalogStatus, setCatalogStatus] = useState(REQUEST_STATUS.IDLE);

  /* navigation state */
  const [page, setPage]                 = useState(DEFAULTS.PAGE);

  /* cinema / chain selection */
  const [cinema, setCinema]             = useState(DEFAULTS.CINEMA_NAME);
  const [selectedChain, setSelectedChain] = useState(null);

  /* booking flow state */
  const [activeMovie, setActiveMovie]   = useState(null);
  const [selectedTime, setSelectedTime] = useState(DEFAULTS.SHOWTIME);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isModalOpen, setModalOpen]     = useState(false);

  /* load catalog once */
  useEffect(() => {
    let alive = true;
    setCatalogStatus(REQUEST_STATUS.LOADING);
    cinemaService.getInitialCatalog().then(res => {
      if (alive) {
        setCatalog(res);
        setActiveMovie(res.movies[DEFAULTS.MOVIE_INDEX]);
        setCatalogStatus(REQUEST_STATUS.SUCCESS);
      }
    });
    return () => { alive = false; };
  }, []);

  /* ─── booking flow helpers ─── */
  const startBooking = (movie, showtime = DEFAULTS.SHOWTIME) => {
    setActiveMovie(movie);
    setSelectedTime(showtime);
    setModalOpen(true);
  };

  const confirmShowtime = (time) => {
    setSelectedTime(time);
    setModalOpen(false);
    setPage(PAGE.BOOKING);
  };

  const handleSelectChain = (chain, cinema) => {
    setSelectedChain(chain);
    if (cinema) {
      // direct from ChainsPage: chain + cinema already chosen
      setCinema(cinema.name);
      setPage(PAGE.CINEMA_DETAIL);
    } else {
      setPage(PAGE.CINEMA_DETAIL);
    }
  };

  const handleSelectCinema = (cinemaObj) => {
    setCinema(cinemaObj.name);
    setPage(PAGE.SHOWTIMES);
  };

  /* ─── loading screen ─── */
  if (catalogStatus === REQUEST_STATUS.LOADING || !catalog || !activeMovie) {
    return (
      <div className="app-shell">
        <LoadingState label="Đang tải K3-MindX Cinema..." />
      </div>
    );
  }

  /* ─── page renderer ─── */
  const renderPage = () => {
    switch (page) {
      case PAGE.HOME:
        return (
          <HomePage
            movies={catalog.movies}
            onBuy={startBooking}
            onNavigate={setPage}
          />
        );

      case PAGE.MOVIES:
        return (
          <MoviesPage
            movies={catalog.movies}
            onBuy={startBooking}
            onNavigate={setPage}
          />
        );

      case PAGE.CHAINS:
        return (
          <ChainsPage
            onSelectChain={handleSelectChain}
          />
        );

      case PAGE.CINEMA_DETAIL:
        return selectedChain ? (
          <ChainDetailPage
            chain={selectedChain}
            onSelectCinema={handleSelectCinema}
            onBack={() => setPage(PAGE.CHAINS)}
          />
        ) : null;

      case PAGE.CINEMAS:
        return (
          <CinemasPage
            cinema={cinema}
            onNavigate={setPage}
          />
        );

      case PAGE.SHOWTIMES:
        return (
          <ShowtimesPage
            cinema={cinema}
            dates={catalog.dates}
            onBuy={startBooking}
            onBack={() => setPage(PAGE.CHAINS)}
          />
        );

      case PAGE.AUTH:
        return <AuthPage onBack={() => setPage(PAGE.HOME)} />;

      case PAGE.BOOKING:
        return (
          <BookingPage
            movie={activeMovie}
            selectedTime={selectedTime}
            onNext={(seats) => { setSelectedSeats(seats); setPage(PAGE.PAYMENT); }}
            onBack={() => setPage(PAGE.SHOWTIMES)}
          />
        );

      case PAGE.PAYMENT:
        return (
          <PaymentPage
            movie={activeMovie}
            selectedTime={selectedTime}
            selectedSeats={selectedSeats}
            onBack={() => setPage(PAGE.BOOKING)}
            onPay={(amount) => { setPaymentAmount(amount); setPage(PAGE.QR_PAYMENT); }}
          />
        );

      case PAGE.QR_PAYMENT:
        return (
          <QrPaymentPage
            amountThousand={paymentAmount}
            onCancel={() => setPage(PAGE.HOME)}
          />
        );

      case PAGE.COMBO:
        return <ComboPage />;

      case PAGE.PROFILE:
        return <ProfilePage onNavigate={setPage} />;

      default:
        return (
          <HomePage
            movies={catalog.movies}
            onBuy={startBooking}
            onNavigate={setPage}
          />
        );
    }
  };

  const showNav = !PAGES_WITHOUT_NAV.includes(page);

  return (
    <div className="app-shell">
      {renderPage()}

      {showNav && (
        <Header page={page} onNavigate={setPage} />
      )}

      {isModalOpen && activeMovie && (
        <BookingModal
          movie={activeMovie}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmShowtime}
        />
      )}
    </div>
  );
}

export default App;
