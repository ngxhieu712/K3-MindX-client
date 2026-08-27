export const posters = {
  summer:
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=85",
  spider:
    "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=700&q=85",
  linh: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85",
  shin: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=700&q=85",
  odyssey:
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=700&q=85",
  insidious:
    "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=700&q=85",
  love: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85",
  anime:
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=85",
};

export const movies = [
  {
    id: "summer",
    title: "Nghỉ Hè Sợ Nghỉ Hưu",
    genre: "Gia đình, Hài hước",
    length: 117,
    age: "T13",
    poster: posters.summer,
    hot: true,
  },
  {
    id: "spider",
    title: "Người Nhện: Khởi Đầu Mới",
    genre: "Hành động, Phiêu lưu",
    length: 145,
    age: "T13",
    poster: posters.spider,
    hot: true,
  },
  {
    id: "linh",
    title: "Hộ Linh Tráng Sĩ - Bí Ẩn Mộ Vua Đinh",
    genre: "Hành động, Lịch sử",
    length: 155,
    age: "T13",
    poster: posters.linh,
    hot: true,
  },
  {
    id: "shin",
    title: "Phim Shin - Cậu Bé Bút Chì",
    genre: "Hoạt hình, Thần thoại",
    length: 101,
    age: "P",
    poster: posters.shin,
    hot: true,
  },
  {
    id: "insidious",
    title: "Insidious: Quỷ Quyết - Ranh Giới Vô Định",
    genre: "Kinh dị, Bí ẩn",
    length: 103,
    age: "T16",
    poster: posters.insidious,
  },
  {
    id: "odyssey",
    title: "The Odyssey",
    genre: "Hành động, Phiêu lưu",
    length: 173,
    age: "T16",
    poster: posters.odyssey,
  },
  {
    id: "anime",
    title: "Chính Thức Khởi Chiếu",
    genre: "Hoạt hình, Gia đình",
    length: 110,
    age: "T13",
    poster: posters.anime,
  },
  {
    id: "love",
    title: "Thư Tình Gửi Ngoại",
    genre: "Gia đình, Tâm lý",
    length: 118,
    age: "T13",
    poster: posters.love,
  },
];

export const cinemas = [
  "Beta Thanh Xuân",
  "Beta Mỹ Đình",
  "Beta Đan Phượng",
  "Beta Giải Phóng",
  "Beta Tây Sơn",
];
export const dates = [
  "25/08 - T3",
  "26/08 - T4",
  "27/08 - T5",
  "28/08 - T6",
  "29/08 - T7",
  "30/08 - CN",
  "01/09 - T3",
];
export const times = [
  "09:45",
  "10:45",
  "12:00",
  "13:30",
  "14:15",
  "15:00",
  "15:45",
  "16:30",
  "18:15",
  "20:30",
  "21:15",
  "22:45",
];

export const cinemaBrands = [
  { id: "beta", name: "Beta Cinemas", cityCount: 12, logoUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=160&q=80" },
  { id: "cgv", name: "CGV", cityCount: 30, logoUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=160&q=80" },
  { id: "lotte", name: "Lotte Cinema", cityCount: 18, logoUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=160&q=80" },
  { id: "galaxy", name: "Galaxy Cinema", cityCount: 12, logoUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=160&q=80" },
  { id: "bhd", name: "BHD Star", cityCount: 8, logoUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=160&q=80" },
  { id: "cinestar", name: "CineStar", cityCount: 7, logoUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&q=80" },
];

export const cinemaLocations = [
  { id: "my-dinh", providerId: "beta", name: "Beta Mỹ Đình", city: "Hà Nội", address: "Tầng hầm B1, Golden Palace, Từ Liêm", cinemaCount: 7 },
  { id: "thanh-xuan", providerId: "beta", name: "Beta Thanh Xuân", city: "Hà Nội", address: "Tầng 2, 595 Giải Phóng, Thanh Xuân", cinemaCount: 6 },
  { id: "vincom-ba-trieu", providerId: "cgv", name: "CGV Vincom Bà Triệu", city: "Hà Nội", address: "191 Bà Triệu, Hai Bà Trưng", cinemaCount: 10 },
  { id: "lotte-west-lake", providerId: "lotte", name: "Lotte Cinema West Lake", city: "Hà Nội", address: "Lotte Mall West Lake, Tây Hồ", cinemaCount: 9 },
  { id: "nguyen-du", providerId: "galaxy", name: "Galaxy Nguyễn Du", city: "TP. Hồ Chí Minh", address: "116 Nguyễn Du, Quận 1", cinemaCount: 8 },
  { id: "bitexco", providerId: "bhd", name: "BHD Star Bitexco", city: "TP. Hồ Chí Minh", address: "Lầu 3 Bitexco Financial Tower", cinemaCount: 7 },
];

export const airports = [
  { id: "sgn", code: "SGN", city: "Sài Gòn (TP HCM)", name: "Sân bay Quốc tế Tân Sơn Nhất" },
  { id: "bkk", code: "BKK", city: "Bangkok", name: "Sân bay Quốc tế Bangkok Suvarnabhumi" },
  { id: "han", code: "HAN", city: "Hà Nội", name: "Sân bay Quốc tế Nội Bài" },
  { id: "dad", code: "DAD", city: "Đà Nẵng", name: "Sân bay Quốc tế Đà Nẵng" },
];

export const airlines = [
  { id: "vietjet", name: "VietJet Air", shortName: "VJ", color: "#ed1c24" },
  { id: "vietnam-airlines", name: "Vietnam Airlines", shortName: "VN", color: "#1274a6" },
  { id: "vietravel", name: "Vietravel Airlines", shortName: "VU", color: "#e5a400" },
  { id: "bamboo", name: "Bamboo Airways", shortName: "QH", color: "#16a08b" },
];

export const flights = [
  { id: "vj-803", providerId: "vietjet", origin: "SGN", destination: "BKK", departure: "11:15", arrival: "12:45", duration: "1h 30m", price: 3129003, baggage: "20 kg", direct: true },
  { id: "vu-702", providerId: "vietravel", origin: "SGN", destination: "BKK", departure: "11:50", arrival: "13:25", duration: "1h 35m", price: 3125104, baggage: "20 kg", direct: true },
  { id: "vj-805", providerId: "vietjet", origin: "SGN", destination: "BKK", departure: "13:15", arrival: "14:45", duration: "1h 30m", price: 3133135, baggage: "20 kg", direct: true },
  { id: "vn-605", providerId: "vietnam-airlines", origin: "SGN", destination: "BKK", departure: "08:35", arrival: "10:05", duration: "1h 30m", price: 3671724, baggage: "23 kg", direct: true },
];

