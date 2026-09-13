import { apiClient } from "./apiClient";

// ── Trình bày (logo/mô tả hãng rạp) ──────────────────────────────────────
// CinemaBrand trong DB chỉ lưu name/slug/logoUrl — không có emoji/tagline
// marketing. Bảng nhỏ này chỉ để trang trí UI, KHÔNG ảnh hưởng dữ liệu nghiệp
// vụ (phim/rạp/suất chiếu/ghế đều là dữ liệu thật từ server).
const CHAIN_PRESENTATION = {
  Beta: { logo: "🎥", description: "Chuỗi rạp chiếu phim Việt Nam với giá vé bình dân nhất", promoText: "Vé từ 50K/vé 2D mỗi thứ 2" },
  CGV: { logo: "🎬", description: "Hệ thống rạp chiếu phim Hàn Quốc hàng đầu Việt Nam", promoText: "Giảm 30% vé 2D Thứ 6, T7, CN" },
  Galaxy: { logo: "⭐", description: "Hệ thống rạp phim chất lượng cao với công nghệ âm thanh đỉnh" },
  Lotte: { logo: "🍀", description: "Rạp chiếu phim Hàn Quốc với không gian sang trọng, hiện đại" },
  Cinestar: { logo: "💫", description: "Rạp chiếu phim giá rẻ, chất lượng tốt cho mọi gia đình" },
};
const DEFAULT_CHAIN_PRESENTATION = { logo: "🎬", description: "" };

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function mapMovie(m) {
  if (!m) return null;
  return {
    id: m._id,
    title: m.title,
    genre: m.genre,
    length: m.duration,
    age: m.age,
    poster: m.poster,
    showingStatus: m.showingStatus, // "now_showing" | "coming_soon"
    releaseDate: m.releaseDate,
  };
}

function mapCinema(c) {
  return {
    id: c._id,
    name: c.name,
    address: c.address,
    color: c.color,
    chainName: c.brandId?.name || c.chain,
    chainSlug: c.brandId?.slug || c.chain?.toLowerCase(),
    districtName: c.districtId?.name || "",
  };
}

function formatDateLabel(isoDate) {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return { iso: isoDate, day: `${day}/${month}`, dow: WEEKDAY_LABELS[d.getDay()] };
}

