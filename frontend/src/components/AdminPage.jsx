import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();


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
    <div className="min-h-screen bg-gray-100 py-10 px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700/70">Admin Page</h2>
        <div className="space-y-6">
          {users.map(user => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
              {editUser?.id === user.id ? (
                <div className="space-y-6">
                  <input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  <input value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  <div className="flex justify-around">
                    <button onClick={updateUser} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition ">Save</button>
                    <button onClick={()=>setEditUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition ">Cancel</button>
                  </div>
                </div> 
              ) : (
                <div className="flex justify-between  items-center">
                  <div >
                    <p className="font-semibold text-lg">{user.name} </p>
                    <p className="text-gray-500  text-sm"> {user.email} </p>
                  </div>
                  
                  <div className="space-x-4">
                    <button onClick={() => setEditUser(user)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Edit</button>
                    <button onClick={() => navigate(`/profile/${user.id}`)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">View Profile</button>
                    <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

