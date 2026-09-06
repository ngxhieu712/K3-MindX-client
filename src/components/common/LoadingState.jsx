function LoadingState({ label = "Đang tải..." }) {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingState;