export const cinemaService = {
  // GET /api/customer/movies + GET /api/customer/banners
  async getInitialCatalog() {
    const [moviesRes, banners] = await Promise.all([
      apiClient.get("/movies"),
      apiClient.get("/banners").catch(() => []), // banner lỗi/thiếu không nên chặn cả trang chủ
    ]);

    const nowShowing = (moviesRes.nowShowing || []).map(mapMovie);
    const comingSoon = (moviesRes.comingSoon || []).map(mapMovie);
    const hotIds = new Set(nowShowing.slice(0, 4).map((m) => m.id));
    const movies = [...nowShowing, ...comingSoon].map((m) => ({ ...m, hot: hotIds.has(m.id) }));

    return { movies, banners };
  },

  // GET /api/customer/cinemas — trả cinema thô đã map, dùng cho mọi trang cần danh sách rạp.
  async getCinemas() {
    const cinemas = await apiClient.get("/cinemas");
    return cinemas.map(mapCinema);
  },

  // Gom cinemas theo hãng — phục vụ ChainsPage/ChainDetailPage (thay "chains" mock cũ).
  async getChains() {
    const cinemas = await this.getCinemas();
    const byChain = new Map();

    for (const c of cinemas) {
      const key = c.chainSlug || c.chainName;
      if (!byChain.has(key)) {
        const presentation = CHAIN_PRESENTATION[c.chainName] || DEFAULT_CHAIN_PRESENTATION;
        byChain.set(key, { id: key, name: c.chainName, color: c.color, ...presentation, cinemas: [] });
      }
      byChain.get(key).cinemas.push(c);
    }

    return Array.from(byChain.values());
  },

  // GET /api/customer/cinemas/:cinemaId — dùng cho CinemasPage.
  async getCinemaDetail(cinemaId) {
    const cinema = await apiClient.get(`/cinemas/${cinemaId}`);
    return {
      id: cinema._id,
      name: cinema.name,
      address: cinema.address,
      description: [cinema.address].filter(Boolean),
      hotMovies: (cinema.featuredMovies || []).map(mapMovie),
    };
  },

  // GET /api/customer/showtimes/show-dates/:cinemaId — ngày còn suất chiếu khả dụng.
  async getShowDates(cinemaId) {
    const isoDates = await apiClient.get(`/showtimes/show-dates/${cinemaId}`);
    return isoDates.map(formatDateLabel);
  },

  // GET /api/customer/showtimes?cinemaId=&date= — gom theo phim, mỗi phim có mảng suất chiếu thật.
  async getShowtimes({ cinemaId, date }) {
    if (!cinemaId || !date) return [];
    const groups = await apiClient.get(`/showtimes?cinemaId=${cinemaId}&date=${date}`);
    return groups.map((g) => ({
      ...mapMovie(g.movie),
      showtimes: g.showtimes.map((st) => ({
        id: st._id,
        time: new Date(st.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        startTime: st.startTime,
        format: st.format,
        price: st.price,
      })),
    }));
  },

  // GET /api/customer/showtimes/:showtimeId/seats — sơ đồ ghế thật của đúng
  // suất chiếu (ghế đã bán/đang giữ chỗ bởi người khác sẽ có status "unavailable").
  async getSeatLayout(showtimeId) {
    const res = await apiClient.get(`/showtimes/${showtimeId}/seats`);
    return {
      showtime: res.showtime,
      movie: mapMovie(res.movie),
      cinema: res.cinema,
      auditorium: res.auditorium,
      rows: res.rows, // [{ row, seats: [{_id, row, number, type, status}] }]
      totalSeats: res.totalSeats,
      availableSeats: res.availableSeats,
    };
  },

  // POST /api/customer/bookings — giữ ghế thật (yêu cầu đăng nhập). Ném lỗi
  // (vd 409 nếu ghế vừa bị người khác giữ) để trang gọi tự xử lý/hiện thông báo.
  async createBookingHold({ showtimeId, seatIds }) {
    return apiClient.post("/bookings", { showtimeId, seatIds }, { auth: true });
  },

  // POST /api/customer/payments/bookings/:bookingId/qr — QR chuyển khoản thật
  // (ảnh VietQR thật, số tiền lấy từ booking đã tính sẵn ở server).
  async createQrPayment(bookingId) {
    return apiClient.post(`/payments/bookings/${bookingId}/qr`, {}, { auth: true });
  },

  // POST /api/customer/payments/bookings/:bookingId/confirm-demo — nút demo
  // "đã chuyển khoản": chuyển booking pending -> confirmed thật trên server.
  async confirmBankPaymentDemo(bookingId) {
    return apiClient.post(`/payments/bookings/${bookingId}/confirm-demo`, {}, { auth: true });
  },

  // POST /api/customer/payments/bookings/:bookingId/pay-wallet — trừ ví thật.
  async payBookingWithWallet(bookingId) {
    return apiClient.post(`/payments/bookings/${bookingId}/pay-wallet`, {}, { auth: true });
  },

  // ── Ví điện tử (yêu cầu #1) ──
  async getWallet() {
    return apiClient.get("/wallet", { auth: true });
  },

  async requestWalletTopupQr(amount) {
    return apiClient.post("/wallet/topup/qr", { amount }, { auth: true });
  },

  async confirmWalletTopup(amount) {
    return apiClient.post("/wallet/topup/confirm", { amount }, { auth: true });
  },

  // ── Lịch sử vé thật + yêu cầu hoàn vé thật ──
  async getMyTickets() {
    return apiClient.get("/bookings", { auth: true });
  },

  async requestRefund(bookingId) {
    return apiClient.post(`/bookings/${bookingId}/refund-request`, {}, { auth: true });
  },
};

export default cinemaService;
