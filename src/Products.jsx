import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Products.css";

export default function Products() {
  const apiUrl = "http://localhost:5000/products";

  const initialForm = {
    nom_produit: "",
    categorie: "",
    description: "",
    quantite: 0,
    prix_unitaire: 0,
    fournisseur: "",
    date_ajout: "",
    niveau_alerte: 0,
  };

  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 جلب كل المنتجات
  const fetchProducts = async () => {
    try {
      const res = await axios.get(apiUrl);
      setList(res.data);
    } catch (err) {
      console.error("Erreur fetch produits:", err);
      setErrorMessage(err.response?.data?.error || err.message);
    }
  };

  // 🔹 تحديث الفورم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ["quantite", "prix_unitaire", "niveau_alerte"].includes(name)
        ? Number(value)
        : value,
    });
  };

  // 🔹 إضافة أو تعديل المنتج
  const handleSave = async () => {
    setErrorMessage("");

    if (!form.nom_produit.trim() || !form.categorie.trim()) {
      setErrorMessage("Nom et Catégorie sont obligatoires !");
      return;
    }

console.log("Sending to API:", apiUrl);
console.log("Form data:", form);

    try {
      if (editId) {
        // تعديل المنتج
        await axios.put(`${apiUrl}/${editId}`, form, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // إضافة منتج جديد
        await axios.post(apiUrl, form, {
          headers: { "Content-Type": "application/json" },
        });
      }

      setForm(initialForm);
      setEditId(null);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Erreur save produit:", err);
      setErrorMessage(err.response?.data?.error || err.message);
    }
  };

  // 🔹 تعديل منتج
  const handleEdit = (product) => {
    const { id_produit, ...rest } = product;
    setForm(rest);
    setEditId(id_produit);
    setShowModal(true);
    setErrorMessage("");
  };

  // 🔹 حذف منتج
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

      await axios.delete(`${apiUrl}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || err.message);
    }
  };

  // 🔹 فلترة البحث
  const filteredList = list.filter((p) =>
    (p.nom_produit || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="header">
        <h2>Gestion des Produits</h2>
        <button
          onClick={() => {
            setForm(initialForm);
            setEditId(null);
            setShowModal(true);
            setErrorMessage("");
          }}
        >
          + Add Produit
        </button>
      </div>

      <input
        className="search"
        placeholder="Search produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix</th>
            <th>Fournisseur</th>
            <th>Date</th>
            <th>Niveau Alerte</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="10">Aucun produit trouvé</td>
              </tr>
          ) : (
            filteredList.map((p) => (
              <tr key={p.id_produit}>
                <td>{p.id_produit}</td>
                <td>{p.nom_produit}</td>
                <td>{p.categorie}</td>
                <td>{p.description}</td>
                <td>{p.quantite}</td>
                <td>{p.prix_unitaire}</td>
                <td>{p.fournisseur}</td>
                <td>{p.date_ajout}</td>
                <td>{p.niveau_alerte}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(p.id_produit)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h3>{editId ? "Edit Produit" : "Add Produit"}</h3>

            {Object.keys(form).map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key}
                type={
                  ["quantite", "prix_unitaire", "niveau_alerte"].includes(key)
                    ? "number"
                    : key === "date_ajout"
                    ? "date"
                    : "text"
                }
                value={form[key]}
                onChange={handleChange}
              />
            ))}

            {errorMessage && (
              <div style={{ color: "red", marginTop: "5px" }}>
                {errorMessage}
              </div>
            )}

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save" onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}