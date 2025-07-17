import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user info
    const yes =window.confirm("Are you sure \"Log-Out\"");
    if (yes)
      navigate("/login"); // Redirect to login
    
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg hover:bg-red-600 transition z-50"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
