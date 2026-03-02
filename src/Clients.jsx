import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Clients.css";

export default function Clients() {
  const apiUrl = "http://localhost:5000/clients";

  const initialForm = {
    nom: "",
    telephone: "",
    adresse: "",
    email: "",
    type: "",
  };

  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);

  // ====================== FETCH CLIENTS ======================
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get(apiUrl);
      setList(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ====================== SAVE CLIENT ======================
  const handleSave = async () => {
    if (
      !form.nom.trim() ||
      !form.telephone.trim() ||
      !form.adresse.trim()
    ) {
      return alert("Nom, Telephone et Adresse sont obligatoires !");
    }

    try {
      if (editId !== null) {
        // ✅ UPDATE
        await axios.put(`${apiUrl}/${editId}`, form);
      } else {
        // ✅ ADD
        await axios.post(apiUrl, form);
      }

      await fetchClients();
      setForm(initialForm);
      setEditId(null);
      setShowModal(false);
    } catch (err) {
      console.error(
        "Server error:",
        err.response?.data || err.message
      );
      alert("Erreur serveur");
    }
  };

  // ====================== EDIT ======================
  const handleEdit = (client) => {
    setForm({
      nom: client.nom || "",
      telephone: client.telephone || "",
      adresse: client.adresse || "",
      email: client.email || "",
      type: client.type || "",
    });

    setEditId(client.id_client);
    setShowModal(true);
  };

  // ====================== DELETE ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;

    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchClients();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    }
  };

  return (
    <div className="page">
      <div className="header">
        <h2>Gestion des Clients</h2>
        <button
          type="button"
          onClick={() => {
            setForm(initialForm);
            setEditId(null);
            setShowModal(true);
          }}
        >
          + Add Client
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="7">No clients yet</td>
            </tr>
          ) : (
            list.map((c) => (
              <tr key={c.id_client}>
                <td>{c.id_client}</td>
                <td>{c.nom}</td>
                <td>{c.telephone}</td>
                <td>{c.adresse}</td>
                <td>{c.email}</td>
                <td>{c.type}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id_client)}
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
            <h3>{editId ? "Edit Client" : "Add Client"}</h3>
            <input
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
            />
            <input
              name="telephone"
              placeholder="Telephone"
              value={form.telephone}
              onChange={handleChange}
            />
            <input
              name="adresse"
              placeholder="Adresse"
              value={form.adresse}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="type"
              placeholder="Type Client"
              value={form.type}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="button" onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}