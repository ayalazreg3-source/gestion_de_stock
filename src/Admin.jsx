import React, { useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [search, setSearch] = useState("");

  const addUser = () => {
    if (name.trim() && email.trim()) {
      setUsers([...users, { name, email, role }]);
      setName("");
      setEmail("");
    } else {
      alert("الرجاء تعبئة الاسم و البريد");
    }
  };

  const deleteUser = (index) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      const newUsers = [...users];
      newUsers.splice(index, 1);
      setUsers(newUsers);
    }
  };

  const editUser = (index) => {
    const newName = prompt("الاسم الجديد:", users[index].name);
    const newEmail = prompt("البريد الجديد:", users[index].email);
    if (newName && newEmail) {
      const newUsers = [...users];
      newUsers[index] = { ...newUsers[index], name: newName, email: newEmail };
      setUsers(newUsers);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <h2> Admin</h2>

      {/* فورم إضافة مستخدم */}
      <div className="form-admin">
        <input
          type="text"
          placeholder="nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">utilisateurs</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={addUser}>Ajouter</button>
      </div>

      {/* البحث */}
      <input
        type="text"
        id="searchUser"
        placeholder="recherche"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* جدول المستخدمين */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>nom</th>
              <th>email</th>
              <th>role</th>
              <th>operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="5">Aucun utilisateurs</td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`role-badge ${user.role}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => editUser(index)}>modifier</button>{" "}
                    <button
                      onClick={() => deleteUser(index)}
                      className="delete-btn"
                    >
                      supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;