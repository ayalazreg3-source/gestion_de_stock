
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Fournisseurs.css";

export default function Fournisseurs() {
  const apiUrl = "http://localhost:5000/fournisseurs";

  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    societe: "",
    telephone: "",
    email: "",
    adresse: "",
  });

  // ================= FETCH =================
  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const res = await axios.get(apiUrl);
      setList(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!form.nom ||! form.societe ||!form.telephone) {
      return alert("Nom, Société et Téléphone sont obligatoires !");
    }

    try {
      if (editIndex !== null) {
        // UPDATE
        const id = list[editIndex].id;
        await axios.put(`${apiUrl}/${id}`, form);

        const newList = [...list];
        newList[editIndex] = { ...form, id };
        setList(newList);
        setEditIndex(null);
      } else {
        // ADD
        const res = await axios.post(apiUrl, form);
        setList([...list, res.data]);
      }

      setForm({
        nom: "",
        societe: "",
        telephone: "",
        email: "",
        adresse: "",
      });

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ================= EDIT =================
  const handleEdit = (index) => {
    setForm({
      nom: list[index].nom || "",
      societe: list[index].societe || "",
      telephone: list[index].telephone || "",
      email: list[index].email || "",
      adresse: list[index].adresse || "",
    });

    setEditIndex(index);
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (index) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?"))
      return;

    try {
      const id = list[index].id;
      await axios.delete(`${apiUrl}/${id}`);

      setList(list.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ================= SEARCH =================
  const filteredList = list.filter(
    (f) =>
      f.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.societe?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <div className="header">
        <h2>Gestion des Fournisseurs</h2>
        <button
          onClick={() => {
            setForm({
              nom: "",
              societe: "",
              telephone: "",
              email: "",
              adresse: "",
            });
            setEditIndex(null);
            setShowModal(true);
          }}
        >
          + Add Fournisseur
        </button>
      </div>

      <input
        className="search"
        placeholder="Search fournisseur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Société</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">


Aucun fournisseur trouvé
              </td>
            </tr>
          ) : (
            filteredList.map((f, i) => (
              <tr key={f.id}>
                <td>{f.nom}</td>
                <td>{f.societe}</td>
                <td>{f.telephone}</td>
                <td>{f.email}</td>
                <td>{f.adresse}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(i)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(i)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {editIndex !== null
                ? "Edit Fournisseur"
                : "Add Fournisseur"}
            </h3>

            <input
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
            />
            <input
              name="societe"
              placeholder="Société"
              value={form.societe}
              onChange={handleChange}
            />
            <input
              name="telephone"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="adresse"
              placeholder="Adresse"
              value={form.adresse}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="save" onClick={handleSave}>
                {editIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
