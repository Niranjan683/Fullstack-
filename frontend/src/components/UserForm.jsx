import { useState } from "react";
import axios from "axios";


function UserForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [photo, setPhoto] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault(); // it dont allow the page to refres 
    console.log(e)
    const formData = new FormData();
    formData.append("name",form.name);
    formData.append("email",form.email);
    formData.append("password",form.name);
    formData.append("photo",photo);
    console.log(formData);  
    await axios.post("http://localhost:5000/api/users", formData, {headers: {"Content-Type":"multipart/form-data"}});
    setForm({ name: "", email: "", password: "" });
    setPhoto(null);
    console.log("after submit")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-700">User Form</h2>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border-2 border-indigo-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" /><br />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border-2 border-indigo-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/><br />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2 border-2 border-indigo-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/><br />
        <input   className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
             file:rounded-lg file:border-0 file:text-sm file:font-semibold 
             file:bg-blue-500 file:text-white hover:file:bg-blue-600 
             transition duration-200" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}/><br />
      
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition" >Submit</button>
      </form>
    </div>
  );
}

export default UserForm;
