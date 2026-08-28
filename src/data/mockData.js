export const posters = {
  summer: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=85",
  spider: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=700&q=85",
  linh: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85",
  shin: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=700&q=85",
  odyssey: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=700&q=85",
  insidious: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=700&q=85",
  love: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85",
  anime: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=85",
};

export const movies = [
  { id: "summer", title: "Nghỉ Hè Sợ Nghỉ Hưu", genre: "Gia đình, Hài hước", length: 117, age: "T13", poster: posters.summer, hot: true },
  { id: "spider", title: "Người Nhện: Khởi Đầu Mới", genre: "Hành động, Phiêu lưu", length: 145, age: "T13", poster: posters.spider, hot: true },
  { id: "linh", title: "Hộ Linh Tráng Sĩ - Bí Ẩn Mộ Vua Đinh", genre: "Hành động, Lịch sử", length: 155, age: "T13", poster: posters.linh, hot: true },
  { id: "shin", title: "Phim Shin - Cậu Bé Bút Chì", genre: "Hoạt hình, Thần thoại", length: 101, age: "P", poster: posters.shin, hot: true },
  { id: "insidious", title: "Insidious: Quỷ Quyết", genre: "Kinh dị, Bí ẩn", length: 103, age: "T16", poster: posters.insidious },
  { id: "odyssey", title: "The Odyssey", genre: "Hành động, Phiêu lưu", length: 173, age: "T16", poster: posters.odyssey },
  { id: "anime", title: "Chính Thức Khởi Chiếu", genre: "Hoạt hình, Gia đình", length: 110, age: "T13", poster: posters.anime },
  { id: "love", title: "Thư Tình Gửi Ngoại", genre: "Gia đình, Tâm lý", length: 118, age: "T13", poster: posters.love },
];

