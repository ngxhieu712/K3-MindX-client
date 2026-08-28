import { useEffect, useState } from "react";
import "./App.css";
import { DEFAULTS, PAGE, REQUEST_STATUS } from "./constants/app";
import { cinemaService } from "./services/cinemaService";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoadingState from "./components/common/LoadingState";
import BookingModal from "./components/booking/BookingModal";
import HomePage from "./pages/HomePage";
import ChainsPage from "./pages/ChainsPage";
import ChainDetailPage from "./pages/ChainDetailPage";
import MoviesPage from "./pages/MoviesPage";
import ShowtimesPage from "./pages/ShowtimesPage";
import CinemasPage from "./pages/CinemasPage";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import QrPaymentPage from "./pages/QrPaymentPage";

const PAGES_WITHOUT_FOOTER = Object.freeze([PAGE.BOOKING, PAGE.PAYMENT, PAGE.QR_PAYMENT]);

function App() {
  const [catalog, setCatalog] = useState(null);
  const [catalogStatus, setCatalogStatus] = useState(REQUEST_STATUS.IDLE);
  const [page, setPage] = useState(PAGE.HOME);
  const [cinema, setCinema] = useState(DEFAULTS.CINEMA_NAME);
  const [activeMovie, setActiveMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(DEFAULTS.SHOWTIME);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    let isCurrentRequest = true;
    const loadCatalog = async () => {
      setCatalogStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.getInitialCatalog();
      if (isCurrentRequest) {
        setCatalog(response);
        setActiveMovie(response.movies[DEFAULTS.MOVIE_INDEX]);
        setCinema(
          response.cinemas.find((c) => c === DEFAULTS.CINEMA_NAME) ??
            response.cinemas[DEFAULTS.MOVIE_INDEX],
        );
        setCatalogStatus(REQUEST_STATUS.SUCCESS);
      }
    };
    loadCatalog();
    return () => { isCurrentRequest = false; };
  }, []);

  const startBooking = (movie, showtime = DEFAULTS.SHOWTIME) => {
    setActiveMovie(movie);
    setSelectedTime(showtime);
    setBookingModalOpen(true);
  };

  const confirmShowtime = (showtime) => {
    setSelectedTime(showtime);
    setBookingModalOpen(false);
    setPage(PAGE.BOOKING);
  };

  const handleSelectChain = (chain) => {
    setSelectedChain(chain);
    setPage(PAGE.CINEMA_DETAIL);
  };

  const handleSelectCinema = (cinemaObj) => {
    setCinema(cinemaObj.name);
    setPage(PAGE.SHOWTIMES);
  };

  if (catalogStatus === REQUEST_STATUS.LOADING || !catalog || !activeMovie)
    return (
      <div className="app-shell">
        <LoadingState label="Đang tải hệ thống đặt vé..." />
      </div>
    );

  const renderPage = () => {
    switch (page) {
      case PAGE.HOME:
        return (
          <HomePage
            movies={catalog.movies}
            onBuy={startBooking}
            onGoToChains={() => setPage(PAGE.CHAINS)}
          />
        );
      case PAGE.CHAINS:
        return <ChainsPage onSelectChain={handleSelectChain} />;
      case PAGE.CINEMA_DETAIL:
        return (
          <ChainDetailPage
            chain={selectedChain}
            onSelectCinema={handleSelectCinema}
            onBack={() => setPage(PAGE.CHAINS)}
          />
        );
      case PAGE.MOVIES:
        return <MoviesPage movies={catalog.movies} onBuy={startBooking} />;
      case PAGE.SHOWTIMES:
        return <ShowtimesPage cinema={cinema} dates={catalog.dates} onBuy={startBooking} />;
      case PAGE.CINEMAS:
        return <CinemasPage cinema={cinema} onNavigate={setPage} />;
      case PAGE.AUTH:
        return <AuthPage />;
      case PAGE.BOOKING:
        return (
          <BookingPage
            movie={activeMovie}
            selectedTime={selectedTime}
            onNext={(seats) => { setSelectedSeats(seats); setPage(PAGE.PAYMENT); }}
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
        return <QrPaymentPage amountThousand={paymentAmount} onCancel={() => setPage(PAGE.HOME)} />;
      default:
        return (
          <HomePage
            movies={catalog.movies}
            onBuy={startBooking}
            onGoToChains={() => setPage(PAGE.CHAINS)}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Header
        page={page}
        onNavigate={setPage}
        cinema={cinema}
        cinemas={catalog.cinemas}
        onCinemaChange={setCinema}
      />
      {renderPage()}
      {!PAGES_WITHOUT_FOOTER.includes(page) && <Footer />}
      {isBookingModalOpen && (
        <BookingModal
          movie={activeMovie}
          dates={catalog.dates}
          time={selectedTime}
          onClose={() => setBookingModalOpen(false)}
          onConfirm={confirmShowtime}
        />
      )}
    </div>
  );
}

export default App;
