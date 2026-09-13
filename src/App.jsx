import { useEffect, useState } from "react";
import "./index.css";
import { DEFAULTS, PAGE, REQUEST_STATUS } from "./constants/app";
import { cinemaService } from "./services/cinemaService";
import { tokenStore } from "../lib/tokenStore";
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

const PAGES_WITHOUT_NAV = [
  PAGE.BOOKING, PAGE.PAYMENT, PAGE.QR_PAYMENT, PAGE.AUTH,
  PAGE.WALLET, PAGE.TICKET_HISTORY, PAGE.TICKET_DETAIL,
];

// Các trang này bắt buộc phải đăng nhập mới được vào (yêu cầu #2): mua vé,
// thanh toán, ví, lịch sử vé. Nếu chưa đăng nhập mà rơi vào 1 trong các trang
// này (dù bấm nút hay do lỗi khác), tự động bật lại tab "Tôi" kèm thông báo.
const AUTH_REQUIRED_PAGES = [
  PAGE.BOOKING, PAGE.PAYMENT, PAGE.QR_PAYMENT, PAGE.WALLET, PAGE.TICKET_HISTORY, PAGE.TICKET_DETAIL,
];

function App() {
  const [catalog, setCatalog]             = useState(null);
  const [catalogStatus, setCatalogStatus] = useState(REQUEST_STATUS.IDLE);
  const [catalogError, setCatalogError]   = useState(null);
  const [page, setPage]                   = useState(DEFAULTS.PAGE);
  // cinema: null cho tới khi người dùng thực sự chọn 1 rạp thật (qua Chọn rạp).
  // Trước đây là 1 chuỗi tên cố định (mock) — giờ là { id, name } để các trang
  // sau (Showtimes, BookingModal...) có cinemaId thật gọi API.
  const [cinema, setCinema]               = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  // Đăng nhập chỉ lưu trong bộ nhớ (giống accessToken ở tokenStore), mất khi
  // F5 giữa luồng — xem ghi chú ở B5 (khôi phục phiên qua refresh-token cookie).
  const [user, setUser]                   = useState(null);
  // Thông báo hiển thị ở tab "Tôi" khi bị chuyển hướng về đây vì chưa đăng nhập.
  const [authNotice, setAuthNotice]       = useState("");

  /* booking flow */
  const [activeMovie, setActiveMovie]     = useState(null);
  const [selectedTime, setSelectedTime]   = useState(DEFAULTS.SHOWTIME);
  const [selectedDate, setSelectedDate]   = useState("");
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking]             = useState(null); // kết quả POST /api/customer/bookings (giữ ghế thật)
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [payMethod, setPayMethod]         = useState("bank");
  const [isModalOpen, setModalOpen]       = useState(false);

  const loadCatalog = () => {
    let alive = true;
    setCatalogStatus(REQUEST_STATUS.LOADING);
    setCatalogError(null);
    cinemaService.getInitialCatalog()
      .then(res => {
        if (!alive) return;
        setCatalog(res);
        setActiveMovie(res.movies?.[DEFAULTS.MOVIE_INDEX] ?? null);
        setCatalogStatus(REQUEST_STATUS.SUCCESS);
      })
      .catch(err => {
        if (!alive) return;
        setCatalogError(err.message || "Không kết nối được máy chủ");
        setCatalogStatus(REQUEST_STATUS.ERROR);
      });
    return () => { alive = false; };
  };

  useEffect(() => loadCatalog(), []);

  // Lớp bảo vệ chung: nếu vì lý do gì đó (bấm nút khác, đăng xuất giữa chừng...)
  // page chuyển sang 1 trang bắt buộc đăng nhập mà chưa có user, tự bật lại
  // tab "Tôi" kèm thông báo — không chỉ chặn ở nút "Xác nhận suất chiếu".
  useEffect(() => {
    if (AUTH_REQUIRED_PAGES.includes(page) && !user) {
      setAuthNotice("Vui lòng đăng nhập để tiếp tục");
      setPage(PAGE.PROFILE);
    }
  }, [page, user]);

  const handleLogin = (userData, accessToken) => {
    setUser(userData);
    tokenStore.set(accessToken);
  };

  const handleLogout = () => {
    tokenStore.clear();
    setUser(null);
    setPage(PAGE.HOME);
  };

  const startBooking = (movie, showtime = DEFAULTS.SHOWTIME) => {
    setActiveMovie(movie);
    setSelectedTime(showtime);
    setModalOpen(true);
  };

  const confirmShowtime = (time, date, showtimeId) => {
    if (!user) {
      setModalOpen(false);
      setAuthNotice("Vui lòng đăng nhập để tiếp tục mua vé");
      setPage(PAGE.PROFILE);
      return;
    }
    setSelectedTime(time);
    if (date) setSelectedDate(date);
    if (showtimeId) setSelectedShowtimeId(showtimeId);
    setModalOpen(false);
    setPage(PAGE.BOOKING);
  };

  const handleSelectChain = (chain, cinemaObj) => {
    setSelectedChain(chain);
    if (cinemaObj) setCinema({ id: cinemaObj.id, name: cinemaObj.name });
    setPage(PAGE.CINEMA_DETAIL);
  };

  const handleSelectCinema = (cinemaObj) => {
    setCinema({ id: cinemaObj.id, name: cinemaObj.name });
    setPage(PAGE.SHOWTIMES);
  };

  const handlePay = (amount, method, seats, movie) => {
    setPaymentAmount(Math.round(amount / 1000));
    setPayMethod(method);
    setSelectedSeats(seats);
    setPage(PAGE.QR_PAYMENT);
  };

  if (catalogStatus === REQUEST_STATUS.ERROR) {
    return (
      <div className="app-shell">
        <div className="loading-state" style={{ flexDirection: "column", gap: 12, padding: 24, textAlign: "center" }}>
          <div>😕 Không tải được dữ liệu phim/rạp.</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{catalogError}</div>
          <button className="booking-continue-btn" style={{ padding: "10px 20px" }} onClick={loadCatalog}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (catalogStatus === REQUEST_STATUS.LOADING || !catalog) {
    return (
      <div className="app-shell">
        <LoadingState label="Đang tải H&N Cinema..." />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case PAGE.HOME:
        return <HomePage movies={catalog.movies} banners={catalog.banners} onBuy={startBooking} onNavigate={setPage} user={user} />;

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
            selectedShowtimeId={selectedShowtimeId}
            onNext={(bookingRes) => {
              setBooking(bookingRes);
              setSelectedSeats(bookingRes.seatDetails?.map(s => s.seatName) ?? []);
              setPage(PAGE.PAYMENT);
            }}
            onBack={() => setPage(PAGE.SHOWTIMES)}
          />
        );

      case PAGE.PAYMENT:
        return (
          <PaymentPage
            movie={activeMovie}
            selectedTime={selectedTime}
            selectedSeats={selectedSeats}
            booking={booking}
            cinema={cinema}
            onBack={() => setPage(PAGE.BOOKING)}
            onPay={handlePay}
          />
        );

      case PAGE.QR_PAYMENT:
        return (
          <QrPaymentPage
            bookingId={booking?._id}
            amountThousand={paymentAmount}
            payMethod={payMethod}
            selectedSeats={selectedSeats}
            movie={activeMovie}
            cinema={cinema?.name}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
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
            authNotice={authNotice}
            onClearAuthNotice={() => setAuthNotice("")}
          />
        );

      case PAGE.WALLET:
        return <WalletPage onNavigate={setPage} />;

      case PAGE.TICKET_HISTORY:
        return <TicketHistoryPage onNavigate={setPage} />;

      default:
        return <HomePage movies={catalog.movies} banners={catalog.banners} onBuy={startBooking} onNavigate={setPage} user={user} />;
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
          cinema={cinema}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmShowtime}
        />
      )}
    </div>
  );
}

export default App;