// Các hãng rạp phim
export const chains = [
  {
    id: "cgv",
    name: "CGV",
    logo: "🎬",
    color: "#e60012",
    description: "Hệ thống rạp chiếu phim Hàn Quốc hàng đầu Việt Nam",
    cinemas: [
      { id: "cgv-vincom-ba-trieu", name: "CGV Vincom Bà Triệu", address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội", distance: "1.2 km", screens: 8 },
      { id: "cgv-aeon-ha-dong", name: "CGV AEON Hà Đông", address: "Aeon Mall Hà Đông, Hà Nội", distance: "5.8 km", screens: 10 },
      { id: "cgv-vincom-nguyen-chi-thanh", name: "CGV Vincom Nguyễn Chí Thanh", address: "54A Nguyễn Chí Thanh, Đống Đa, Hà Nội", distance: "3.1 km", screens: 7 },
    ],
  },
  {
    id: "beta",
    name: "Beta Cinemas",
    logo: "🎥",
    color: "#005b9f",
    description: "Chuỗi rạp chiếu phim Việt Nam với giá vé bình dân nhất",
    cinemas: [
      { id: "beta-thanh-xuan", name: "Beta Thanh Xuân", address: "Số 1 Nguyễn Tuân, Thanh Xuân, Hà Nội", distance: "0.8 km", screens: 5 },
      { id: "beta-my-dinh", name: "Beta Mỹ Đình", address: "Tầng hầm B1, Golden Palace, Mỹ Đình, Hà Nội", distance: "2.1 km", screens: 7 },
      { id: "beta-tay-son", name: "Beta Tây Sơn", address: "Đường Tây Sơn, Đống Đa, Hà Nội", distance: "3.5 km", screens: 4 },
    ],
  },
  {
    id: "galaxy",
    name: "Galaxy Cinema",
    logo: "⭐",
    color: "#6c3fa0",
    description: "Hệ thống rạp phim chất lượng cao với công nghệ âm thanh đỉnh",
    cinemas: [
      { id: "galaxy-nguyen-du", name: "Galaxy Nguyễn Du", address: "116 Nguyễn Du, Hai Bà Trưng, Hà Nội", distance: "2.4 km", screens: 6 },
      { id: "galaxy-mipec", name: "Galaxy Mipec Long Biên", address: "Mipec Long Biên, Long Biên, Hà Nội", distance: "6.2 km", screens: 8 },
    ],
  },
  {
    id: "lotte",
    name: "Lotte Cinema",
    logo: "🍀",
    color: "#e8001c",
    description: "Rạp chiếu phim Hàn Quốc với không gian sang trọng, hiện đại",
    cinemas: [
      { id: "lotte-dong-da", name: "Lotte Cinema Đống Đa", address: "Tòa nhà Lotte Center, 54 Liễu Giai, Đống Đa, Hà Nội", distance: "3.8 km", screens: 9 },
      { id: "lotte-long-bien", name: "Lotte Cinema Long Biên", address: "Lotte Mall West Lake, Long Biên, Hà Nội", distance: "7.1 km", screens: 11 },
    ],
  },
  {
    id: "cinestar",
    name: "Cinestar",
    logo: "💫",
    color: "#ff6b00",
    description: "Rạp chiếu phim giá rẻ, chất lượng tốt cho mọi gia đình",
    cinemas: [
      { id: "cinestar-hai-ba-trung", name: "Cinestar Hai Bà Trưng", address: "135 Hai Bà Trưng, Hà Nội", distance: "1.9 km", screens: 5 },
    ],
  },
];

export const dates = [
  "25/08 - T3", "26/08 - T4", "27/08 - T5",
  "28/08 - T6", "29/08 - T7", "30/08 - CN", "01/09 - T3",
];

export const times = [
  "09:45", "10:45", "12:00", "13:30", "14:15",
  "15:00", "15:45", "16:30", "18:15", "20:30", "21:15", "22:45",
];

// Giữ lại cinemas array cũ để không break code hiện tại
export const cinemas = chains.flatMap((c) => c.cinemas.map((ci) => ci.name));

export const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=85",
    title: "Mùa Phim Hè 2026",
    subtitle: "Đặt vé tại hơn 50 rạp trên toàn quốc — CGV, Beta, Galaxy, Lotte và nhiều hơn nữa",
    cta: "Đặt vé ngay",
    badge: "HOT",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=85",
    title: "Ưu đãi Thứ 4 Vui Vẻ",
    subtitle: "Giảm 30% tất cả vé xem phim vào mỗi thứ 4 hàng tuần tại tất cả các rạp",
    cta: "Xem ưu đãi",
    badge: "SALE",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1400&q=85",
    title: "Combo Bắp Nước Siêu Tiết Kiệm",
    subtitle: "Mua vé kèm combo tiết kiệm đến 56K — Áp dụng tại CGV, Beta, Galaxy",
    cta: "Chọn combo",
    badge: "MỚI",
  },
];

