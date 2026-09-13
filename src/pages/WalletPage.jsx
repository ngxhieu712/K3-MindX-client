import { useState, useEffect } from "react";
import { PAGE, REQUEST_STATUS } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import Icon from "../components/common/Icon";

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

const TOP_UP_OPTIONS = [50000, 100000, 200000, 500000];

const TYPE_CONFIG = {
  topup:   { label: "Nạp tiền",    color: "var(--green)",  sign: "+" },
  payment: { label: "Thanh toán",  color: "var(--red)",    sign: "-" },
  refund:  { label: "Hoàn tiền",   color: "#38bdf8",       sign: "+" },
};

/* ── Modal nạp tiền: bước 1 chọn số tiền, bước 2 hiện QR thật + nút demo ── */
function TopUpModal({ onClose, onTopupSuccess }) {
  const [step, setStep] = useState("amount"); // "amount" | "qr"
  const [amount, setAmount] = useState(100000);
  const [custom, setCustom] = useState("");
  const [qr, setQr] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [confirmStatus, setConfirmStatus] = useState(REQUEST_STATUS.IDLE);
  const [error, setError] = useState("");

  const finalAmount = custom ? Number(custom.replace(/\D/g, "")) : amount;

  const handleShowQr = async () => {
    if (finalAmount < 10000 || status === REQUEST_STATUS.LOADING) return;
    setStatus(REQUEST_STATUS.LOADING);
    setError("");
    try {
      const res = await cinemaService.requestWalletTopupQr(finalAmount);
      setQr(res);
      setStep("qr");
      setStatus(REQUEST_STATUS.SUCCESS);
    } catch (err) {
      setStatus(REQUEST_STATUS.ERROR);
      setError(err.message || "Không tạo được mã QR nạp tiền");
    }
  };

  const handleConfirmDemo = async () => {
    if (confirmStatus === REQUEST_STATUS.LOADING) return;
    setConfirmStatus(REQUEST_STATUS.LOADING);
    setError("");
    try {
      await cinemaService.confirmWalletTopup(finalAmount);
      setConfirmStatus(REQUEST_STATUS.SUCCESS);
      onTopupSuccess(finalAmount);
    } catch (err) {
      setConfirmStatus(REQUEST_STATUS.ERROR);
      setError(err.message || "Xác nhận nạp tiền thất bại");
    }
  };

  if (step === "qr" && qr) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="booking-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="modal-title">Quét mã để nạp tiền</div>

          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:13, color:"var(--text-sub)", marginBottom:4 }}>🏦 {qr.bankName}</div>
            <div style={{ fontSize:22, fontWeight:900, color:"var(--accent)" }}>{fmt(qr.amount)}</div>
          </div>

          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <img src={qr.qrImageUrl} alt="VietQR" width={200} style={{ borderRadius:"var(--radius-sm)" }} />
          </div>

          <div style={{ background:"var(--bg-card)", borderRadius:"var(--radius-sm)", padding:14, marginBottom:16 }}>
            {[
              ["Số tài khoản", qr.accountNumber],
              ["Chủ tài khoản", qr.accountName],
              ["Nội dung CK", qr.transferContent],
            ].map(([label, value]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", fontSize:13 }}>
                <span style={{ color:"var(--text-sub)" }}>{label}</span>
                <span style={{ fontWeight:700, color:"var(--text)", textAlign:"right", maxWidth:"60%" }}>{value}</span>
              </div>
            ))}
          </div>

          {error && <div style={{ color:"var(--red)", fontSize:12, textAlign:"center", marginBottom:12 }}>⚠️ {error}</div>}

          <button
            className="booking-continue-btn"
            style={{ width:"100%", borderRadius:"var(--radius-sm)", padding:14, marginBottom:8, background:"var(--green)" }}
            disabled={confirmStatus === REQUEST_STATUS.LOADING}
            onClick={handleConfirmDemo}
          >
            {confirmStatus === REQUEST_STATUS.LOADING ? "Đang xác nhận..." : "✓ Mô phỏng đã chuyển khoản (Demo)"}
          </button>
          <button
            onClick={onClose}
            style={{
              width:"100%", padding:12,
              background:"var(--bg-elevated)", border:"1px solid var(--border)",
              borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:13, color:"var(--text-sub)",
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">Nạp tiền vào ví</div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {TOP_UP_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { setAmount(opt); setCustom(""); }}
              style={{
                flex:"1 0 calc(50% - 4px)",
                padding:"10px 0",
                borderRadius:"var(--radius-sm)",
                border:`2px solid ${amount===opt && !custom ? "var(--accent)" : "var(--border)"}`,
                background: amount===opt && !custom ? "rgba(232,67,58,0.1)" : "var(--bg-card)",
                color: amount===opt && !custom ? "var(--accent)" : "var(--text-sub)",
                fontWeight:700, fontSize:14,
              }}
            >
              {opt.toLocaleString("vi-VN")}đ
            </button>
          ))}
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:6 }}>Hoặc nhập số tiền khác (tối thiểu 10.000đ)</div>
          <input
            style={{
              width:"100%", background:"var(--bg-card)", border:"1px solid var(--border)",
              borderRadius:"var(--radius-sm)", padding:"12px 14px", fontSize:15,
              color:"var(--text)", outline:"none",
            }}
            placeholder="VD: 150000"
            value={custom}
            onChange={e => setCustom(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {finalAmount > 0 && (
          <div style={{
            background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"var(--radius-sm)", padding:"12px 16px",
            marginBottom:16, display:"flex", justifyContent:"space-between",
          }}>
            <span style={{ color:"var(--text-sub)", fontSize:13 }}>Số tiền nạp</span>
            <span style={{ fontWeight:800, fontSize:16, color:"var(--green)" }}>
              +{finalAmount.toLocaleString("vi-VN")}đ
            </span>
          </div>
        )}

        {error && <div style={{ color:"var(--red)", fontSize:12, textAlign:"center", marginBottom:12 }}>⚠️ {error}</div>}

        <button
          className="booking-continue-btn"
          style={{ width:"100%", borderRadius:"var(--radius-sm)", padding:"14px", fontSize:15 }}
          disabled={finalAmount < 10000 || status === REQUEST_STATUS.LOADING}
          onClick={handleShowQr}
        >
          {status === REQUEST_STATUS.LOADING ? "Đang tạo mã QR..." : `Nạp ${finalAmount > 0 ? finalAmount.toLocaleString("vi-VN") + "đ" : ""}`}
        </button>
      </div>
    </div>
  );
}

