import { cinemas, dates, movies, posters, times } from "../data/mockData";
import { BOOKING, DEFAULTS, UI_TEXT } from "../constants/app";

const waitForMockResponse = (payload) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(payload), DEFAULTS.MOCK_REQUEST_DELAY_MS);
  });

const buildSeatRows = () =>
  Array.from({ length: DEFAULTS.SEAT_ROWS }, (_, rowIndex) =>
    Array.from(
      { length: DEFAULTS.SEATS_PER_ROW },
      (_, columnIndex) =>
        `${String.fromCharCode("A".charCodeAt(0) + rowIndex)}${columnIndex + 1}`,
    ),
  );

export const cinemaService = {
  async getInitialCatalog() {
    // TODO: Replace this fallback with GET /api/movies, GET /api/cinemas and GET /api/show-dates.
    return waitForMockResponse({ movies, cinemas, dates, times });
  },

  async getCinemaDetails(cinemaName) {
    // TODO: Replace this fallback with GET /api/cinemas/:cinemaName.
    return waitForMockResponse({
      name: cinemaName,
      image: posters.love,
      description: UI_TEXT.CINEMA_DESCRIPTION,
      hotMovies: movies.slice(
        DEFAULTS.SOLD_SEAT_ROW_INDEX,
        DEFAULTS.SPECIAL_MOVIE_END_INDEX + 1,
      ),
    });
  },

  async getShowtimes({ cinemaName, date }) {
    // TODO: Replace this fallback with GET /api/showtimes?cinema={cinemaName}&date={date}.
    const showtimeMovies = movies
      .slice(0, DEFAULTS.SHOWTIME_MOVIE_COUNT)
      .map((movie, movieIndex) => ({
        ...movie,
        showtimes: times
          .slice(movieIndex, movieIndex + DEFAULTS.SHOWTIME_COUNT_PER_MOVIE)
          .map((time, timeIndex) => ({
            time,
            availableSeats:
              DEFAULTS.AVAILABLE_SEAT_BASE +
              timeIndex * DEFAULTS.AVAILABLE_SEAT_STEP,
            isHighlighted: timeIndex === DEFAULTS.SELECTED_SHOWTIME_INDEX,
          })),
      }));

    return waitForMockResponse({ cinemaName, date, movies: showtimeMovies });
  },

  async getSeatLayout({ movieId, showtime }) {
    // TODO: Replace this fallback with GET /api/showtimes/:showtime/seats and reserve seats on the server.
    return waitForMockResponse({
      movieId,
      showtime,
      seats: buildSeatRows(),
      defaultSelectedSeats: BOOKING.DEFAULT_SEATS,
      cinemaName: BOOKING.CINEMA_NAME,
      date: BOOKING.DATE,
      format: BOOKING.FORMAT,
      holdDuration: BOOKING.HOLD_DURATION,
    });
  },

  async getCheckoutSummary({ movie, showtime, selectedSeats }) {
    // TODO: Replace this fallback with POST /api/checkout/summary and let the server calculate totals.
    return waitForMockResponse({
      customer: {
        name: "Nguyễn Trung Hiếu",
        phone: "0878939686",
        email: "trunghieu2kar7@gmail.com",
      },
      movie,
      showtime,
      selectedSeats,
      cinemaName: BOOKING.CINEMA_NAME,
      date: BOOKING.DATE,
      format: BOOKING.FORMAT,
      seatPriceThousand: DEFAULTS.VIP_SEAT_PRICE_THOUSAND,
      combo: {
        name: "Combo See Mê - Kim cương",
        description:
          "TIẾT KIỆM 56K!!! Sở hữu ngay: 1 Ly Kim Cương kèm nước + 1 Bắp (69oz)",
      },
    });
  },

  async createQrPayment({ amountThousand }) {
    // TODO: Replace this fallback with POST /api/payments/qr and use the QR payload returned by the gateway.
    return waitForMockResponse({
      amountThousand,
      transferContent: "Thanh toán hóa đơn 8010810505062121",
      accountNumber: "9652015644POA986E30",
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      expiresIn: BOOKING.PAYMENT_DURATION,
    });
  },

  async submitAuth({ mode, payload }) {
    // TODO: Replace this fallback with POST /api/auth/login or POST /api/auth/register.
    return waitForMockResponse({ mode, payload, isSuccessful: true });
  },
};
