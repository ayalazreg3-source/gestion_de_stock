function OverviewCards() {
  return (
    <div className="overview">
      <div className="card green">
        <div className="icon">📦</div>
        <div>
          <p>Total Products</p>
          <h3>5483</h3>
        </div>
      </div>

      <div className="card blue">
        <div className="icon">🧾</div>
        <div>
          <p>Orders</p>
          <h3>2859</h3>
        </div>
      </div>

      <div className="card teal">
        <div className="icon">📊</div>
        <div>
          <p>Total Stock</p>
          <h3>5483</h3>
        </div>
      </div>

      <div className="card orange">
        <div className="icon">⚠️</div>
        <div>
          <p>Out of Stock</p>
          <h3>38</h3>
        </div>
      </div>
    </div>
  );
}

export default OverviewCards;