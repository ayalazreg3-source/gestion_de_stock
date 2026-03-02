import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Facture.css";

function Facture() {
  const fournisseur = "SARL TechPro";
  const numeroFacture = "FAC-2024-001";
  const date = new Date().toLocaleDateString();

  const produits = [
    { nom: "Clavier", prix: 3000, quantite: 5 },
    { nom: "Souris", prix: 1500, quantite: 10 },
    { nom: "Ecran", prix: 25000, quantite: 2 },
  ];

  const total = produits.reduce(
    (acc, p) => acc + p.prix * p.quantite,
    0
  );

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Facture", 14, 15);
    doc.text("Fournisseur : " + fournisseur, 14, 25);
    doc.text("Numéro : " + numeroFacture, 14, 32);
    doc.text("Date : " + date, 14, 39);

    autoTable(doc, {
      startY: 45,
      head: [["Produit", "Prix", "Quantité", "Total"]],
      body: produits.map(p => [
        p.nom,
        p.prix + " DA",
        p.quantite,
        p.prix * p.quantite + " DA"
      ])
    });

    doc.text(
      "Total Général : " + total + " DA",
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("facture-fournisseure.pdf");
  };

  return (
    <div className="facture">
      <h1>🧾 Facture</h1>

      <div className="info">
        <p><strong>Fournisseur :</strong> {fournisseur}</p>
        <p><strong>Numéro :</strong> {numeroFacture}</p>
        <p><strong>Date :</strong> {date}</p>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {produits.map((p, i) => (
            <tr key={i}>
              <td>{p.nom}</td>
              <td>{p.prix} DA</td>
              <td>{p.quantite}</td>
              <td>{p.prix * p.quantite} DA</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="total">Total Général : {total} DA</h3>

      <div className="actions">
        <button onClick={exportPDF}>📄 Export PDF</button>
        <button onClick={() => window.print()}>🖨 Imprimer</button>
      </div>
    </div>
  );
}

export default Facture;