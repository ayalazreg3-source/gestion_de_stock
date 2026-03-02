import React, { useEffect, useRef, useState } from "react";
import alertSound from "./assets/alert.mp3"; // الصوت من src/assets
import "./StockAlert.css";

function StockAlert({ stockData }) {
  const lowStock = stockData?.filter(item => item.stock === 0) || [];
  const prevCount = useRef(0);
  const [soundEnabled, setSoundEnabled] = useState(false); // حالة السماح بالصوت

  // useEffect لمراقبة المنتجات
  useEffect(() => {
    if (soundEnabled && lowStock.length > 0 && lowStock.length !== prevCount.current) {
      const audio = new Audio(alertSound);
      audio.play().catch(err => console.log("Erreur audio:", err));

      alert("⚠️ Attention ! Certains produits sont en rupture de stock !");
    }
    prevCount.current = lowStock.length;
  }, [lowStock.length, soundEnabled]);

  return (
    <div className="stock-alert-page">

      <h1>⚠️ Alertes de Stock</h1>

      {/* زر السماح بتشغيل الصوت */}
      {!soundEnabled && (
        <button
          onClick={() => setSoundEnabled(true)}
          style={{
            marginBottom: "20px",
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#7b2cbf",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Activer les alertes sonores
        </button>
      )}

      {lowStock.length === 0 ? (
        <p className="success">✅ Tous les produits ont un stock suffisant.</p>
      ) : (
        <div className="warning">
          <p>Les produits suivants sont en rupture :</p>
          <ul>
            {lowStock.map((item) => (
              <li key={item.id || item.produit}>
                <span className="product-name">{item.produit}</span> - Stock: {item.stock}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StockAlert;