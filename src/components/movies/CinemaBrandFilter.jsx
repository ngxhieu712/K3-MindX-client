function CinemaBrandFilter({ brands, activeBrandId, onChange }) {
  return <div className="brand-filter">{brands.map((brand) => <button key={brand.id} className={activeBrandId === brand.id ? "active" : ""} onClick={() => onChange(brand.id)}><img src={brand.logoUrl} alt="" /><strong>{brand.name}</strong><small>{brand.cityCount} cụm rạp</small></button>)}</div>;
}

export default CinemaBrandFilter;
