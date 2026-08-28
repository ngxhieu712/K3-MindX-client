import { useEffect, useState } from "react";

function Banner({ banners }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const slide = banners[current];

  return (
    <div className="banner-wrap">
      <div
        className="banner-slide"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="banner-overlay" />
        <div className="banner-content">
          <span className="banner-badge">{slide.badge}</span>
          <h2 className="banner-title">{slide.title}</h2>
          <p className="banner-subtitle">{slide.subtitle}</p>
          <button className="banner-cta">{slide.cta} →</button>
        </div>
      </div>
      <div className="banner-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`banner-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;
