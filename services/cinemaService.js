import { axiosClient } from "../lib/axiosClient";

const unwrap = (response) => response.data.data;

export const cinemaService = {
  // GET /api/locations -> cây { city, districts: [...] }
  async getLocations() {
    const res = await axiosClient.get("/locations");
    return unwrap(res);
  },

  // GET /api/movies -> { nowShowing: [...], comingSoon: [...] }
  async getMovies() {
    const res = await axiosClient.get("/movies");
    return unwrap(res);
  },

  // Dùng cho load ban đầu ở trang Home: danh sách phim + cây địa điểm để lọc rạp.
  // LƯU Ý: khác với mock cũ — không còn trả "cinemas"/"dates"/"times" tĩnh nữa,
  // vì cinema phụ thuộc vào địa điểm người dùng chọn (gọi getCinemasByDistrict
  // sau khi họ chọn quận/huyện), và "dates" phụ thuộc vào rạp + phim cụ thể
  // (gọi getShowDates sau khi chọn rạp).
  async getInitialCatalog() {
    const [movies, locations] = await Promise.all([
      this.getMovies(),
      this.getLocations(),
    ]);
    return { movies, locations };
  },

  // GET /api/cinemas?districtId=...
  async getCinemasByDistrict(districtId) {
    const res = await axiosClient.get("/cinemas", { params: { districtId } });
    return unwrap(res);
  },

  // GET /api/cinemas/:cinemaId
  // THAY ĐỔI: nhận cinemaId (không còn nhận cinemaName như mock cũ).
  async getCinemaDetails(cinemaId) {
    const res = await axiosClient.get(`/cinemas/${cinemaId}`);
    return unwrap(res);
  },

  // GET /api/showtimes/show-dates/:cinemaId -> ["2026-09-20", ...]
  async getShowDates(cinemaId) {
    const res = await axiosClient.get(`/showtimes/show-dates/${cinemaId}`);
    return unwrap(res);
  },

  // GET /api/showtimes?cinemaId=&date= -> [{ movie, showtimes: [...] }]
  async getShowtimes({ cinemaId, date }) {
    const res = await axiosClient.get("/showtimes", {
      params: { cinemaId, date },
    });
    return unwrap(res);
  },

  // GET /api/showtimes/:showtimeId/seats
  // THAY ĐỔI: nhận showtimeId duy nhất (không còn { movieId, showtime } như mock cũ),
  // vì showtimeId mới là khóa thật xác định 1 suất chiếu cụ thể.
  async getSeatLayout(showtimeId) {
    const res = await axiosClient.get(`/showtimes/${showtimeId}/seats`);
    return unwrap(res);
  },

  // POST /api/bookings -> tạo booking "pending" = giữ ghế tạm thời.
  // Hàm MỚI (mock cũ chưa có bước này) — bắt buộc phải có để tách rõ 2 việc:
  // "giữ ghế" và "xem tóm tắt/thanh toán".
  async holdSeats({ showtimeId, seatIds }) {
    const res = await axiosClient.post("/bookings", { showtimeId, seatIds });
    return unwrap(res); // { _id, seats, totalAmount, expiresAt, ... }
  },

  // GET /api/bookings/:bookingId
  // THAY ĐỔI: nhận bookingId (không còn nhận {movie, showtime, selectedSeats}
  // như mock cũ) — toàn bộ dữ liệu đó server đã lưu sẵn từ bước holdSeats.
  async getCheckoutSummary(bookingId) {
    const res = await axiosClient.get(`/bookings/${bookingId}`);
    return unwrap(res);
  },

  // POST /api/payments/bookings/:bookingId/qr
  // THAY ĐỔI: nhận bookingId (không còn nhận amountThousand từ client — số tiền
  // luôn do server tính từ booking.totalAmount để tránh bị sửa giá trên FE).
  async createQrPayment(bookingId) {
    const res = await axiosClient.post(`/payments/bookings/${bookingId}/qr`);
    return unwrap(res); // { qrImageUrl, bankName, accountNumber, accountName, ... }
  },
};

export default cinemaService;
