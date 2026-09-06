import { useState } from "react";
import { chains } from "../data/mockData";
import Icon from "../components/common/Icon";

const COMBOS = [
  {
    id: "c1", icon: "🍿", name: "Combo 2 Big",
    desc: "1 bắp ngọt + 2 nước ngọt size 27oz",
    price: 109000, category: "bap-nuoc",
  },
  {
    id: "c2", icon: "🍿🥤", name: "Combo 3",
    desc: "2 bắp ngọt + 3 nước ngọt 27oz hoặc trà bất kỳ",
    price: 149000, category: "bap-nuoc",
  },
  {
    id: "c3", icon: "👑", name: "Combo Kim Cương",
    desc: "1 ly Kim Cương kèm nước + 1 Bắp 69oz. Tiết kiệm 56K!",
    price: 169000, category: "bap-nuoc",
  },
  {
    id: "c4", icon: "🥤", name: "Nước ngọt đơn",
    desc: "1 ly nước ngọt size 32oz tùy chọn",
    price: 39000, category: "nuoc",
  },
  {
    id: "c5", icon: "🍟", name: "Snack Party",
    desc: "1 bắp muối + 1 khoai tây chiên + 1 nước",
    price: 89000, category: "bap-nuoc",
  },
  {
    id: "c6", icon: "🍬", name: "Kẹo Cinema Mix",
    desc: "Túi kẹo tổng hợp đặc biệt cho buổi chiếu phim",
    price: 29000, category: "snack",
  },
];

const CATEGORIES = [
  { id: "all",      label: "Tất cả" },
  { id: "bap-nuoc", label: "Bắp nước" },
  { id: "nuoc",     label: "Nước" },
  { id: "snack",    label: "Snack" },
];

const allCinemaNames = chains.flatMap(c => c.cinemas.map(ci => ci.name));
const allDates = ["Hôm nay", "Ngày mai", "Thứ 3, 09/09", "Thứ 4, 10/09"];

function ComboPage() {
  const [category, setCategory] = useState("all");
  const [cinema, setCinema] = useState(allCinemaNames[0]);
  const [date, setDate] = useState(allDates[0]);
  const [showCinemaPicker, setShowCinemaPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const visible = COMBOS.filter(c => category === "all" || c.category === category);

  return (
    <div className="combo-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <span className="top-bar-title" style={{ marginRight: 0 }}>Mua bắp nước</span>
        <button className="top-bar-icon-btn"><Icon name="home" size={18} /></button>
      </div>

      {/* hero */}
      <div className="combo-hero" style={{ margin: "12px 16px 16px" }}>
        <div className="combo-hero-emoji">🎬🍿</div>
        <div className="combo-hero-title">Giá ưu đãi</div>
        <div className="combo-hero-sub">Chỉ có trên K3-MindX Cinema</div>
      </div>

      {/* picker */}
      <div className="combo-picker">
        {/* cinema */}
        <div className="combo-picker-item" onClick={() => { setShowCinemaPicker(p => !p); setShowDatePicker(false); }}>
          <div>
            <div className="combo-picker-label">Nhận tại</div>
            <div className="combo-picker-value">{cinema}</div>
          </div>
          <span className="combo-picker-arrow">
            {showCinemaPicker ? <Icon name="chevronDown" size={14} style={{transform:"rotate(180deg)"}}/> : <Icon name="chevronDown" size={14}/>}
          </span>
        </div>
        {showCinemaPicker && (
          <div style={{ maxHeight: 200, overflowY: "auto", borderTop: "1px solid var(--border)" }}>
            {allCinemaNames.map(n => (
              <div
                key={n}
                style={{
                  padding: "12px 16px", fontSize: 14, cursor: "pointer",
                  background: cinema === n ? "rgba(232,67,58,0.08)" : "transparent",
                  color: cinema === n ? "var(--accent)" : "var(--text)",
                  fontWeight: cinema === n ? 700 : 400,
                  borderBottom: "1px solid var(--border)",
                }}
                onClick={() => { setCinema(n); setShowCinemaPicker(false); }}
              >
                {n}
              </div>
            ))}
          </div>
        )}

        {/* date */}
        <div className="combo-picker-item" onClick={() => { setShowDatePicker(p => !p); setShowCinemaPicker(false); }}>
          <div>
            <div className="combo-picker-label">Ngày nhận bắp nước</div>
            <div className="combo-picker-value">{date}</div>
          </div>
          <span className="combo-picker-arrow">
            {showDatePicker ? <Icon name="chevronDown" size={14} style={{transform:"rotate(180deg)"}}/> : <Icon name="chevronDown" size={14}/>}
          </span>
        </div>
        {showDatePicker && (
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {allDates.map(d => (
              <div
                key={d}
                style={{
                  padding: "12px 16px", fontSize: 14, cursor: "pointer",
                  background: date === d ? "rgba(232,67,58,0.08)" : "transparent",
                  color: date === d ? "var(--accent)" : "var(--text)",
                  fontWeight: date === d ? 700 : 400,
                  borderBottom: "1px solid var(--border)",
                }}
                onClick={() => { setDate(d); setShowDatePicker(false); }}
              >
                {d}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* category filter */}
      <div className="combo-filter-row" style={{ marginTop: 16 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`combo-filter-btn${category === c.id ? " active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* combo grid */}
      <div className="combo-grid">
        {visible.map(combo => (
          <div key={combo.id} className="combo-card">
            <div className="combo-card-img">{combo.icon}</div>
            <div className="combo-card-body">
              <div className="combo-card-name">{combo.name}</div>
              <div className="combo-card-desc">{combo.desc}</div>
              <div className="combo-card-price">
                {combo.price.toLocaleString("vi-VN")}đ
              </div>
              <button style={{
                marginTop: 8, width: "100%", padding: "8px",
                background: "var(--accent)", color: "white",
                fontSize: 12, fontWeight: 700,
                borderRadius: "var(--radius-sm)",
              }}>
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
}

export default ComboPage;
