import { useState, useEffect } from "react";
import { PAGE } from "../constants/app";
import { loadWallet, loadTickets } from "../data/mockData";
import Icon from "../components/common/Icon";

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

const RANK_LEVELS = [
  { name: "Tập Sự",    minTickets: 0,  color: "#888" },
  { name: "Thành Viên",minTickets: 5,  color: "#3b82f6" },
  { name: "Bạc",       minTickets: 15, color: "#94a3b8" },
  { name: "Vàng",      minTickets: 30, color: "#f5a623" },
  { name: "Kim Cương", minTickets: 60, color: "#38bdf8" },
];

function getRank(count) {
  let r = RANK_LEVELS[0];
  for (const lvl of RANK_LEVELS) { if (count >= lvl.minTickets) r = lvl; }
  return r;
}

/* ── Settings Modal ── */
function SettingsModal({ user, onClose, onLogout }) {
  const [name,  setName]  = useState(user?.name  || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = { ...user, name, phone };
    localStorage.setItem("hn_user", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(updated); }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">Cài đặt tài khoản</div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:6 }}>Họ và tên</div>
          <input
            style={{
              width:"100%", background:"var(--bg-card)", border:"1px solid var(--border)",
              borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14, color:"var(--text)",
              outline:"none",
            }}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nhập họ tên..."
          />
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:6 }}>Email</div>
          <input
            style={{
              width:"100%", background:"var(--bg-elevated)", border:"1px solid var(--border)",
              borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14,
              color:"var(--text-muted)", outline:"none",
            }}
            value={user?.email || ""}
            disabled
          />
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>Email không thể thay đổi</div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:6 }}>Số điện thoại</div>
          <input
            style={{
              width:"100%", background:"var(--bg-card)", border:"1px solid var(--border)",
              borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14, color:"var(--text)",
              outline:"none",
            }}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0901234567"
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            width:"100%", padding:13,
            background: saved ? "var(--green)" : "var(--accent)",
            color:"white", borderRadius:"var(--radius-sm)",
            fontWeight:700, fontSize:14, marginBottom:10,
            transition:"background 0.2s",
          }}
        >
          {saved ? "✓ Đã lưu!" : "Lưu thay đổi"}
        </button>

        {/* Đăng xuất */}
        <button
          onClick={() => { onClose(); onLogout(); }}
          style={{
            width:"100%", padding:13,
            background:"rgba(239,68,68,0.1)", color:"var(--red)",
            border:"1px solid rgba(239,68,68,0.3)",
            borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:14,
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

function ProfilePage({ onNavigate, user, onLogout }) {
  const [wallet, setWallet]   = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentUser, setCurrentUser]   = useState(user);
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    setWallet(loadWallet());
    setTickets(loadTickets());
  }, []);

  // Sync nếu user prop thay đổi từ ngoài
  useEffect(() => { setCurrentUser(user); }, [user]);

  const handleSettingsClose = (updatedUser) => {
    if (updatedUser) setCurrentUser(updatedUser);
    setShowSettings(false);
  };

  const activeTickets   = tickets.filter(t => t.status === "active");
  const usedTickets     = tickets.filter(t => t.status === "used");
  const refundedTickets = tickets.filter(t => t.status === "refunded");
  const rank    = getRank(tickets.length);
  const nextRank = RANK_LEVELS[RANK_LEVELS.indexOf(rank) + 1];
  const progressPct = nextRank
    ? Math.min(100, ((tickets.length - rank.minTickets) / (nextRank.minTickets - rank.minTickets)) * 100)
    : 100;

  /* ── Chưa đăng nhập ── */
  if (!isLoggedIn) {
    return (
      <div className="profile-page page-scroll">
        <div className="top-bar">
          <span className="top-bar-title" style={{ marginRight:0 }}>Trang của tôi</span>
        </div>

        <div style={{
          background:"linear-gradient(160deg, #2a0a0a 0%, #1a0808 60%, var(--bg) 100%)",
          padding:"32px 16px",
          display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:12,
        }}>
          <div style={{
            width:80, height:80, borderRadius:"50%",
            background:"var(--bg-elevated)", border:"2px solid var(--accent)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:40,
          }}>👤</div>
          <div style={{ fontSize:18, fontWeight:800, color:"var(--text)" }}>
            Đăng nhập để xem<br />trang của bạn
          </div>
          <div style={{ fontSize:13, color:"var(--text-sub)", maxWidth:260, lineHeight:1.5 }}>
            Theo dõi lịch sử đặt vé, quản lý ví tiền và nhận ưu đãi độc quyền
          </div>
          <button className="profile-action-btn" onClick={() => onNavigate(PAGE.AUTH)}>
            Đăng nhập ngay
          </button>
          <button
            style={{ fontSize:13, color:"var(--text-sub)" }}
            onClick={() => onNavigate(PAGE.AUTH)}
          >
            Chưa có tài khoản? <span style={{ color:"var(--accent)", fontWeight:700 }}>Đăng ký</span>
          </button>
        </div>

        {/* Quick links */}
        <div style={{ padding:"16px 16px 0" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"var(--text-sub)", marginBottom:10 }}>
            Truy cập nhanh
          </div>
          {[
            { icon:"💳", label:"Ví H&N Cinema",   sub: wallet ? `Số dư: ${fmt(wallet.balance)}` : "Nạp tiền & xem lịch sử", page: PAGE.WALLET },
            { icon:"🎫", label:"Lịch sử vé",       sub:`${tickets.length} vé (${activeTickets.length} còn hiệu lực)`, page: PAGE.TICKET_HISTORY },
          ].map(item => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={{
                display:"flex", alignItems:"center", gap:14,
                width:"100%", padding:"14px 0",
                borderBottom:"1px solid var(--border)", textAlign:"left",
              }}
            >
              <div style={{
                width:44, height:44, borderRadius:"var(--radius-sm)",
                background:"var(--bg-card)", border:"1px solid var(--border)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
              }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>{item.label}</div>
                <div style={{ fontSize:12, color:"var(--text-sub)", marginTop:2 }}>{item.sub}</div>
              </div>
              <Icon name="chevronRight" size={16} color="var(--text-muted)" />
            </button>
          ))}
        </div>

        <div className="profile-empty">
          <div className="profile-empty-icon">🎫</div>
          <div className="profile-empty-title">Chưa có hoạt động nào</div>
          <div className="profile-empty-sub">
            Đặt vé phim đầu tiên để bắt đầu hành trình điểm thưởng!
          </div>
          <button className="profile-action-btn" onClick={() => onNavigate(PAGE.HOME)}>
            Chọn phim
          </button>
        </div>
      </div>
    );
  }

  /* ── Đã đăng nhập ── */
  return (
    <div className="profile-page page-scroll">
      <div className="top-bar">
        <span className="top-bar-title" style={{ marginRight:0 }}>Trang của tôi</span>
        <button
          className="top-bar-icon-btn"
          onClick={() => setShowSettings(true)}
          title="Cài đặt"
        >
          <Icon name="settings" size={18} />
        </button>
      </div>

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-user-row">
          <div className="profile-avatar" style={{ fontSize:32 }}>
            {currentUser.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="profile-name">{currentUser.name || currentUser.email}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{currentUser.email}</div>
            <span className="profile-rank" style={{ borderColor:rank.color, color:rank.color, marginTop:4, display:"inline-flex" }}>
              🏅 {rank.name}
            </span>
          </div>
        </div>
        <div className="profile-points-bar">
          <div className="profile-points-label">
            <span>Đã xem {tickets.length} vé</span>
            {nextRank && <b style={{ color:rank.color }}>Cần {nextRank.minTickets - tickets.length} vé lên {nextRank.name}</b>}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width:`${progressPct}%`, background:rank.color }} />
          </div>
          <div className="progress-labels">
            <span>{rank.name}</span>
            {nextRank && <span>{nextRank.name}</span>}
          </div>
        </div>
      </div>

      {/* Wallet */}
      <button
        onClick={() => onNavigate(PAGE.WALLET)}
        style={{
          display:"flex", alignItems:"center", gap:14,
          margin:"16px 16px 0", padding:"16px",
          background:"var(--bg-card)", border:"1px solid var(--border)",
          borderRadius:"var(--radius)", width:"calc(100% - 32px)", textAlign:"left",
        }}
      >
        <div style={{
          width:48, height:48, borderRadius:"var(--radius-sm)",
          background:"rgba(232,67,58,0.15)", display:"flex",
          alignItems:"center", justifyContent:"center", fontSize:24,
        }}>💳</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>Ví H&N Cinema</div>
          <div style={{ fontSize:18, fontWeight:900, color:"var(--accent)", marginTop:2 }}>
            {wallet ? fmt(wallet.balance) : "..."}
          </div>
        </div>
        <Icon name="chevronRight" size={16} color="var(--text-muted)" />
      </button>

      {/* Quick stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, padding:"16px 16px 0" }}>
        {[
          { label:"Còn hiệu lực", value:activeTickets.length,   color:"var(--green)" },
          { label:"Đã sử dụng",   value:usedTickets.length,     color:"var(--text-sub)" },
          { label:"Đã hoàn",      value:refundedTickets.length, color:"#60a5fa" },
        ].map(s => (
          <div key={s.label} style={{
            background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"var(--radius-sm)", padding:"12px 10px", textAlign:"center",
          }}>
            <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:"var(--text-muted)", marginTop:4, lineHeight:1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ticket history link */}
      <button
        onClick={() => onNavigate(PAGE.TICKET_HISTORY)}
        style={{
          display:"flex", alignItems:"center", gap:14,
          margin:"12px 16px 0", padding:"14px 16px",
          background:"var(--bg-card)", border:"1px solid var(--border)",
          borderRadius:"var(--radius)", width:"calc(100% - 32px)", textAlign:"left",
        }}
      >
        <div style={{
          width:44, height:44, borderRadius:"var(--radius-sm)",
          background:"rgba(59,130,246,0.12)", display:"flex",
          alignItems:"center", justifyContent:"center", fontSize:22,
        }}>🎫</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>Lịch sử vé</div>
          <div style={{ fontSize:12, color:"var(--text-sub)", marginTop:2 }}>
            Xem vé, QR code và yêu cầu hoàn vé
          </div>
        </div>
        <Icon name="chevronRight" size={16} color="var(--text-muted)" />
      </button>

      <div style={{ height:24 }} />

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          user={currentUser}
          onClose={handleSettingsClose}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}

export default ProfilePage;
