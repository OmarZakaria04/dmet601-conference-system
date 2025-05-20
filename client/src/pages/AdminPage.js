import React, { useState, useEffect } from "react";
import "./admin.css";
import Header from "../components/Header"; // ✅ Import

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    alert("Failed to delete user.");
  }
};



  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/update-role/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-container">
      <Header /> {/* ✅ Add header here */}
      <h1>Admin Dashboard</h1>
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="chair">Chair</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="author">Author</option>
                </select>
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="chair">Chair</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="author">Author</option>
                </select>
                <button onClick={() => handleDeleteUser(user._id)} style={{ marginLeft: "10px", color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
