import { UI_TEXT } from "../../constants/app";
import Logo from "../common/Logo";

function Footer() {
  return <footer className="site-footer"><div className="footer-grid"><div><Logo /><ul className="footer-links">{UI_TEXT.FOOTER_LINKS.map((link) => <li key={link}>{link}</li>)}</ul></div><div><h3>CỤM RẠP BETA</h3><ul className="footer-list">{UI_TEXT.CINEMA_CONTACTS.map((contact) => <li key={contact}>{contact}</li>)}</ul></div><div><h3>LIÊN HỆ</h3><div className="contact-copy"><strong>CÔNG TY CỔ PHẦN BETA MEDIA</strong><p>Giấy chứng nhận ĐKKD số: 0106633482 - Đăng ký lần đầu ngày 08/09/2014 tại Sở Kế hoạch và Đầu tư Thành phố Hà Nội</p><p>Địa chỉ trụ sở: Tầng 3, số 595, đường Giải Phóng, Phường Tương Mai, Thành phố Hà Nội, Việt Nam</p><strong>LIÊN HỆ CHĂM SÓC KHÁCH HÀNG:</strong><p>Hotline: 1900 636807<br />Email: mkt@betacinemas.vn</p><h3 className="social-heading">KẾT NỐI VỚI CHÚNG TÔI</h3><div className="socials"><span>f</span><span>▶</span><span>♪</span><span>◎</span></div></div></div></div></footer>;
}

export default Footer;
