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
  console.log("DB connected successfully");
});

// ================= LOGIN =================
app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body;

  // ✅ تصحيح الشرط
  if (!email || !password || !role) {
    return res.json({
      success: false,
      message: "الرجاء تعبئة كل الحقول",
    });
  }

  db.query(
    "SELECT * FROM Users WHERE email = ?",
    [email],
    (err, results) => {
      if (err)
        return res.json({
          success: false,
          message: "Erreur serveur",
        });

      if (results.length === 0)
        return res.json({
          success: false,
          message: "⚠️ المستخدم غير مسجل",
        });

      const user = results[0];

      if (user.role !== role)
        return res.json({
          success: false,
          message: "⚠️ الدور المختار غير صحيح",
        });

      if (password !== user.password)
        return res.json({
          success: false,
          message: "⚠️ كلمة السر خاطئة",
        });

      let redirect = "/";
      switch (user.role) {
        case "admin":
          redirect = "/admin-dashboard";
          break;
        case "responsable":
          redirect = "/responsable-dashboard";
          break;
        case "magasinier":
          redirect = "/magasinier-dashboard";
          break;
      }

      res.json({
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        user: { email: user.email, role: user.role },
        redirect,
      });
    }
  );
});

// ================= REGISTER =================
app.post("/api/register", (req, res) => {
  const { email, password, role } = req.body;

  // ✅ تصحيح الشرط
  if (!email || !password || !role) {
    return res.json({
      success: false,
      message: "الرجاء تعبئة كل الحقول",
    });
  }

  db.query(
    "SELECT * FROM Users WHERE email = ?",
    [email],
    (err, results) => {
      if (err)
        return res.json({
          success: false,
          message: "Erreur serveur",
        });

      if (results.length > 0)
        return res.json({
          success: false,
          message: "⚠️ البريد مستخدم من قبل",
        });

      db.query(
        "INSERT INTO Users (email, password, role) VALUES (?, ?, ?)",
        [email, password, role],
        (err) => {
          if (err)
            return res.json({
              success: false,
              message: "Erreur serveur",
            });

          let redirect = "/";
          switch (role) {
            case "admin":
              redirect = "/admin-dashboard";
              break;
            case "responsable":
              redirect = "/responsable-dashboard";
              break;
            case "magasinier":
              redirect = "/magasinier-dashboard";
              break;
          }

          res.json({
            success: true,
            message: "تم إنشاء الحساب بنجاح",
            user: { email, role },
            redirect,
          });
        }
      );
    }
  );
});

// ================= START SERVER =================
app.listen(5001, () =>
  console.log("Server running on http://localhost:5001")
);