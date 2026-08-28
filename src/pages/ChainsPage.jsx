import { chains } from "../data/mockData";

function ChainsPage({ onSelectChain }) {
  return (
    <main className="chains-page">
      <div className="chains-hero">
        <div className="chains-hero-text">
          <p className="chains-eyebrow">🎬 ĐẶT VÉ XEM PHIM</p>
          <h1 className="chains-title">Chọn hãng rạp<br /><span className="chains-title-accent">yêu thích của bạn</span></h1>
          <p className="chains-subtitle">Đặt vé tại CGV, Beta, Galaxy, Lotte và nhiều hãng rạp khác — tất cả trong một ứng dụng</p>
        </div>
      </div>

      <div className="chains-content">
        <h2 className="chains-section-title">Hãng rạp phim</h2>
        <div className="chains-grid">
          {chains.map((chain) => (
            <button
              key={chain.id}
              className="chain-card"
              onClick={() => onSelectChain(chain)}
              style={{ "--chain-color": chain.color }}
            >
              <div className="chain-logo-wrap">
                <span className="chain-logo">{chain.logo}</span>
              </div>
              <div className="chain-info">
                <h3 className="chain-name">{chain.name}</h3>
                <p className="chain-desc">{chain.description}</p>
                <p className="chain-count">{chain.cinemas.length} rạp tại Hà Nội</p>
              </div>
              <span className="chain-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ChainsPage;
