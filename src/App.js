import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import UserList from "./UserList";
import { BASE_URL } from "./firebase";

export default function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}.json`);
      const data = res.data;
      const userArray = data
        ? Object.entries(data).map(([id, user]) => ({ id, ...user }))
        : [];
      setUsers(userArray);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const addUser = async (user) => {
    try {
      await axios.post(`${BASE_URL}.json`, user);
      fetchUsers();
    } catch (err) {
      setError("Failed to add user");
    }
  };

  const updateUser = async (user) => {
    try {
      await axios.patch(`${BASE_URL}/${user.id}.json`, {
        name: user.name,
        email: user.email,
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}.json`);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleSubmit = (user) => {
    if (editingUser) {
      updateUser(user);
    } else {
      addUser(user);
    }
  };

  const handleEdit = (user) => setEditingUser(user);

  const handleDelete = (id) => deleteUser(id);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User Management System</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <UserForm onSubmit={handleSubmit} editingUser={editingUser} />
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
