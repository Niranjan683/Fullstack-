import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewContentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userRole = user?.role; // 0 = admin
  console.log(userRole, 'user rolle')
  // console.log('UserRole', user?.role);
  // console.log('UserRole', user?.user);
  // console.log(userRole);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await axios.get(`http://localhost:5000/api/contents/${id}`);
        setContent(res.data);
      } catch (err) {
        console.error("Failed to load content:", err);
      }
    }

    async function checkPrivileges() {
      if (userRole === 0) {
        setCanEdit(true); // Admins can always edit
      } else {
        try {
          const res = await axios.get(`http://localhost:5000/api/privileges/${userId}/${id}`);
          // console.log()
          setCanEdit(res.data.can_update); // Check user privileges
        } catch (err) {
          console.error("Error checking privileges", err);
        }
      }
    }

    if (id) {
      fetchContent();
      checkPrivileges();
    }
  }, [id, userId, userRole]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-6 shadow rounded-lg">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">{content.title}</h2>
        <p className="text-gray-700 whitespace-pre-line">{content.description}</p>
        <div className="flex">
          
          <button
            onClick={() => {
              if (userRole===0){
                navigate("/admin/all-contents")
              }else{
                navigate("/index")
              }
            }}
            className="mt-8 mr-5 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400 hover:text-black"
          >
            Back to List
          </button>

          <button
            onClick={() => {
              if (canEdit) {
                navigate(`/content/edit/${content.id}`);
              } else {
                alert("You do not have permission to edit this content.");
              }
            }}
            disabled={!canEdit}
            className={`mt-8 px-4 py-2 rounded ${
              canEdit
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewContentPage;
