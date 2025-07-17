import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SetPrivilegePage() {
  const { userId } = useParams();
  console.log("previ",userId)
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [privileges, setPrivileges] = useState({}); // key = contentId, value = {can_read, can_update, can_delete}
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContents();
    fetchUserPrivileges();
  }, [userId]);

  const fetchContents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contents");
      setContents(res.data);
    } catch (err) {
      console.error("Failed to load contents:", err);
    }
  };

  const fetchUserPrivileges = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/privileges/${userId}`);
      const privilegeMap = {};
      res.data.forEach(priv => {
        privilegeMap[priv.content_id] = {
          can_read: priv.can_read === 1,
          can_update: priv.can_update === 1,
          can_delete: priv.can_delete === 1,
        };
      });
      // console.log(privilegeMap)
      setPrivileges(privilegeMap);
    } catch (err) {
      console.error("Failed to fetch privileges:", err);
    }
  };

  const handleCheckboxChange = (contentId, field) => {
    setPrivileges(prev => ({
      ...prev,
      [contentId]: {
        ...prev[contentId],
        [field]: !prev[contentId]?.[field],
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = contents.map(content => ({
        content_id: content.id,
        user_id: parseInt(userId),
        can_read: privileges[content.id]?.can_read ? 1 : 0,
        can_update: privileges[content.id]?.can_update ? 1 : 0,
        can_delete: privileges[content.id]?.can_delete ? 1 : 0,
      }));

      await axios.post("http://localhost:5000/api/privileges", payload);
      alert("Privileges updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error saving privileges:", err);
      setError("Failed to update privileges");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Set Privileges for User #{userId}</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <table className="w-full border border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Content Title</th>
              <th className="p-2 border text-center">Read</th>
              <th className="p-2 border text-center">Update</th>
              <th className="p-2 border text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {contents.map(content => (
              <tr key={content.id} className="border-t">
                <td className="p-2 border">{content.title}</td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={privileges[content.id]?.can_read || false}
                    onChange={() => handleCheckboxChange(content.id, "can_read")}
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={privileges[content.id]?.can_update || false}
                    onChange={() => handleCheckboxChange(content.id, "can_update")}
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={privileges[content.id]?.can_delete || false}
                    onChange={() => handleCheckboxChange(content.id, "can_delete")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Privileges
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetPrivilegePage;
