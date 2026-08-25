function DateStrip({ dates, selectedDateIndex, onChange }) {
  return <div className="date-strip">{dates.map((date, index) => <button key={date} className={selectedDateIndex === index ? "active" : ""} onClick={() => onChange(index)}><strong>{date.split("/")[0]}</strong><span>/{date.slice(3)}</span></button>)}</div>;
}

export default DateStrip;
