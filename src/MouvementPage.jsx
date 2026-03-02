
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MouvementPage.css";

const MouvementPage = () => {
  const [produits, setProduits] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [nouveauProduit, setNouveauProduit] = useState({
    id: "",
    nom: "",
    quantite: "",
  });
  const [recherche, setRecherche] = useState("");
  const [showSecret, setShowSecret] = useState({});

  const API_PRODUITS = "http://localhost:5000/produits";
  const API_MOUVEMENTS = "http://localhost:5000/mouvements";
  const API_RETRAIT = "http://localhost:5000/produits/retrait";

  useEffect(() => {
    fetchProduits();
    fetchMouvements();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get(API_PRODUITS);
      setProduits(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur produits");
    }
  };

  const fetchMouvements = async () => {
    try {
      const res = await axios.get(API_MOUVEMENTS);
      setMouvements(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur mouvements");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNouveauProduit({ ...nouveauProduit, [name]: value });
  };

  // ================= AJOUT =================
  const ajouterProduit = async () => {
    if (
      !nouveauProduit.id ||
      !nouveauProduit.nom ||
      !nouveauProduit.quantite
    )
      return alert("Remplir tous les champs");

    try {
      await axios.post(API_PRODUITS, {
        id: parseInt(nouveauProduit.id),
        nom: nouveauProduit.nom,
        quantite: parseInt(nouveauProduit.quantite),
      });

      fetchProduits();

      setNouveauProduit({
        id: "",
        nom: "",
        quantite: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de l'ajout");
    }
  };

  // ================= RETRAIT =================
  const retirerProduit = async (id, quantite) => {
    try {
      await axios.put(API_RETRAIT, {
        id: parseInt(id),
        quantite: parseInt(quantite),
      });

      fetchProduits();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.error === "Quantité insuffisante")
        alert("Quantité insuffisante !");
      else alert("Erreur serveur lors du retrait");
    }
  };

  const toggleSecret = (id) =>
    setShowSecret({ ...showSecret, [id]: !showSecret[id] });

  const produitsFiltres = produits.filter((p) =>
    p.nom?.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="mouvement-page">
      <h2>Page Mouvement</h2>

      <div className="form-ajout">
        <input
          type="number"
          name="id"
          placeholder="ID Produit"
          value={nouveauProduit.id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nom"
          placeholder="Nom Produit"
          value={nouveauProduit.nom}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantite"
          placeholder="Quantité"
          value={nouveauProduit.quantite}
          onChange={handleChange}
        />
        <button onClick={ajouterProduit}>
          Ajouter / Réception
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      <h3>Produits en stock</h3>
      <table className="mouvement-table">
        <thead>
          <tr>
            <th>ID Produit</th>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>


{produitsFiltres.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-row">
                Aucun produit trouvé
              </td>
            </tr>
          ) : (
            produitsFiltres.map((p) => (
              <tr key={p.id_produit}>
                <td>{p.id_produit}</td>
                <td>{p.nom}</td>
                <td>{p.quantite}</td>
                <td>
                  <button
                    onClick={() => {
                      const qte = prompt(
                        "Quantité à retirer :"
                      );
                      if (qte)
                        retirerProduit(
                          p.id_produit,
                          qte
                        );
                    }}
                  >
                    Retirer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>Historique des mouvements</h3>
      <table className="mouvement-table">
        <thead>
          <tr>
            <th>ID Mouvement</th>
            <th>ID Produit</th>
            <th>Client</th>
            <th>Fournisseur</th>
            <th>Type</th>
            <th>Quantité</th>
            <th>Date</th>
            <th>Voir Secret</th>
          </tr>
        </thead>
        <tbody>
          {mouvements.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty-row">
                Aucun mouvement enregistré
              </td>
            </tr>
          ) : (
            mouvements.map((m) => (
              <tr key={m.id_mouvement}>
                <td>{m.id_mouvement}</td>
                <td>{m.id_produit}</td>
                <td>
                  {showSecret[m.id_mouvement]
                    ? m.id_client || "-"
                    : "***"}
                </td>
                <td>
                  {showSecret[m.id_mouvement]
                    ? m.id_fournisseur || "-"
                    : "***"}
                </td>
                <td>{m.type}</td>
                <td>{m.quantite}</td>
                <td>{m.date}</td>
                <td>
                  <button
                    onClick={() =>
                      toggleSecret(m.id_mouvement)
                    }
                  >
                    {showSecret[m.id_mouvement]
                      ? "Cacher"
                      : "Afficher"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MouvementPage;
