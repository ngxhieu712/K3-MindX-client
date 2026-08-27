import { useState } from "react";
import { REQUEST_STATUS, UI_TEXT } from "../../constants/app";
import { cinemaService } from "../../services/cinemaService";

const EMPTY_PASSENGER = Object.freeze({ fullName: "", gender: "", dob: "", nationality: "", idNumber: "" });

function PassengerForm({ flight, fareClass, onComplete }) {
  const [contact, setContact] = useState({ fullName: "", phone: "", email: "" });
  const [passenger, setPassenger] = useState(EMPTY_PASSENGER);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);
  const update = (setter, field) => (event) => setter((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setRequestStatus(REQUEST_STATUS.LOADING);
    const response = await cinemaService.submitFlightPassengerDetails({ flightId: flight.id, fareClass, contact, passenger });
    setRequestStatus(REQUEST_STATUS.SUCCESS);
    onComplete(response);
  };

  return <form className="passenger-form" onSubmit={submit}><h2>{UI_TEXT.FLIGHT_CONTACT_PROMPT}</h2><div className="login-callout">🎟 Đăng nhập hoặc đăng ký để có giá rẻ hơn và nhiều ưu đãi hơn!</div><label>Họ tên*<input required value={contact.fullName} onChange={update(setContact, "fullName")} placeholder="Nhập họ và tên" /></label><div className="passenger-two-col"><label>Điện thoại di động*<input required value={contact.phone} onChange={update(setContact, "phone")} placeholder="Số điện thoại" /></label><label>Email*<input required type="email" value={contact.email} onChange={update(setContact, "email")} placeholder="email@example.com" /></label></div><h2>Thông tin hành khách</h2><div className="passenger-card"><h3>Người lớn 1</h3><p className="passenger-warning">⚠ Vui lòng nhập tên bằng tiếng Anh không dấu, chính xác như trên giấy tờ tùy thân.</p><label>Giới tính*<select required value={passenger.gender} onChange={update(setPassenger, "gender")}><option value="" disabled>Chọn giới tính</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option></select></label><div className="passenger-two-col"><label>Họ (vd: NGUYEN)*<input required value={passenger.fullName} onChange={update(setPassenger, "fullName")} placeholder="NGUYEN VAN AN" /></label><label>Ngày sinh*<input required value={passenger.dob} onChange={update(setPassenger, "dob")} placeholder="DD/MM/YYYY" /></label></div><label>Số hộ chiếu / CCCD*<input required value={passenger.idNumber} onChange={update(setPassenger, "idNumber")} placeholder="Nhập số giấy tờ" /></label></div><button className="flight-search-button passenger-submit" disabled={requestStatus === REQUEST_STATUS.LOADING}>{requestStatus === REQUEST_STATUS.LOADING ? "ĐANG XỬ LÝ..." : "TIẾP TỤC THANH TOÁN"}</button></form>;
}

export default PassengerForm;
