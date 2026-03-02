import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./RapportStock.css";

function RapportStock() {
  const data = [
    { produit: "Stylo", entree: 120, sortie: 40, stock: 80 },
    { produit: "Souris", entree: 200, sortie: 150, stock: 50 },
    { produit: "Clavier", entree: 60, sortie: 60, stock: 0 },
    { produit: "PC", entree: 30, sortie: 10, stock: 20 },
  ];

  const totalEntree = data.reduce((a, b) => a + b.entree, 0);
  const totalSortie = data.reduce((a, b) => a + b.sortie, 0);
  const ruptures = data.filter(d => d.stock === 0).length;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Rapport de Gestion de Stock", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Produit", "Entrées", "Sorties", "Stock"]],
      body: data.map(d => [d.produit, d.entree, d.sortie, d.stock]),
    });
    doc.save("rapport-stock.pdf");
  };

  return (
    <div className="rapport-stock">
      <h1>📊 Rapport Stock</h1>

      <div className="summary">
        <div className="card">
          <p>Produits</p>
          <strong>{data.length}</strong>
        </div>
        <div className="card">
          <p>Entrées</p>
          <strong>{totalEntree}</strong>
        </div>
        <div className="card">
          <p>Sorties</p>
          <strong>{totalSortie}</strong>
        </div>
        <div className="card danger">
          <p>Ruptures</p>
          <strong>{ruptures}</strong>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Entrées</th>
            <th>Sorties</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.produit}</td>
              <td>{d.entree}</td>
              <td>{d.sortie}</td>
              <td className={d.stock === 0 ? "rupture" : ""}>{d.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="actions">
        <button onClick={exportPDF}>📄 Exporter PDF</button>
        <button onClick={() => window.print()}>🖨 Imprimer</button>
      </div>
    </div>
  );
}

export default RapportStock;