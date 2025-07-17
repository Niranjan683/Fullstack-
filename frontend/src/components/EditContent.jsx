import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditContentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await axios.get(`http://localhost:5000/api/contents/${id}`);
        setContent(res.data);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content");
      }
    }

    fetchContent();
  }, [id]);

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/contents/${id}`, content);
      alert("Content updated successfully!");
      navigate("/index");
    } catch (err) {
      console.error("Error updating content:", err);
      setError("Failed to update content");
    }
  };  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Content</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <label htmlFor="" className="italic font-bold text-2xl text-blue-600 mb-2 block" >Title</label>
          <input
            type="text"
            name="title"
            value={content.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border px-3 py-2 rounded mb-7 block"
            required
          />

          <label htmlFor="" className="italic font-bold text-2xl text-blue-600 mb-2 block" >Description</label>
          <textarea
            name="description"
            value={content.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded h-40"
            required
          />

          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          
          <button type="button"
            onClick={() => navigate(`/content/view/${id}`)}
            className="w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditContentPage;
