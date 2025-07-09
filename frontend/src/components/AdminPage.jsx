import { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    console.log(res)
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  const updateUser = async () => {
    await axios.put(`http://localhost:5000/api/users/${editUser.id}`, editUser);
    setEditUser(null);
    fetchUsers();
  };

  return (
    <div>
      <h2>Admin Page</h2>
      {users.map(user => (
        <div key={user.id}>
          {editUser?.id === user.id ? (
            < >
              <input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
              <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              <input value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} />
              <button onClick={updateUser}>Save</button>
            </>
          ) : (
            <>
              {user.name} - {user.email} <br />
              <button onClick={() => setEditUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminPage;

