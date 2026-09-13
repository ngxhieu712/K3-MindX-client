import { useState, useEffect } from "react";
import { PAGE, REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import { REFUND_FEE_PERCENT } from "../data/mockData";
import Icon from "../components/common/Icon";

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

const STATUS_CONFIG = {
  active:         { label: "Còn hiệu lực",   badge: "badge-green" },
  used:           { label: "Đã sử dụng",     badge: "badge-gray" },
  refunded:       { label: "Đã hoàn",        badge: "badge-blue" },
  refund_pending: { label: "Đang chờ duyệt", badge: "badge-gold" },
};

/* ── QR Ticket Modal (trang trí — vé thật đã lưu trên server) ── */
function QRModal({ ticket, onClose }) {
  const seed = ticket.qrData.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 25 * 25 }, (_, i) => {
    const x = i % 25; const y = Math.floor(i / 25);
    if ((x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17)) return true;
    return ((seed * (i + 1) * 31 + x * 17 + y * 13) % 3) === 0;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" style={{ maxWidth:380 }} onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:800, color:"var(--text)", marginBottom:4 }}>Vé điện tử</div>
          <div style={{ fontSize:12, color:"var(--text-sub)" }}>{ticket.bookingId}</div>
        </div>

        <div style={{
          background:"white", borderRadius:"var(--radius)", padding:16,
          margin:"0 auto 16px", width:200, height:200,
          display:"grid", gridTemplateColumns:"repeat(25,1fr)", gap:0,
        }}>
          {cells.map((filled, i) => (
            <div key={i} style={{
              background: filled ? "#000" : "#fff",
              aspectRatio:"1",
            }} />
          ))}
        </div>

        <div style={{ fontSize:11, color:"var(--text-muted)", textAlign:"center", marginBottom:16, fontFamily:"monospace", letterSpacing:1 }}>
          {ticket.qrData}
        </div>

        <div style={{ background:"var(--bg-card)", borderRadius:"var(--radius-sm)", padding:"14px 16px", marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:800, color:"var(--text)", marginBottom:10 }}>{ticket.movie}</div>
          {[
            ["🏛", ticket.cinema],
            ["🎬", [ticket.room, ticket.format].filter(Boolean).join(" · ")],
            ["📅", `${ticket.date} · ${ticket.time}`],
            ["💺", ticket.seats.join(", ")],
            ["💰", fmt(ticket.total)],
          ].map(([icon, val]) => (
            <div key={icon} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13 }}>
              <span>{icon}</span>
              <span style={{ color:"var(--text-sub)" }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize:11, color:"var(--text-muted)", textAlign:"center", marginBottom:12 }}>
          Xuất trình mã QR này tại quầy soát vé
        </div>
        <button
          className="booking-continue-btn"
          style={{ width:"100%", borderRadius:"var(--radius-sm)", padding:12 }}
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

/* ── Refund Request Modal ── */
function RefundModal({ ticket, onClose, onConfirm, submitting }) {
  const fee = Math.round(ticket.total * REFUND_FEE_PERCENT / 100);
  const refundAmount = ticket.total - fee;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" style={{ maxWidth:380 }} onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">Yêu cầu hoàn vé</div>

        <div style={{ background:"var(--bg-card)", borderRadius:"var(--radius-sm)", padding:14, marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:8 }}>{ticket.movie}</div>
          <div style={{ fontSize:12, color:"var(--text-sub)" }}>
            {ticket.cinema} · {ticket.date} · {ticket.time}
          </div>
          <div style={{ fontSize:12, color:"var(--text-sub)" }}>Ghế: {ticket.seats.join(", ")}</div>
        </div>

        <div style={{ background:"var(--bg-card)", borderRadius:"var(--radius-sm)", padding:14, marginBottom:16 }}>
          {[
            { label:"Tiền vé gốc",                value: fmt(ticket.total),  color:"var(--text)" },
            { label:`Phí hoàn vé (${REFUND_FEE_PERCENT}%)`, value:`-${fmt(fee)}`, color:"var(--red)" },
          ].map(r => (
            <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
              <span style={{ color:"var(--text-sub)" }}>{r.label}</span>
              <span style={{ fontWeight:700, color:r.color }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0 0", fontSize:15, fontWeight:800 }}>
            <span style={{ color:"var(--text)" }}>Dự kiến hoàn về ví</span>
            <span style={{ color:"var(--green)" }}>{fmt(refundAmount)}</span>
          </div>
        </div>

        <div style={{
          background:"rgba(245,166,35,0.1)", border:"1px solid rgba(245,166,35,0.3)",
          borderRadius:"var(--radius-sm)", padding:"10px 14px", marginBottom:16,
          fontSize:12, color:"var(--gold)",
        }}>
          ⚠️ Yêu cầu sẽ được quản trị viên xét duyệt. Tiền chỉ về ví sau khi yêu cầu được duyệt.
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <button
            onClick={onClose}
            style={{
              flex:1, padding:13,
              background:"var(--bg-elevated)", border:"1px solid var(--border)",
              borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:14, color:"var(--text-sub)",
            }}
          >
            Hủy
          </button>
          <button
            disabled={submitting}
            onClick={onConfirm}
            style={{
              flex:1, padding:13,
              background:"var(--accent)", color:"white",
              borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:14,
            }}
          >
            {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
function TicketHistoryPage({ onNavigate }) {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [filter, setFilter] = useState("all");
  const [qrTicket, setQrTicket] = useState(null);
  const [refundTicket, setRefundTicket] = useState(null);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const loadTickets = () => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getMyTickets()
      .then(res => { if (alive) { setTickets(res); setStatus(REQUEST_STATUS.SUCCESS); } })
      .catch(() => { if (alive) setStatus(REQUEST_STATUS.ERROR); });
    return () => { alive = false; };
  };

  useEffect(() => loadTickets(), []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleRefundRequest = async () => {
    if (!refundTicket || refundSubmitting) return;
    setRefundSubmitting(true);
    try {
      await cinemaService.requestRefund(refundTicket.id);
      setTickets(ts => ts.map(t => t.id === refundTicket.id ? { ...t, status: "refund_pending" } : t));
      setRefundTicket(null);
      showToast("Đã gửi yêu cầu hoàn vé, chờ quản trị viên duyệt");
    } catch (err) {
      showToast(err.message || "Gửi yêu cầu hoàn vé thất bại");
    } finally {
      setRefundSubmitting(false);
    }
  };

  const filtered = tickets.filter(t => filter === "all" || t.status === filter);

  if (status === REQUEST_STATUS.LOADING) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải lịch sử vé...
        </div>
      </div>
    );
  }

  if (status === REQUEST_STATUS.ERROR) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>😕 Không tải được lịch sử vé.</div>
        <button className="booking-continue-btn" onClick={loadTickets}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="page-scroll">
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.PROFILE)}>
          <Icon name="back" size={20} />
        </button>
        <span className="top-bar-title">Lịch sử vé</span>
        <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.WALLET)}>
          <Icon name="ticket" size={18} />
        </button>
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:8, padding:"12px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {[
          { id:"all",             label:"Tất cả" },
          { id:"active",          label:"Còn hiệu lực" },
          { id:"used",            label:"Đã dùng" },
          { id:"refunded",        label:"Đã hoàn" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              flexShrink:0, padding:"6px 14px",
              borderRadius:"var(--radius-full)",
              border:`1px solid ${filter===f.id ? "var(--accent)" : "var(--border)"}`,
              background: filter===f.id ? "rgba(232,67,58,0.1)" : "var(--bg-card)",
              color: filter===f.id ? "var(--accent)" : "var(--text-sub)",
              fontWeight:700, fontSize:12,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div style={{ padding:"12px 16px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"60px 0", textAlign:"center", color:"var(--text-muted)" }}>
            <div style={{ fontSize:48, marginBottom:12, opacity:0.3 }}>🎫</div>
            <div>Không có vé nào</div>
          </div>
        ) : filtered.map(ticket => {
          const st = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.used;
          return (
            <div key={ticket.id} style={{
              background:"var(--bg-card)", border:"1px solid var(--border)",
              borderRadius:"var(--radius)", marginBottom:12, overflow:"hidden",
            }}>
              <div style={{ display:"flex", gap:12, padding:"14px 14px 10px" }}>
                <img
                  src={ticket.poster}
                  alt={ticket.movie}
                  style={{ width:52, height:74, objectFit:"cover", borderRadius:"var(--radius-sm)", flexShrink:0 }}
                  onError={e => e.target.style.display="none"}
                />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"var(--text)", marginBottom:4,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {ticket.movie}
                  </div>
                  <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:2 }}>{ticket.cinema}</div>
                  <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:6 }}>
                    {ticket.date} · {ticket.time}{ticket.room ? ` · ${ticket.room}` : ""}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:"2px 8px",
                      borderRadius:"var(--radius-full)",
                      background: ticket.status==="active" ? "rgba(34,197,94,0.15)"
                                : ticket.status==="refunded" ? "rgba(59,130,246,0.15)"
                                : "var(--bg-elevated)",
                      color: ticket.status==="active" ? "var(--green)"
                           : ticket.status==="refunded" ? "#60a5fa"
                           : "var(--text-muted)",
                    }}>
                      {st.label}
                    </span>
                    <span style={{ fontSize:11, color:"var(--text-muted)" }}>
                      Ghế: {ticket.seats.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop:"1px dashed var(--border)", margin:"0 14px", position:"relative" }}>
                <div style={{ position:"absolute", left:-24, top:-10, width:20, height:20, borderRadius:"50%", background:"var(--bg)" }} />
                <div style={{ position:"absolute", right:-24, top:-10, width:20, height:20, borderRadius:"50%", background:"var(--bg)" }} />
              </div>

              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px" }}>
                <div>
                  <div style={{ fontSize:12, color:"var(--text-muted)" }}>Tổng tiền</div>
                  <div style={{ fontSize:16, fontWeight:800, color:"var(--accent)" }}>{fmt(ticket.total)}</div>
                  {ticket.status==="refunded" && ticket.refundAmount != null && (
                    <div style={{ fontSize:11, color:"var(--green)", marginTop:2 }}>
                      Đã hoàn {fmt(ticket.refundAmount)}
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button
                    onClick={() => setQrTicket(ticket)}
                    style={{
                      padding:"8px 14px",
                      background:"var(--accent)", color:"white",
                      borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:12,
                    }}
                  >
                    Xem QR
                  </button>
                  {ticket.status === "active" && (
                    <button
                      onClick={() => setRefundTicket(ticket)}
                      style={{
                        padding:"8px 14px",
                        background:"rgba(239,68,68,0.1)", color:"var(--red)",
                        border:"1px solid rgba(239,68,68,0.3)",
                        borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:12,
                      }}
                    >
                      Hoàn vé
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {qrTicket && <QRModal ticket={qrTicket} onClose={() => setQrTicket(null)} />}
      {refundTicket && (
        <RefundModal
          ticket={refundTicket}
          submitting={refundSubmitting}
          onClose={() => setRefundTicket(null)}
          onConfirm={handleRefundRequest}
        />
      )}

      {toast && (
        <div style={{
          position:"fixed", bottom:"calc(var(--nav-h) + 16px)", left:"50%", transform:"translateX(-50%)",
          background:"var(--green)", color:"white", padding:"10px 20px",
          borderRadius:"var(--radius-full)", fontSize:13, fontWeight:700,
          boxShadow:"0 4px 16px rgba(0,0,0,0.3)", zIndex:300, whiteSpace:"nowrap",
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

export default TicketHistoryPage;
