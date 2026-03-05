import React, { useState, useRef, useEffect } from "react";
import "./BarcodePage.css";

export default function BarcodePage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastScanned, setLastScanned] = useState("");

  const scannerRef = useRef(null);
  const manualRef = useRef(null);

  const productsDB = {
    "12345678": { name: "Laptop HP", price: 85000, stock: 5 },
    "11111111": { name: "Souris Logitech", price: 2500, stock: 0 },
    "22222222": { name: "Clavier Gaming", price: 4500, stock: 2 },
    "33333333": { name: "Écran 24''", price: 15000, stock: 3 },
  };

  useEffect(() => {
    scannerRef.current.focus();
  }, []);

  const addProduct = (code) => {
    const product = productsDB[code.trim()];
    if (!product) {
      alert("⚠️ Produit non trouvé !");
      return false;
    }
    if (product.stock <= 0) {
      alert("⚠️ Produit hors stock !");
      return false;
    }

    const existing = cart.find((item) => item.code === code);
    let updatedCart;
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert("⚠️ Quantité dépasse le stock !");
        return false;
      }
      updatedCart = cart.map((item) =>
        item.code === code ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { code, ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    calculateTotal(updatedCart);
    setLastScanned(code);
    return true;
  };

  const calculateTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  const handleScan = (e) => {
    if (e.key === "Enter") {
      addProduct(e.target.value);
      e.target.value = "";
    }
  };

  const handleManual = () => {
    const code = manualRef.current.value;
    addProduct(code);
    manualRef.current.value = "";
  };

  const removeItem = (code) => {
    const updated = cart.filter((item) => item.code !== code);
    setCart(updated);
    calculateTotal(updated);
  };

  const resetCart = () => {
    setCart([]);
    setTotal(0);
    setLastScanned("");
    scannerRef.current.focus();
  };

  return (
    <div className="barcode-container">
      <h1>🛒 SysStock - POS Moderne</h1>

      <div className="inputs-box">
        <div className="input-group">
          <label>Scanner</label>
          <input
            type="text"
            placeholder="Scannez le produit..."
            onKeyDown={handleScan}
            ref={scannerRef}
          />
        </div>

        <div className="input-group">
          <label>Code Manuel</label>
          <div className="manual-add">
            <input type="text" placeholder="Entrez le code..." ref={manualRef} />
            <button onClick={handleManual}>Ajouter</button>
          </div>
        </div>
      </div>

      <div className="cart-section">
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix</th>
              <th>Qté</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
                  Panier vide
                </td>
              </tr>
            )}
            {cart.map((item) => (
              <tr
                key={item.code}
                className={`${
                  item.stock === 0 ? "out-of-stock" : ""
                } ${lastScanned === item.code ? "highlight" : ""}`}
              >
                <td>{item.name}</td>
                <td>{item.price} DA</td>
                <td>{item.quantity}</td>
                <td>{item.price * item.quantity} DA</td>
                <td>
                  <button onClick={() => removeItem(item.code)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-box">
          Total: {total} DA
        </div>

        <div className="cart-buttons">
          <button className="reset-btn" onClick={resetCart}>🗑️ Vider Panier</button>
        </div>
      </div>
    </div>
  );
}
