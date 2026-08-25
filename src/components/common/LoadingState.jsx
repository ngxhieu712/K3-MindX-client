function LoadingState({ label = "Đang tải dữ liệu..." }) {
  return <div className="loading-state" role="status">{label}</div>;
}

export default LoadingState;
