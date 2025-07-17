import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddContentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contents", {
        title,
        description,
      });
      alert("Content added successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error adding content:", err);
      alert("Failed to add content.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">Add New Content</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => {setTitle(e.target.value); console.log('e.target', e.target); console.log('e',e); console.log('title',title)}}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Add Content
        </button>
      </form>
    </div>
  );
}

export default AddContentPage;
