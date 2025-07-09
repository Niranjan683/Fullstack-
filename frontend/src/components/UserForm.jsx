import { useState } from "react";
import axios from "axios";

function UserForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/users", form);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Form</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><br />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><br />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /><br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default UserForm;
