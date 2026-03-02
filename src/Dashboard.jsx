import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import "./Dashboard.css";

/* ================= DATA ================= */

const lineData = [
  { name: "Jan", value: 30 },
  { name: "Fev", value: 45 },
  { name: "Mar", value: 40 },
  { name: "Avr", value: 60 },
  { name: "Mai", value: 75 },
  { name: "Jui", value: 65 }
];

const pieData = [
  { name: "En Stock", value: 75 },
  { name: "Hors stock", value: 25 }
];

const barData = [
  { name: "Dim", value: 40 },
  { name: "Lun", value: 55 },
  { name: "Mar", value: 35 },
  { name: "Mer", value: 70 },
  { name: "Jeu", value: 60 }
];

const pieColors = ["#5a189a", "#c77dff"];

function Dashboard() {
  return (
    <div className="dashboard-content">

      <h1>StockSys Dashboard</h1>

      <div className="overview">
        <div className="card purple"><h3>Produits totaux</h3><p>5483</p></div>
        <div className="card purple"><h3>Ordres</h3><p>2859</p></div>
        <div className="card purple"><h3>Stock Total</h3><p>5483</p></div>
        <div className="card purple"><h3>En rupture</h3><p>38</p></div>
      </div>

      <div className="grid-3">

        <div className="card">
          <h3>Tendances des ventes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#5a189a" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card center">
          <h3>Stock</h3>
          <PieChart width={220} height={220}>
            <Pie data={pieData} innerRadius={60} outerRadius={90} dataKey="value">
              {pieData.map((_, i) => (
                <Cell key={i} fill={pieColors[i]} />
              ))}
            </Pie>
          </PieChart>
          <small>75% En Stock</small>
        </div>

        <div className="card">
          <h3>Meilleurs magasins</h3>
          <div className="store"><span>Gateway</span><div className="bar"><div style={{ width: "80%" }} /></div></div>
          <div className="store"><span>Rustic</span><div className="bar"><div style={{ width: "70%" }} /></div></div>
          <div className="store"><span>Urban</span><div className="bar"><div style={{ width: "60%" }} /></div></div>
          <div className="store"><span>Blue Harbor</span><div className="bar"><div style={{ width: "50%" }} /></div></div>
        </div>

      </div>

      <div className="grid-2">

        <div className="card">
          <h3>Calendrier</h3>
          <div className="calendar">
            {["L","M","M","J","V","S","D"].map(d => (
              <div key={d} className="day head">{d}</div>
            ))}
            {[...Array(30)].map((_, i) => (
              <div key={i} className="day">{i + 1}</div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Activité hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#5a189a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;