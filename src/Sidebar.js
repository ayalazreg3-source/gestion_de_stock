import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ darkMode }) {
  return (
    <div className={`sidebar ${darkMode ? "dark-mode" : ""}`}>
      <h2 className="logo">SysStock</h2>

      <ul>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            🏠 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            👑 Admin
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/clients"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            👥 Clients
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/fournisseurs"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            🚚 Fournisseurs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            📦 Produits
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mouvement"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            🔄 Mouvement
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/facture"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            📄 Facture
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/stockalert"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            ⚠️ Stock Alert
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/barcode"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            🖨 Barcode
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/rapportstock"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            📊 Rapport Stock
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            🔑 Login
          </NavLink>
        </li>
      </ul>
    </div>
  );
}