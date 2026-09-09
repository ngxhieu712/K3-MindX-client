import { useEffect, useState } from "react";
import "./index.css";
import { DEFAULTS, PAGE, REQUEST_STATUS } from "./constants/app";
import { cinemaService } from "./services/cinemaService";
import { loadWallet, saveWallet } from "./data/mockData";
import Header from "./components/layout/Header";
import LoadingState from "./components/common/LoadingState";
import BookingModal from "./components/booking/BookingModal";

import HomePage          from "./pages/HomePage";
import MoviesPage        from "./pages/MoviesPage";
import ChainsPage        from "./pages/ChainsPage";
import ChainDetailPage   from "./pages/ChainDetailPage";
import CinemasPage       from "./pages/CinemasPage";
import ShowtimesPage     from "./pages/ShowtimesPage";
import AuthPage          from "./pages/AuthPage";
import BookingPage       from "./pages/BookingPage";
import PaymentPage       from "./pages/PaymentPage";
import QrPaymentPage     from "./pages/QrPaymentPage";
import ComboPage         from "./pages/ComboPage";
import ProfilePage       from "./pages/ProfilePage";
import WalletPage        from "./pages/WalletPage";
import TicketHistoryPage from "./pages/TicketHistoryPage";

const AUTH_STORAGE_KEY = "hn_user";

const PAGES_WITHOUT_NAV = [
  PAGE.BOOKING, PAGE.PAYMENT, PAGE.QR_PAYMENT, PAGE.AUTH,
  PAGE.WALLET, PAGE.TICKET_HISTORY, PAGE.TICKET_DETAIL,
];

function App() {
  const [catalog, setCatalog]             = useState(null);
  const [catalogStatus, setCatalogStatus] = useState(REQUEST_STATUS.IDLE);
  const [page, setPage]                   = useState(DEFAULTS.PAGE);
  const [cinema, setCinema]               = useState(DEFAULTS.CINEMA_NAME);
  const [selectedChain, setSelectedChain] = useState(null);
  const [user, setUser]                   = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)); } catch { return null; }
  });

  /* booking flow */
  const [activeMovie, setActiveMovie]     = useState(null);
  const [selectedTime, setSelectedTime]   = useState(DEFAULTS.SHOWTIME);
  const [selectedDate, setSelectedDate]   = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [payMethod, setPayMethod]         = useState("bank");
  const [isModalOpen, setModalOpen]       = useState(false);

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

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setPage(PAGE.HOME);
  };

  const startBooking = (movie, showtime = DEFAULTS.SHOWTIME) => {
    setActiveMovie(movie);
    setSelectedTime(showtime);
    setModalOpen(true);
  };

  const confirmShowtime = (time, date) => {
    setSelectedTime(time);
    if (date) setSelectedDate(date);
    setModalOpen(false);
    setPage(PAGE.BOOKING);
  };

  const handleSelectChain = (chain, cinema) => {
    setSelectedChain(chain);
    if (cinema) setCinema(cinema.name);
    setPage(PAGE.CINEMA_DETAIL);
  };

  const handleSelectCinema = (cinemaObj) => {
    setCinema(cinemaObj.name);
    setPage(PAGE.SHOWTIMES);
  };

  const handlePay = (amount, method, seats, movie) => {
    setPaymentAmount(Math.round(amount / 1000));
    setPayMethod(method);
    setSelectedSeats(seats);
    setPage(PAGE.QR_PAYMENT);
  };

  if (catalogStatus === REQUEST_STATUS.LOADING || !catalog || !activeMovie) {
    return (
      <div className="app-shell">
        <LoadingState label="Đang tải H&N Cinema..." />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case PAGE.HOME:
        return <HomePage movies={catalog.movies} onBuy={startBooking} onNavigate={setPage} user={user} />;

      case PAGE.MOVIES:
        return <MoviesPage movies={catalog.movies} onBuy={startBooking} onNavigate={setPage} />;

      case PAGE.CHAINS:
        return <ChainsPage onSelectChain={handleSelectChain} onNavigate={setPage} />;

      case PAGE.CINEMA_DETAIL:
        return selectedChain ? (
          <ChainDetailPage
            chain={selectedChain}
            onSelectCinema={handleSelectCinema}
            onBack={() => setPage(PAGE.CHAINS)}
          />
        ) : null;

      case PAGE.CINEMAS:
        return <CinemasPage cinema={cinema} onNavigate={setPage} />;

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
        return (
          <AuthPage
            onBack={() => setPage(PAGE.HOME)}
            onLogin={handleLogin}
          />
        );

      case PAGE.BOOKING:
        return (
          <BookingPage
            movie={activeMovie}
            selectedTime={selectedTime}
            cinema={cinema}
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
            cinema={cinema}
            onBack={() => setPage(PAGE.BOOKING)}
            onPay={handlePay}
          />
        );

      case PAGE.QR_PAYMENT:
        return (
          <QrPaymentPage
            amountThousand={paymentAmount}
            payMethod={payMethod}
            selectedSeats={selectedSeats}
            movie={activeMovie}
            cinema={cinema}
            selectedTime={selectedTime}
            selectedDate={selectedDate || catalog.dates[DEFAULTS.SELECTED_DATE_INDEX]}
            onCancel={() => setPage(PAGE.HOME)}
            onGoToTickets={() => setPage(PAGE.TICKET_HISTORY)}
          />
        );

      case PAGE.COMBO:
        return <ComboPage onNavigate={setPage} />;

      case PAGE.PROFILE:
        return (
          <ProfilePage
            onNavigate={setPage}
            user={user}
            onLogout={handleLogout}
          />
        );

      case PAGE.WALLET:
        return <WalletPage onNavigate={setPage} />;

      case PAGE.TICKET_HISTORY:
        return <TicketHistoryPage onNavigate={setPage} />;

      default:
        return <HomePage movies={catalog.movies} onBuy={startBooking} onNavigate={setPage} user={user} />;
    }
  };

  const showNav = !PAGES_WITHOUT_NAV.includes(page);

  return (
    <div className="app-shell">
      {renderPage()}
      {showNav && <Header page={page} onNavigate={setPage} />}
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
