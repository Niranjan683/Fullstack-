import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminAllContents() {
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllContents();
  }, []);

  const fetchAllContents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contents");
      setContents(res.data);
    } catch (err) {
      console.error("Failed to fetch contents", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/contents/${id}`);
      setContents(contents.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete content", err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">All Contents (Admin View)</h2>
      {contents.length === 0 ? (
        <p className="text-gray-600 text-center">No content found.</p>
      ) : (
        <ul className="space-y-4">
          {contents.map(content => (
            <li key={content.id} className="border p-4 rounded bg-white shadow">
              <h3 className="text-xl font-semibold text-blue-700">{content.title}</h3>
              <p className="text-gray-700">
                {content.description.length > 150
                  ? content.description.substring(0, 150) + "..."
                  : content.description}
              </p>
              <div className="mt-4 space-x-3">
                <button
                  onClick={() => navigate(`/content/view/${content.id}`)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/content/edit/${content.id}`)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(content.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminAllContents;
