import { PAGE, UI_TEXT } from "../../constants/app";

function MarketplaceHeader({ page, onNavigate }) {
  return <><header className="marketplace-header"><div className="marketplace-top"><button className="marketplace-logo" onClick={() => onNavigate(PAGE.MARKETPLACE_HOME)}>ticket<span>hub</span></button><nav>{UI_TEXT.FLIGHT_NAVIGATION.map((label, index) => <button key={label} className={index === 1 && [PAGE.FLIGHT_SEARCH, PAGE.FLIGHT_RESULTS, PAGE.FLIGHT_PASSENGER].includes(page) ? "active" : ""} onClick={() => index === 1 ? onNavigate(PAGE.FLIGHT_SEARCH) : undefined}>{label}</button>)}</nav><div className="marketplace-account"><button onClick={() => onNavigate(PAGE.AUTH)}>Đăng nhập ↪</button><button className="account-primary" onClick={() => onNavigate(PAGE.AUTH)}>Đăng ký</button></div></div><div className="marketplace-services"><button onClick={() => onNavigate(PAGE.MOVIES)}>Vé xem phim</button><button className="active" onClick={() => onNavigate(PAGE.FLIGHT_SEARCH)}>Vé máy bay</button><button>Vé xe khách</button><button>Đưa đón sân bay</button><button>Cho thuê xe</button><button>Hoạt động & Vui chơi</button></div></header></>;
}

export default MarketplaceHeader;
