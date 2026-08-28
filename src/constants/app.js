export const PAGE = Object.freeze({
  HOME: "home",
  CHAINS: "chains",
  CINEMA_DETAIL: "cinema_detail",
  MOVIES: "movies",
  SHOWTIMES: "showtimes",
  CINEMAS: "cinemas",
  AUTH: "auth",
  BOOKING: "booking",
  PAYMENT: "payment",
  QR_PAYMENT: "qr",
});

export const MOVIE_TAB = Object.freeze({
  SOON: "soon",
  NOW: "now",
  SPECIAL: "special",
});

export const AUTH_MODE = Object.freeze({
  LOGIN: "login",
  REGISTER: "register",
});

export const REQUEST_STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
});

export const DEFAULTS = Object.freeze({
  PAGE: PAGE.MOVIES,
  CINEMA_NAME: "Beta Mỹ Đình",
  SHOWTIME: "13:15",
  SELECTED_DATE_INDEX: 1,
  MOVIE_INDEX: 0,
  MAX_SELECTED_SEATS: 6,
  MOCK_REQUEST_DELAY_MS: 350,
  UPCOMING_MOVIE_START_INDEX: 4,
  SPECIAL_MOVIE_START_INDEX: 1,
  SPECIAL_MOVIE_END_INDEX: 5,
  SHOWTIME_MOVIE_COUNT: 4,
  SHOWTIME_COUNT_PER_MOVIE: 7,
  SELECTED_SHOWTIME_INDEX: 5,
  AVAILABLE_SEAT_BASE: 112,
  AVAILABLE_SEAT_STEP: 9,
  SEAT_ROWS: 8,
  SEATS_PER_ROW: 10,
  SOLD_SEAT_ROW_INDEX: 2,
  SOLD_SEAT_COLUMN_INDEX: 2,
  RESERVED_SEAT_START_ROW_INDEX: 4,
  RESERVED_SEAT_END_ROW_INDEX: 5,
  VIP_SEAT_PRICE_THOUSAND: 50,
});

export const BOOKING = Object.freeze({
  CINEMA_NAME: "Beta Thanh Xuân",
  DATE: "27/08/2026",
  FORMAT: "2D Phụ đề",
  DEFAULT_SEATS: ["H7", "H8", "H9"],
  HOLD_DURATION: "09:16",
  PAYMENT_DURATION: "9:56",
  AVAILABLE_SEATS: 96,
});

export const UI_TEXT = Object.freeze({
  APP_PROMOTION: "Ưu đãi mới mỗi ngày tại Beta Cinemas",
  MOVIE_TAB_LABELS: {
    [MOVIE_TAB.SOON]: "PHIM SẮP CHIẾU",
    [MOVIE_TAB.NOW]: "PHIM ĐANG CHIẾU",
    [MOVIE_TAB.SPECIAL]: "SUẤT CHIẾU ĐẶC BIỆT",
  },
  NAVIGATION: [
    [PAGE.SHOWTIMES, "LỊCH CHIẾU THEO RẠP"],
    [PAGE.MOVIES, "PHIM"],
    [PAGE.CINEMAS, "RẠP"],
    ["prices", "GIÁ VÉ"],
    ["news", "TIN MỚI VÀ ƯU ĐÃI"],
    ["franchise", "NHƯỢNG QUYỀN"],
    [PAGE.AUTH, "THÀNH VIÊN"],
  ],
  CITIES: ["TP. Hồ Chí Minh", "An Giang", "Đồng Nai", "Khánh Hòa", "Thái Nguyên"],
  FOOTER_LINKS: ["Tuyển dụng", "Giới thiệu", "Liên hệ", "F.A.Q", "Hoạt động xã hội", "Điều khoản sử dụng", "Chính sách thanh toán, đổi trả - hoàn vé", "Hướng dẫn đặt vé online"],
  CINEMA_CONTACTS: [
    "Beta Cinemas Xuân Thủy, Hà Nội - Hotline 0333 023 183",
    "Beta Cinemas Tây Sơn, Hà Nội - Hotline 0976 894 773",
    "Beta Cinemas Vĩnh Yên, Phú Thọ - Hotline 0977 632 215",
    "Beta Cinemas Ung Văn Khiêm, TP Hồ Chí Minh - Hotline 0969 874 873",
    "Beta Cinemas Lào Cai - Hotline 0358 968 970",
    "Beta Cinemas Trần Quang Khải, TP Hồ Chí Minh - Hotline 1900 638 362",
    "Beta Cinemas Mỹ Đình, Hà Nội - Hotline 0866 154 610",
    "Beta Cinemas Thanh Xuân, Hà Nội - Hotline 082 4812878",
    "Beta Cinemas Đan Phượng, Hà Nội - Hotline 0983 901 714",
  ],
  UNDER_AGE_WARNING: "Theo quy định của cục điện ảnh, phim này không dành cho khán giả dưới 16 tuổi.",
  CINEMA_DESCRIPTION: [
    "Rạp Beta Cinemas Mỹ Đình tọa lạc tại tầng hầm B1, tòa nhà Golden Palace, Phường Từ Liêm, Hà Nội.",
    "Rạp có vị trí thuận lợi, rất gần những trường đại học, cao đẳng và cấp 3 lớn tại Hà Nội. Beta Cinemas Mỹ Đình sở hữu tổng cộng 7 phòng chiếu tương đương hơn 800 ghế ngồi.",
    "Với địa điểm thuận lợi, cơ sở vật chất hiện đại, tiên tiến, mức giá ưu đãi, Beta Cinemas Mỹ Đình chắc chắn sẽ là địa điểm xem-ăn-chơi không thể bỏ qua của giới trẻ Hà Thành.",
  ],
});

export const formatMoney = (thousandAmount) => `${thousandAmount}.000 vnđ`;
