import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function UserPhotosPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchPhotos();

  }, [id]);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-photos/${id}`);
      setPhotos(res.data);
    } catch (err) {
      console.error("Failed to load photos:", err);
    }
  };

  // console.log('sadhflkahs',photos)

  const handleDelete = async (photoId) => {
    try {
      console.log('before delete')
      await axios.delete(`http://localhost:5000/api/user-photo/${photoId}`);
      console.log('after delete')
      // setPhotos(photos.filter((p) => p.id !== photoId));
      fetchPhotos();
    } catch (err) {
      console.error("Error deleting photo:", err);
    }
  };

  const handleNewImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleUpload = async () => {
    if (newImages.length === 0) return alert("Please select at least one image.");
    console.log('new Images', newImages);
    
    const formData = new FormData();
    newImages.forEach((file) => formData.append("photos", file));

    try {
      await axios.post(`http://localhost:5000/api/user-photos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewImages([]);
      fetchPhotos();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-3xl bg-white shadow-md p-6 rounded-xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">User Uploaded Images</h2>

        {photos.length === 0 ? (
          <p className="text-center text-gray-500">No images found for this user.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.photo_path} className="relative group">
                <img
                  src={photo.url}
                  alt="User uploaded"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  onClick={() => handleDelete(photo.photo_path)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hidden group-hover:block"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">Upload More Images</h3>
          <input
            type="file"
            multiple
            onChange={handleNewImageChange}
            className="mb-2"
          />

          {newImages.length > 0 && (
            <ul className="mb-4 text-sm text-gray-600 list-disc list-inside">
              {[...newImages].map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}

          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Upload Selected Images
          </button>
        </div>

        <button
          onClick={() => navigate(`/profile/${id}`)}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}

export default UserPhotosPage;
