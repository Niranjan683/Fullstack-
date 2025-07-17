import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";

function IndexPage() {
  const [contents, setContents] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const uid = user?.id;

    if (!uid) {
      navigate("/login");
      return;
    }

    setUserId(uid);
    fetchContents();
    fetchPrivileges(uid);
  }, []);

  const fetchContents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contents");
      setContents(res.data);
    } catch (err) {
      console.error("Failed to fetch contents:", err);
    }
  };

  const fetchPrivileges = async (uid) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/privileges/${uid}`);
      setPrivileges(res.data);
    } catch (err) {
      console.error("Failed to fetch privileges", err);
    }
  };

  const getPrivilege = (contentId) => {
    return privileges.find(p => p.content_id === contentId) || {};
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/contents/${id}`);
      setContents(contents.filter(content => content.id !== id));
    } catch (err) {
      console.error("Failed to delete content:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <LogoutButton />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Content List</h2>

        {contents.length === 0 ? (
          <p className="text-center text-gray-500">No content available.</p>
        ) : (
          <ul className="space-y-4">
            {contents.map(content => {
              const { can_read, can_delete } = getPrivilege(content.id);

              return (
                <li key={content.id} className="border p-4 rounded shadow-sm bg-gray-50">
                  <h3 className="text-xl font-semibold">{content.title}</h3>
                  <p className="text-gray-600">
                    {content.description.length > 150
                      ? content.description.substring(0, 150) + "..."
                      : content.description}
                  </p>

                  <div className="mt-4 space-x-3">
                    {/* View Button */}
                    <button
                      onClick={() => {
                        if (!can_read) {
                          alert("Access denied: You do not have permission to view this content.");
                          return;
                        }
                        navigate(`/content/view/${content.id}`);
                      }}
                      className={`px-4 py-1 rounded transition ${
                        can_read
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      View
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (!can_delete) {
                          alert("Access denied: You do not have permission to delete this content.");
                          return;
                        }
                        handleDelete(content.id);
                      }}
                      className={`px-4 py-1 rounded transition ${
                        can_delete
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Delete
                    </button>
                  </div>

                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default IndexPage;
