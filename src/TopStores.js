function TopStores() {
  return (
    <div className="box">
      <h3>Top Stores by sales</h3>

      <div className="store">
        <span>Gateway str</span>
        <div className="bar"><div style={{ width: "90%" }}></div></div>
        <span>874k</span>
      </div>

      <div className="store">
        <span>The Rustic Fox</span>
        <div className="bar"><div style={{ width: "75%" }}></div></div>
        <span>721k</span>
      </div>

      <div className="store">
        <span>Urban Vine</span>
        <div className="bar"><div style={{ width: "60%" }}></div></div>
        <span>500k</span>
      </div>
    </div>
  );
}

export default TopStores;