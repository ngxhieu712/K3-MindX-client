import { airports, airlines, cinemaBrands, cinemaLocations, cinemas, dates, flights, movies, posters, times } from "../data/mockData";
import { BOOKING, DEFAULTS, UI_TEXT } from "../constants/app";
import { apiClient } from "./apiClient";

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
    return apiClient.get("/api/marketplace/catalog", { movies, cinemas, dates, times, cinemaBrands, cinemaLocations, airports, airlines });
  },

  async getCinemaDetails(cinemaName) {
    // TODO: Replace this fallback with GET /api/cinemas/:cinemaName.
    return apiClient.get(`/api/marketplace/cinemas/${encodeURIComponent(cinemaName)}`, {
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

    return apiClient.get(`/api/marketplace/showtimes?cinema=${encodeURIComponent(cinemaName)}&date=${encodeURIComponent(date)}`, { cinemaName, date, movies: showtimeMovies });
  },

  async getCinemaMarketplace() {
    // TODO: Replace this fallback with GET /api/providers?type=cinema and GET /api/cinemas.
    return apiClient.get("/api/marketplace/cinema-marketplace", { brands: cinemaBrands, locations: cinemaLocations });
  },

  async searchFlights(searchCriteria) {
    // TODO: Replace this fallback with GET /api/flights/search and pass searchCriteria to airline provider adapters.
    const enrichedFlights = flights.map((flight) => ({
      ...flight,
      provider: airlines.find((airline) => airline.id === flight.providerId),
      searchCriteria,
    }));
    const query = `?origin=${encodeURIComponent(searchCriteria.originCode)}&destination=${encodeURIComponent(searchCriteria.destinationCode)}&departureDate=${encodeURIComponent(searchCriteria.departureDate)}`;
    return apiClient.get(`/api/marketplace/flights/search${query}`, { flights: enrichedFlights, airports, searchCriteria });
  },

  async getFlightBookingDetails({ flightId, fareClass }) {
    // TODO: Replace this fallback with GET /api/flights/:flightId/fares/:fareClass.
    const flight = flights.find((item) => item.id === flightId) ?? flights[DEFAULTS.FLIGHT_RESULT_INDEX];
    return apiClient.get(`/api/marketplace/flights/${encodeURIComponent(flightId)}?fareClass=${encodeURIComponent(fareClass)}`, { flight, fareClass, provider: airlines.find((airline) => airline.id === flight.providerId), fareOptions: [{ name: "Phổ thông", price: flight.price, baggage: flight.baggage }, { name: "Phổ thông đặc biệt", price: flight.price + 66000, baggage: flight.baggage }] });
  },

  async submitFlightPassengerDetails(payload) {
    // TODO: Replace this fallback with POST /api/orders/flight/passengers.
    return apiClient.post("/api/marketplace/orders/flight/passengers", payload, { ...payload, orderCode: "TH-2026-0827-0001" });
  },

  async getSeatLayout({ movieId, showtime }) {
    // TODO: Replace this fallback with GET /api/showtimes/:showtime/seats and reserve seats on the server.
    return apiClient.get(`/api/marketplace/showtimes/${encodeURIComponent(showtime)}/seats?movieId=${encodeURIComponent(movieId)}`, {
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
    return apiClient.post("/api/marketplace/checkout/summary", { movie, showtime, selectedSeats }, {
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
    return apiClient.post("/api/marketplace/payments/qr", { amount: amountThousand }, {
      amountThousand,
      transferContent: "Thanh toán hóa đơn 8010810505062121",
      accountNumber: "9652015644POA986E30",
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      expiresIn: BOOKING.PAYMENT_DURATION,
    });
  },

  async submitAuth({ mode, payload }) {
    // TODO: Replace this fallback with POST /api/auth/login or POST /api/auth/register.
    return apiClient.post(`/api/marketplace/auth/${mode}`, payload, { mode, payload, isSuccessful: true });
  },
};
