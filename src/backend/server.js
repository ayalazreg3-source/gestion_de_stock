const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// 🔹 MySQL Pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_stock",
  port: 3306 // تأكد من البورت الصحيح في XAMPP
});

// 🔹 اختبار الاتصال
db.getConnection((err, conn) => {
  if (err) console.error("DB Connection Error:", err);
  else {
    console.log("MySQL Pool Connected!");
    conn.release();
  }
});

// 🔹 جلب المنتجات
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM produits ORDER BY id_produit DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔹 إضافة منتج
app.post("/products", (req, res) => {
  const {
    nom_produit,
    categorie,
    description,
    quantite,
    prix_unitaire,
    fournisseur,
    date_ajout,
    niveau_alerte
  } = req.body;

  if (!nom_produit || !categorie) {
    return res.status(400).json({ error: "Nom et Catégorie sont obligatoires !" });
  }

  const sql = `
    INSERT INTO produits 
    (nom_produit, categorie, description, quantite, prix_unitaire, fournisseur, date_ajout, niveau_alerte)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
 ` ;

  const values = [
    nom_produit,
    categorie,
    description,
    quantite,
    prix_unitaire,
    fournisseur,
    date_ajout,
    niveau_alerte
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Produit ajouté avec succès", insertedId: result.insertId });
  });
});

// 🔹 تعديل منتج
app.put("/products/:id", (req, res) => {
  const id = req.params.id;

  const {
    nom_produit,
    categorie,
    description,
    quantite,
    prix_unitaire,
    fournisseur,
    date_ajout,
    niveau_alerte
  } = req.body;

  const sql =` 
    UPDATE produits 
    SET nom_produit=?, categorie=?, description=?, quantite=?, prix_unitaire=?, fournisseur=?, date_ajout=?, niveau_alerte=? 
    WHERE id_produit=?
  `;

  const values = [
    nom_produit,
    categorie,
    description,
    quantite,
    prix_unitaire,
    fournisseur,
    date_ajout,
    niveau_alerte,
    id
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Produit mis à jour avec succès" });
  });
});

// 🔹 حذف منتج
app.delete("/products/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM produits WHERE id_produit=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Produit supprimé avec succès" });
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});