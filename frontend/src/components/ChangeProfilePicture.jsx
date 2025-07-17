import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ChangeProfilePicture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("profile", photo);

    try {
        console.log('hihi')
      await axios.put(`http://localhost:5000/api/users/${id}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile picture updated!");
      navigate(`/profile/${id}`); // redirect to profile page
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      alert("Failed to update profile picture.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold text-center">Change Profile Picture</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full border border-gray-300 p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Upload
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ChangeProfilePicture;
