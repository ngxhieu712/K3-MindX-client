import { useState } from "react";

function VoucherBox({ cinemaName, vouchers, onApply }) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState("");

  // Lọc voucher phù hợp với rạp
  const suggested = vouchers.filter(
    (v) => !v.cinemas || v.cinemas.includes(cinemaName)
  );

  const handleApply = (voucherCode) => {
    const target = voucherCode || code.trim().toUpperCase();
    const found = vouchers.find((v) => v.code === target);
    if (!found) {
      setError("Mã không hợp lệ hoặc đã hết hạn.");
      setApplied(null);
      return;
    }
    if (found.cinemas && !found.cinemas.includes(cinemaName)) {
      setError(`Mã này chỉ áp dụng tại: ${found.cinemas.join(", ")}`);
      setApplied(null);
      return;
    }
    setApplied(found);
    setError("");
    setCode(found.code);
    onApply(found);
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    setError("");
    onApply(null);
  };

  return (
    <div className="voucher-box">
      <div className="voucher-header">
        <span className="voucher-icon">🎟️</span>
        <h3>Mã ưu đãi</h3>
      </div>

      {/* Suggested vouchers */}
      <div className="voucher-suggestions">
        <p className="voucher-suggest-label">Gợi ý cho {cinemaName}:</p>
        <div className="voucher-chips">
          {suggested.map((v) => (
            <button
              key={v.code}
              className={`voucher-chip${applied?.code === v.code ? " active" : ""}`}
              onClick={() => handleApply(v.code)}
            >
              <span className="chip-code">{v.code}</span>
              <span className="chip-desc">{v.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual input */}
      {!applied ? (
        <div className="voucher-input-row">
          <input
            className="voucher-input"
            placeholder="Nhập mã voucher..."
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
          <button className="voucher-apply-btn" onClick={() => handleApply()}>
            Áp dụng
          </button>
        </div>
      ) : (
        <div className="voucher-applied">
          <span className="voucher-applied-icon">✅</span>
          <div>
            <b>{applied.code}</b> — {applied.description}
            <span className="voucher-discount">
              -{applied.type === "percent" ? `${applied.discount}%` : `${applied.discount}K`}
            </span>
          </div>
          <button className="voucher-remove" onClick={handleRemove}>✕</button>
        </div>
      )}

      {error && <p className="voucher-error">⚠️ {error}</p>}
    </div>
  );
}

export default VoucherBox;
