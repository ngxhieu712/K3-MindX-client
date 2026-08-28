function ReviewStars({ rating }) {
  return (
    <span className="review-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
      ))}
    </span>
  );
}

export default ReviewStars;