function WalletPage({ onNavigate }) {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
  const [showTopUp, setShowTopUp] = useState(false);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("all");

  const loadWalletData = () => {
    let alive = true;
    setStatus(REQUEST_STATUS.LOADING);
    cinemaService.getWallet()
      .then(res => { if (alive) { setWallet(res); setStatus(REQUEST_STATUS.SUCCESS); } })
      .catch(() => { if (alive) setStatus(REQUEST_STATUS.ERROR); });
    return () => { alive = false; };
  };

  useEffect(() => loadWalletData(), []);

  const handleTopupSuccess = (amount) => {
    setShowTopUp(false);
    loadWalletData(); // tải lại ví thật từ server thay vì tự cộng ở client
    setToast(`Nạp thành công ${amount.toLocaleString("vi-VN")}đ`);
    setTimeout(() => setToast(""), 3000);
  };

  if (status === REQUEST_STATUS.LOADING || !wallet) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60 }}>
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải ví...
        </div>
      </div>
    );
  }

  if (status === REQUEST_STATUS.ERROR) {
    return (
      <div className="page-scroll" style={{ paddingTop: 60, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>😕 Không tải được ví.</div>
        <button className="booking-continue-btn" onClick={loadWalletData}>Thử lại</button>
      </div>
    );
  }

  const filtered = wallet.transactions.filter(t =>
    filter === "all" || t.type === filter
  );

  return (
    <div className="page-scroll">
      <div className="top-bar">
        <button className="top-bar-icon-btn" onClick={() => onNavigate(PAGE.PROFILE)}>
          <Icon name="back" size={20} />
        </button>
        <span className="top-bar-title">Ví H&N Cinema</span>
      </div>

      <div style={{
        margin:"16px 16px 0",
        background:"linear-gradient(135deg, #1a0a0a 0%, #2a1010 100%)",
        border:"1px solid rgba(232,67,58,0.3)",
        borderRadius:"var(--radius-lg)", padding:"24px 20px",
      }}>
        <div style={{ fontSize:13, color:"var(--text-sub)", marginBottom:8 }}>Số dư khả dụng</div>
        <div style={{ fontSize:32, fontWeight:900, color:"var(--text)", marginBottom:20 }}>
          {fmt(wallet.balance)}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button
            onClick={() => setShowTopUp(true)}
            style={{
              flex:1, padding:"12px 0",
              background:"var(--accent)", color:"white",
              borderRadius:"var(--radius-sm)", fontWeight:700, fontSize:14,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}
          >
            + Nạp tiền
          </button>
          <button
            onClick={() => onNavigate(PAGE.TICKET_HISTORY)}
            style={{
              flex:1, padding:"12px 0",
              background:"var(--bg-elevated)", color:"var(--text-sub)",
              border:"1px solid var(--border)", borderRadius:"var(--radius-sm)",
              fontWeight:700, fontSize:14,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}
          >
            Lịch sử vé
          </button>
        </div>
      </div>

      <div style={{ display:"flex", gap:8, padding:"16px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {[
          { id:"all",     label:"Tất cả" },
          { id:"topup",   label:"Nạp tiền" },
          { id:"payment", label:"Thanh toán" },
          { id:"refund",  label:"Hoàn tiền" },
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

      <div style={{ padding:"12px 0" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"var(--text-sub)", padding:"0 16px 10px" }}>
          Lịch sử giao dịch ({filtered.length})
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding:"40px 16px", textAlign:"center", color:"var(--text-muted)" }}>
            Chưa có giao dịch nào
          </div>
        ) : filtered.map(tx => {
          const cfg = TYPE_CONFIG[tx.type] ?? { label: tx.type, color:"var(--text)", sign:"" };
          const isPos = tx.amount > 0;
          return (
            <div key={tx.id} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"12px 16px", borderBottom:"1px solid var(--border)",
            }}>
              <div style={{
                width:40, height:40, borderRadius:"var(--radius-sm)",
                background: isPos ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, flexShrink:0,
              }}>
                {tx.type==="topup" ? "💳" : tx.type==="refund" ? "↩️" : "🎟️"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{cfg.label}</div>
                <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {tx.desc}
                </div>
                <div style={{ fontSize:10, color:"var(--text-muted)", marginTop:2 }}>{tx.date}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:15, fontWeight:800, color: isPos ? "var(--green)" : "var(--red)" }}>
                  {isPos ? "+" : ""}{Math.abs(tx.amount).toLocaleString("vi-VN")}đ
                </div>
                <div style={{ fontSize:10, color:tx.status==="success" ? "var(--green)" : "var(--text-muted)", marginTop:2 }}>
                  {tx.status==="success" ? "✓ Thành công" : "Đang xử lý"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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

      {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} onTopupSuccess={handleTopupSuccess} />}
    </div>
  );
}

export default WalletPage;
