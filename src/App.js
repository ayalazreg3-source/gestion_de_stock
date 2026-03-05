import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Dashboard from "./Dashboard";
import Admin from "./Admin";
import Clients from "./Clients";
import Fournisseurs from "./Fournisseurs";
import Products from "./Products"; 
import MouvementPage from "./MouvementPage";
import Facture from "./Facture";
import Login from "./Login";
import BarcodePage from "./BarcodePage";
import RapportStock from "./RapportStock";
import StockAlert from "./StockAlert";


import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const stockData = [
    { produit: "Stylo", stock: 80 },
    { produit: "Clavier", stock: 0 },
    { produit: "Souris", stock: 10 },
    { produit: "PC", stock: 0 },
  ];

  return (
    <Router>
      <div className="app-container">
        <Sidebar darkMode={darkMode} />

        <div className="main-area">
          <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
              <Route path="/products" element={<Products />} /> {/* هنا المنتجات */}
              <Route path="/mouvement" element={<MouvementPage />} />
              <Route path="/facture" element={<Facture />} />
              <Route path="/barcode" element={<BarcodePage />} />
              <Route path="/rapportstock" element={<RapportStock />} />
              <Route path="/stockalert" element={<StockAlert stockData={stockData} />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
