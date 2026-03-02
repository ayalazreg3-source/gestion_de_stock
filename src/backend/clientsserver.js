const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_stock",
  port: 3306 
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed");
    console.log(err);
  } else {
    console.log("✅ Connected to database");
  }
});


app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});


app.get("/clients", (req, res) => {
  db.query("SELECT * FROM clients", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ======================
// ADD CLIENT
// ======================
app.post("/clients", (req, res) => {
  const { nom, telephone, adresse, email, type } = req.body;

  const sql =
    "INSERT INTO clients (nom, telephone, adresse, email, type) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [nom, telephone, adresse, email, type], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Client ajouté" });
  });
});

// ======================
// UPDATE CLIENT
// ======================
app.put("/clients/:id", (req, res) => {
  const id = req.params.id;
  const { nom, telephone, adresse, email, type } = req.body;

  const sql =
    "UPDATE clients SET nom=?, telephone=?, adresse=?, email=?, type=? WHERE id_client=?";

  db.query(
    sql,
    [nom, telephone, adresse, email, type, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Client modifié" });
    }
  );
});

// ======================
// DELETE CLIENT
// ======================
app.delete("/clients/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM clients WHERE id_client=?", [id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Client supprimé" });
  });
});

// ======================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});