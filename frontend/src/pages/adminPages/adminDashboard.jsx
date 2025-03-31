import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllProducts from "./allProducts.jsx";
import AllRent from "./allRents.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Styled Admin Dashboard Title */}
      <h1
        className="text-4xl font-extrabold uppercase tracking-wider text-center 
                     bg-gradient-to-r from-blue-500 to-purple-600 text-transparent 
                     bg-clip-text drop-shadow-lg"
      >
        Admin Dashboard
      </h1>

      <div className="grid-cols-2 gap-6">
        <AllProducts />
        <AllRent />
      </div>
    </div>
  );
};

export default AdminDashboard;
