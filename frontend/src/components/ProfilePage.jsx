import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {
  const { id } = useParams();
  // console.log(id,'profile page')
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(res.data);
        if (res.data.photo) {
          console.log(`photo id ${res.data.photo}`)
          setProfileUrl(`http://localhost:5000/profile/${res.data.photo}`);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, [id]);

  if (!user) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
        <img
          src={profileUrl}
          alt="Profile"
          className="w-40 h-40 object-cover rounded-full mx-auto"
        />
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate(`/change-profile/${user.id}`)}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Change Profile Picture
          </button>

      

          <button
            onClick={() => navigate(`/user-photos/${user.id}`)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            See Other Images
          </button>


          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Back to Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
