import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 


function ProfilePage(){
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser(){
            const res = await axios.get(`http://localhost:5000/api/users/${id}`)
            setUser(res.data);

            setImageUrl(`http://localhost:5000/api/users/${id}/photo`);
        }

        fetchUser();
    
    }, [id]);
    
    if (!user) return <p>Loading....</p>;
    
    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <img
          src={imageUrl}
          alt="User"
          className="w-48 h-48 object-cover rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
    
        <button
          onClick={() => navigate("/admin")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Admin
        </button>
    
      </div>
    </div>
  );


}
export default ProfilePage;
