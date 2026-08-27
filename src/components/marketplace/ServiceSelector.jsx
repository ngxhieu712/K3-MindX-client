import { PAGE, SERVICE_TYPE, UI_TEXT } from "../../constants/app";

const SERVICE_ICONS = Object.freeze({ hotel: "▣", flight: "✈", bus: "▰", movie: "▤" });

function ServiceSelector({ onNavigate }) {
  return <section className="service-selector"><p className="eyebrow">MỘT NỀN TẢNG, MỌI HÀNH TRÌNH</p><h1>Bạn muốn đặt dịch vụ nào?</h1><div className="service-grid">{UI_TEXT.MARKETPLACE_SERVICES.map((service) => <button key={service.type} className={`service-tile service-${service.type}`} onClick={() => service.type === SERVICE_TYPE.MOVIE ? onNavigate(PAGE.MOVIES) : service.type === SERVICE_TYPE.FLIGHT ? onNavigate(PAGE.FLIGHT_SEARCH) : undefined}><span>{SERVICE_ICONS[service.type]}</span><strong>{service.title}</strong><small>{service.subtitle}</small>{service.type !== SERVICE_TYPE.MOVIE && <em>Sắp ra mắt</em>}</button>)}</div></section>;
}

export default ServiceSelector;
