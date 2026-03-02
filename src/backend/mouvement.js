const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_stock",
  port: 3306,
});

db.connect((err) => {
  if (err) return console.error("DB connection failed:", err);
  console.log("✅ Connected to MySQL database");
});




app.get("/produits", (req, res) => {
  db.query("SELECT * FROM produits", (err, results) => {
    if (err) return res.status(500).json(err);

    const safeResults = results.map((p) => ({
      id_produit: p.id_produit,
      nom: p.nom || "Produit inconnu",
      quantite: p.quantite != null ? p.quantite : 0,
    }));

    res.json(safeResults);
  });
});

// ADD PRODUIT (ajout ou update quantité)
app.post("/produits", (req, res) => {
  const { id, nom, quantite } = req.body;

  if (!id ||!nom || quantite == null) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  db.query(
    "SELECT * FROM produits WHERE id_produit=?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length > 0) {
        const nouvelleQuantite =
          results[0].quantite + parseInt(quantite);

        db.query(
          "UPDATE produits SET quantite=? WHERE id_produit=?",
          [nouvelleQuantite, id],
          (err) => {
            if (err) return res.status(500).json(err);
            res.json({
              id_produit: id,
              nom,
              quantite: nouvelleQuantite,
            });
          }
        );
      } else {
        db.query(
          "INSERT INTO produits (id_produit, nom, quantite) VALUES (?, ?, ?)",
          [id, nom, quantite],
          (err) => {
            if (err) return res.status(500).json(err);
            res.json({
              id_produit: id,
              nom,
              quantite,
            });
          }
        );
      }
    }
  );
});

// RETRAIT PRODUIT
app.put("/produits/retrait", (req, res) => {
  const { id, quantite } = req.body;

  if (!id || quantite == null) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  db.query(
    "SELECT * FROM produits WHERE id_produit=?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }

      const produit = results[0];

      if (produit.quantite < quantite) {
        return res
          .status(400)
          .json({ error: "Quantité insuffisante" });
      }

      const nouvelleQuantite =
        produit.quantite - parseInt(quantite);

      db.query(
        "UPDATE produits SET quantite=? WHERE id_produit=?",
        [nouvelleQuantite, id],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({
            id_produit: id,
            quantite: nouvelleQuantite,
          });
        }
      );
    }
  );
});

// ================= MOUVEMENTS =================

app.get("/mouvements", (req, res) => {
  db.query(
    "SELECT * FROM mouvements ORDER BY date DESC, id_mouvement DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);

      const safeResults = results.map((m) => ({
        id_mouvement: m.id_mouvement,
        id_produit: m.id_produit || "-",
        id_client: m.id_client || "-",
        id_fournisseur: m.id_fournisseur || "-",
        type: m.type || "-",
        quantite: m.quantite != null ? m.quantite : 0,
        date: m.date || "-",
      }));

      res.json(safeResults);
    }
  );
});

// ================= START SERVER =================
app.listen(5000, () =>
  console.log("🚀 Server running on port 5000")
);