import { useState } from "react";
import { chains } from "../data/mockData";
import { PAGE } from "../constants/app";
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

function ComboPage({ onNavigate }) {
  const [category, setCategory] = useState("all");
  const [cinema, setCinema] = useState(allCinemaNames[0]);
  const [date, setDate] = useState(allDates[0]);
  const [showCinemaPicker, setShowCinemaPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const addToCart = (combo) => {
    setCart(c => {
      const existing = c.find(i => i.id === combo.id);
      if (existing) return c.map(i => i.id===combo.id ? {...i, qty:i.qty+1} : i);
      return [...c, { ...combo, qty:1 }];
    });
    setToast(`Đã thêm "${combo.name}" vào giỏ!`);
    setTimeout(() => setToast(""), 2000);
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const visible = COMBOS.filter(c => category === "all" || c.category === category);

  return (
    <div className="combo-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <span className="top-bar-title" style={{ marginRight: 0 }}>Mua bắp nước</span>
        <button className="top-bar-icon-btn" onClick={() => onNavigate?.(PAGE.HOME)}>
          <Icon name="home" size={18} />
        </button>
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
              }} onClick={() => addToCart(combo)}>
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 16 }} />

      {/* Giỏ hàng bar */}
      {cartCount > 0 && (
        <div style={{
          position:"fixed", bottom:"var(--nav-h)", left:0, right:0,
          background:"var(--bg-surface)", borderTop:"1px solid var(--border)",
          padding:"12px 16px", display:"flex", alignItems:"center", gap:12, zIndex:50,
        }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:"var(--text-sub)" }}>{cartCount} món</div>
            <div style={{ fontSize:16, fontWeight:800, color:"var(--accent)" }}>
              {cartTotal.toLocaleString("vi-VN")}đ
            </div>
          </div>
          <button
            style={{
              background:"var(--accent)", color:"white",
              padding:"10px 20px", borderRadius:"var(--radius-sm)",
              fontWeight:700, fontSize:14,
            }}
            onClick={() => {
              alert(`Đặt ${cartCount} món combo - ${cartTotal.toLocaleString("vi-VN")}đ\n(Chức năng này sẽ tích hợp khi đặt vé)`);
            }}
          >
            Đặt ngay
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:"calc(var(--nav-h) + 70px)", left:"50%", transform:"translateX(-50%)",
          background:"var(--green)", color:"white", padding:"8px 18px",
          borderRadius:"var(--radius-full)", fontSize:13, fontWeight:700,
          boxShadow:"0 4px 16px rgba(0,0,0,0.3)", zIndex:300, whiteSpace:"nowrap",
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

export default ComboPage;