export const reviews = {
  summer: [
    { user: "Minh Anh", rating: 5, comment: "Phim siêu hay, cười không ngớt! Cả gia đình đều thích." },
    { user: "Trọng Tín", rating: 4, comment: "Nội dung dễ thương, phù hợp xem cuối tuần cùng gia đình." },
    { user: "Lan Hương", rating: 5, comment: "Diễn viên diễn xuất rất tự nhiên, đặc biệt là cảnh kết." },
  ],
  spider: [
    { user: "Đức Minh", rating: 5, comment: "Hành động đỉnh, CGI cực đẹp. Một trong những phim hay nhất năm!" },
    { user: "Thanh Tâm", rating: 4, comment: "Cốt truyện cuốn hút từ đầu đến cuối, không lãng phí cảnh nào." },
    { user: "Hải Long", rating: 4, comment: "Xem xong muốn xem lại ngay, rất mãn nhãn." },
  ],
  linh: [
    { user: "Phương Linh", rating: 5, comment: "Tự hào phim Việt! Kỹ xảo không thua phim nước ngoài." },
    { user: "Quốc Bảo", rating: 4, comment: "Câu chuyện lịch sử được kể rất hấp dẫn và cuốn hút." },
    { user: "Thu Hà", rating: 5, comment: "Phim Việt chất lượng cao, nên xem ủng hộ!" },
  ],
  shin: [
    { user: "Bảo Ngọc", rating: 5, comment: "Con mình thích lắm, cười suốt từ đầu đến cuối!" },
    { user: "Văn Khoa", rating: 4, comment: "Hoạt hình đẹp, nội dung vui nhộn phù hợp mọi lứa tuổi." },
    { user: "Mai Linh", rating: 5, comment: "Shin vẫn cute như ngày xưa, nostalgia quá!" },
  ],
  insidious: [
    { user: "Tuấn Kiệt", rating: 4, comment: "Đáng sợ thật sự, hồi hộp từ đầu đến cuối!" },
    { user: "Ngọc Hân", rating: 3, comment: "Có một số cảnh hơi đoán được nhưng vẫn đáng xem." },
    { user: "Gia Huy", rating: 4, comment: "Phần này hay hơn phần trước, kịch bản chặt hơn nhiều." },
  ],
  odyssey: [
    { user: "Minh Khôi", rating: 5, comment: "Bom tấn đúng nghĩa! Nên xem màn hình lớn để tận hưởng." },
    { user: "Bích Trâm", rating: 4, comment: "Hành trình phiêu lưu cực kỳ hoành tráng và cảm xúc." },
    { user: "Đình Nam", rating: 5, comment: "Một trong những phim đáng xem nhất mùa hè này." },
  ],
  anime: [
    { user: "Khánh Vy", rating: 4, comment: "Hoạt hình Nhật chất lượng cao, âm nhạc rất hay." },
    { user: "Tiến Đạt", rating: 5, comment: "Cốt truyện xúc động, mình đã khóc ở rạp." },
    { user: "Hồng Nhung", rating: 4, comment: "Visual đẹp xuất sắc, xứng đáng xem ở rạp lớn." },
  ],
  love: [
    { user: "Diễm Quỳnh", rating: 5, comment: "Phim ý nghĩa về tình cảm gia đình, mình xem 2 lần rồi." },
    { user: "Anh Tuấn", rating: 4, comment: "Nhẹ nhàng, sâu sắc. Nhớ mang theo khăn giấy nhé!" },
    { user: "Thanh Xuân", rating: 5, comment: "Diễn viên diễn hay, câu chuyện chạm đến trái tim." },
  ],
};

export const vouchers = [
  { code: "CGV30", discount: 30, type: "percent", description: "Giảm 30% tại tất cả rạp CGV", cinemas: ["cgv"] },
  { code: "BETA50K", discount: 50, type: "fixed", description: "Giảm 50K tại Beta Cinemas", cinemas: ["beta"] },
  { code: "NEWUSER", discount: 25, type: "percent", description: "Ưu đãi người dùng mới - Giảm 25%", cinemas: null },
  { code: "SUMMER26", discount: 30, type: "fixed", description: "Ưu đãi mùa hè - Giảm 30K", cinemas: null },
  { code: "GALAXY20", discount: 20, type: "percent", description: "Giảm 20% tại Galaxy Cinema", cinemas: ["galaxy"] },
  { code: "COMBO56", discount: 56, type: "fixed", description: "Tiết kiệm 56K khi mua kèm combo", cinemas: null },
];

export const nearbyTheaters = [
  { name: "Beta Thanh Xuân", address: "Số 1 Nguyễn Tuân, Thanh Xuân, Hà Nội", distance: "0.8 km", screens: 5, hotline: "082 4812878" },
  { name: "CGV Vincom Bà Triệu", address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội", distance: "1.2 km", screens: 8, hotline: "1900 6017" },
  { name: "Beta Mỹ Đình", address: "Tầng hầm B1, Golden Palace, Mỹ Đình, Hà Nội", distance: "2.1 km", screens: 7, hotline: "0866 154 610" },
  { name: "Galaxy Nguyễn Du", address: "116 Nguyễn Du, Hai Bà Trưng, Hà Nội", distance: "2.4 km", screens: 6, hotline: "1900 2224" },
];
