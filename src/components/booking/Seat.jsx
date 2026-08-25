function Seat({ label, state, onClick }) {
  return <button className={`seat ${state}`} onClick={onClick}>{label}</button>;
}

export default Seat;
