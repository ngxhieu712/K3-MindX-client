import { PAGE } from "../../constants/app";
import Icon from "../common/Icon";

const TABS = [
  { page: PAGE.HOME,    icon: "film",    label: "Chọn phim" },
  { page: PAGE.CHAINS,  icon: "theater", label: "Chọn rạp" },
  { page: PAGE.COMBO,   icon: "popcorn", label: "Bắp nước" },
  { page: PAGE.MOVIES,  icon: "grid",    label: "Tất cả phim" },
  { page: PAGE.PROFILE, icon: "user",    label: "Tôi", badge: "New" },
];

function Header({ page, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.page}
          className={`nav-tab${page === tab.page ? " active" : ""}`}
          onClick={() => onNavigate(tab.page)}
        >
          <span className="nav-tab-icon">
            <Icon name={tab.icon} size={22} />
          </span>
          <span className="nav-tab-label">{tab.label}</span>
          {tab.badge && <span className="nav-tab-badge">{tab.badge}</span>}
        </button>
      ))}
    </nav>
  );
}

export default Header;
