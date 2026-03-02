import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// الصور لازم تكون موجودة في src/assets/
import stockImg from "./assets/stock.png";
import avatarImg from "./assets/avatar.png";
import stockkImg from "./assets/stockk.png";

function Login() {
  const navigate = useNavigate();

  // ===== Navigate حسب الدور (خاصها تكون قبل useEffect) =====
  const navigateToDashboard = (role) => {
    if (role === "admin") navigate("/admin-dashboard");
    else if (role === "magasinier") navigate("/magasinier-dashboard");
    else navigate("/utilisateur-dashboard");
  };

  // ===== State =====
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("utilisateur");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // URLs PHP
  const REGISTER_URL = "http://localhost/stockapi/register.php";
  const LOGIN_URL = "http://localhost/stockapi/login.php";

  // ===== تسجيل الدخول تلقائياً إذا كان user مخزن =====
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      navigateToDashboard(loggedUser.role);
    }
  }, []); // خليها فارغة

  // ===== Handle Register =====
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("الرجاء تعبئة كل الحقول");
      return;
    }

    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      console.log("Register Response:", data);

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigateToDashboard(data.user.role);

    } catch (err) {
      setError("خطأ في الاتصال بالسيرفر");
      console.error(err);
    }
  };

  // ===== Handle Login =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("الرجاء تعبئة كل الحقول");
      return;
    }

    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigateToDashboard(data.user.role);

    } catch (err) {
      setError("خطأ في الاتصال بالسيرفر");
      console.error(err);
    }
  };

  return (
    <div
      className="login-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(90,24,154,0.9), rgba(123,44,191,0.9)), url(${stockkImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-box">

        {/* ===== LEFT ===== */}
        <div className="login-brand">
          <h2>Gestion de Stock</h2>
          <p>Simple • Moderne • Efficace</p>
          <img src={stockImg} alt="Gestion de stock" className="login-image" />
          <div className="icons">
            <span>📦</span>
            <span>📊</span>
            <span>🏬</span>
          </div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="login-form">
          <img src={avatarImg} alt="Avatar" className="login-avatar" />
          <h3>{isRegister ? "Créer un compte" : "Connexion"}</h3>

          {/* Role selection */}
          <div className="role-select">
            <button
            type="button"
              className={role === "admin" ? "active" : ""}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
            <button
              type="button"
              className={role === "magasinier" ? "active" : ""}
              onClick={() => setRole("magasinier")}
            >
              Magasinier
            </button>
            <button
              type="button"
              className={role === "utilisateur" ? "active" : ""}
              onClick={() => setRole("utilisateur")}
            >
              Utilisateur
            </button>
          </div>

          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit">
              {isRegister ? "Créer le compte" : "Se connecter"}
            </button>
          </form>

          <p className="switch">
            {isRegister
              ? "Vous avez déjà un compte ?"
              : "Vous n’avez pas de compte ?"}
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? " Se connecter" : " Créer un compte"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;