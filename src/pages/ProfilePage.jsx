import { PAGE } from "../constants/app";
import Icon from "../components/common/Icon";

const RANK_LEVELS = [
  { name: "Tập Sự",  points: 0,    color: "#888" },
  { name: "Thành Viên", points: 500, color: "#3b82f6" },
  { name: "Bạc",    points: 1500,  color: "#94a3b8" },
  { name: "Vàng",   points: 3000,  color: "#f5a623" },
  { name: "Kim Cương", points: 6000, color: "#38bdf8" },
];

function ProfilePage({ onNavigate }) {
  // Mock: not logged in
  const isLoggedIn = false;
  const user = {
    name: "Khách",
    points: 0,
    rank: RANK_LEVELS[0],
    nextRank: RANK_LEVELS[1],
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-page page-scroll">
        {/* top bar */}
        <div className="top-bar">
          <span className="top-bar-title" style={{ marginRight: 0 }}>Trang phim của tôi</span>
          <button className="top-bar-icon-btn"><Icon name="settings" size={18} /></button>
        </div>

        {/* not logged in hero */}
        <div style={{
          background: "linear-gradient(160deg, #2a0a0a 0%, #1a0808 60%, var(--bg) 100%)",
          padding: "32px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "var(--bg-elevated)", border: "2px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 40,
          }}>
            👤
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>
            Đăng nhập để xem<br />trang phim của bạn
          </div>
          <div style={{ fontSize: 13, color: "var(--text-sub)", maxWidth: 260, lineHeight: 1.5 }}>
            Theo dõi lịch sử đặt vé, tích điểm thành viên và nhận ưu đãi độc quyền
          </div>
          <button
            className="profile-action-btn"
            onClick={() => onNavigate(PAGE.AUTH)}
          >
            Đăng nhập ngay
          </button>
          <button
            style={{ fontSize: 13, color: "var(--text-sub)", marginTop: 4 }}
            onClick={() => onNavigate(PAGE.AUTH)}
          >
            Chưa có tài khoản? <span style={{ color: "var(--accent)", fontWeight: 700 }}>Đăng ký</span>
          </button>
        </div>

        {/* saving card */}
        <div className="profile-saving-card">
          <div className="profile-saving-icon">🎟️</div>
          <div className="profile-saving-text">
            <div className="profile-saving-title">Gói tiết kiệm</div>
            <div className="profile-saving-sub">Đu phim mệt nghỉ, giá khởi nghĩ</div>
          </div>
          <button className="profile-saving-btn">Xem ngay</button>
        </div>

        {/* empty state */}
        <div className="profile-empty">
          <div className="profile-empty-icon">🎫</div>
          <div className="profile-empty-title">Bạn chưa có hoạt động nào</div>
          <div className="profile-empty-sub">
            Hãy đánh giá, bình luận và đặt vé để xây dựng trang phim của bạn thật hoành tráng nhé.
          </div>
          <button className="profile-action-btn" onClick={() => onNavigate(PAGE.HOME)}>
            Chọn phim
          </button>
        </div>
      </div>
    );
  }

  // logged-in state (future use)
  const progressPct = Math.min(100,
    ((user.points - user.rank.points) / (user.nextRank.points - user.rank.points)) * 100
  );

  return (
    <div className="profile-page page-scroll">
      <div className="top-bar">
        <span className="top-bar-title" style={{ marginRight: 0 }}>Trang phim của tôi</span>
        <button className="top-bar-icon-btn"><Icon name="settings" size={18} /></button>
      </div>

      <div className="profile-hero">
        <div className="profile-user-row">
          <div className="profile-avatar">👤</div>
          <div>
            <div className="profile-name">{user.name}</div>
            <span className="profile-rank" style={{ borderColor: user.rank.color, color: user.rank.color }}>
              🏅 {user.rank.name}
            </span>
          </div>
        </div>

        <div className="profile-points-bar">
          <div className="profile-points-label">
            <span>Đã tích được</span>
            <b>{user.points.toLocaleString("vi-VN")} điểm</b>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-labels">
            <span>{user.rank.name}</span>
            <span>{user.nextRank.name}</span>
          </div>
          <button className="profile-detail-btn">
            ⓘ Xem chi tiết <span>›</span>
          </button>
        </div>
      </div>

      <div className="profile-saving-card">
        <div className="profile-saving-icon">🎟️</div>
        <div className="profile-saving-text">
          <div className="profile-saving-title">Gói tiết kiệm</div>
          <div className="profile-saving-sub">Đu phim mệt nghỉ, giá khởi nghĩ</div>
        </div>
        <button className="profile-saving-btn">Xem ngay</button>
      </div>

      <div className="profile-empty">
        <div className="profile-empty-icon">🎫</div>
        <div className="profile-empty-title">Chưa có hoạt động nào</div>
        <div className="profile-empty-sub">
          Đặt vé phim đầu tiên để bắt đầu hành trình điểm thưởng của bạn!
        </div>
        <button className="profile-action-btn" onClick={() => onNavigate(PAGE.HOME)}>
          Chọn phim
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
