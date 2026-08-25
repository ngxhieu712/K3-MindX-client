import { useEffect, useState } from "react";
import { REQUEST_STATUS, formatMoney } from "../constants/app";
import { cinemaService } from "../services/cinemaService";
import LoadingState from "../components/common/LoadingState";

function QrPaymentPage({ amountThousand, onCancel }) {
  const [payment, setPayment] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);

  useEffect(() => {
    let isCurrentRequest = true;
    const createPayment = async () => {
      setRequestStatus(REQUEST_STATUS.LOADING);
      const response = await cinemaService.createQrPayment({ amountThousand });
      if (isCurrentRequest) {
        setPayment(response);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
      }
    };
    createPayment();
    return () => {
      isCurrentRequest = false;
    };
  }, [amountThousand]);

  if (requestStatus === REQUEST_STATUS.LOADING || !payment)
    return (
      <main className="qr-page page">
        <LoadingState label="Đang khởi tạo mã thanh toán..." />
      </main>
    );

  return (
    <main className="qr-page page">
      <p className="eyebrow">THANH TOÁN QR</p>
      <h1>Thanh toán nhanh chóng, an toàn</h1>
      <div className="qr-card">
        <div className="vietqr">
          <b>
            <span>V</span>IETQR
          </b>
          <div className="qr-pattern">▦</div>
          <strong>
            napas<span>247</span> &nbsp; | &nbsp; BIDV
          </strong>
          <p>
            Số tiền: <b>{formatMoney(payment.amountThousand).toUpperCase()}</b>
            <br />
            Nội dung CK: {payment.transferContent}
            <br />
            Số TK: <b>{payment.accountNumber}</b>
            <br />
            {payment.bankName}
          </p>
        </div>
      </div>
      <h3>Thời gian còn lại</h3>
      <strong className="countdown">{payment.expiresIn}</strong>
      <button className="secondary-button cancel-payment" onClick={onCancel}>
        HỦY GIAO DỊCH
      </button>
    </main>
  );
}

export default QrPaymentPage;
