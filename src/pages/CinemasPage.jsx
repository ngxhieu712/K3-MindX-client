import { useEffect, useState } from "react";
import { REQUEST_STATUS, PAGE } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import { nearbyTheaters } from "../data/mockData";
import Icon from "../components/common/Icon";

function CinemasPage({ cinema, onNavigate }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);

    (async () => {
      // Chưa có rạp nào được chọn trước đó (trang này hiện chưa có lối vào từ
      // menu) -> mặc định lấy rạp đầu tiên trong danh sách thật, tránh trắng trang.
      let cinemaId = cinema?.id;
      if (!cinemaId) {
        const cinemas = await cinemaService.getCinemas();
        cinemaId = cinemas[0]?.id;
      }
      if (!cinemaId) { if (alive) setStatus(REQUEST_STATUS.ERROR); return; }

      const res = await cinemaService.getCinemaDetail(cinemaId);
      if (alive) { setData(res); setStatus(REQUEST_STATUS.SUCCESS); }
    })();

    return () => { alive = false; };
  }, [cinema]);

  if (status === REQUEST_STATUS.LOADING || !data) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải thông tin rạp...
        </div>
      </div>
    );
  }

  return (
    <div className="cinema-detail-page page-scroll">
      {/* top bar */}
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.CHAINS)}>
          <Icon name="back" size={20} />
        </button>
        <span className="top-bar-title">{data.name}</span>
      </div>

      {/* hero image (chỉ hiện nếu có ảnh thật) */}
      {data.image && <img src={data.image} alt={data.name} className="cinema-detail-image" />}

      <div className="cinema-detail-body">
        <div className="cinema-detail-name">{data.name}</div>
        {Array.isArray(data.description)
          ? data.description.map((p, i) => (
              <p key={i} className="cinema-detail-desc">{p}</p>
            ))
          : <p className="cinema-detail-desc">{data.description}</p>
        }

        <button
          className="booking-continue-btn"
          style={{ width: "100%", borderRadius: "var(--radius-sm)", padding: "14px" }}
          onClick={() => onNavigate(PAGE.SHOWTIMES)}
        >
          Xem lịch chiếu
        </button>

        {/* nearby */}
        {nearbyTheaters?.length > 0 && (
          <>
            <div className="cinema-detail-section">📍 Rạp gần đây</div>
            {nearbyTheaters.map((t, i) => (
              <div key={i} style={{
                padding: "12px 0", borderBottom: "1px solid var(--border)",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-sm)",
                  background: "var(--bg-elevated)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>🎬</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 2 }}>{t.address}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>📞 {t.hotline}</div>
                </div>
                <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>
                  {t.distance}
                </span>
              </div>
            ))}
          </>
        )}

        {/* hot movies */}
        {data.hotMovies?.length > 0 && (
          <>
            <div className="cinema-detail-section">🔥 Phim đang hot</div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
              {data.hotMovies.map(m => (
                <div key={m.id} style={{ flexShrink: 0, width: 90 }}>
                  <img
                    src={m.poster}
                    alt={m.title}
                    style={{ width: 90, height: 126, objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                  />
                  <div style={{ fontSize: 11, color: "var(--text)", fontWeight: 700, marginTop: 4,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {m.title}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CinemasPage;
