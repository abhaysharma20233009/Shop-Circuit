import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../../assets/loading.json";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "student",
    shopName: "",
    shopAddress: "",
    hostelName: "",
    roomNumber: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      toast.success("Signup successful! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-800 to-black opacity-70"
      />
      
      {/* Signup Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl border border-purple-500"
      >
        <h2 className="text-3xl font-bold text-center text-purple-400">🚀 Sign Up</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="username" placeholder="Username" onChange={handleChange} className="input-field" required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input-field" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input-field" required />
            <input type="password" name="passwordConfirm" placeholder="Confirm Password" onChange={handleChange} className="input-field" required />
          </div>

          <select name="role" onChange={handleChange} className="input-field">
            <option value="student" className="bg-purple-800">Student</option>
            <option value="shopkeeper" className="bg-gray-800">Shopkeeper</option>
          </select>

          {formData.role === "shopkeeper" ? (
            <>
              <input type="text" name="shopName" placeholder="Shop Name" onChange={handleChange} className="input-field" required />
              <input type="text" name="shopAddress" placeholder="Shop Address" onChange={handleChange} className="input-field" required />
            </>
          ) : (
            <>
              <input type="text" name="hostelName" placeholder="Hostel Name" onChange={handleChange} className="input-field" required />
              <input type="text" name="roomNumber" placeholder="Room Number" onChange={handleChange} className="input-field" required />
            </>
          )}

          <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} className="input-field" required />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Player src={loadingAnimation} className="w-10 h-10" autoplay loop />
            ) : (
              "⚡ Sign Up"
            )}
          </motion.button>
        </form>
      </motion.div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(128, 0, 128, 0.5);
          border-radius: 10px;
          outline: none;
          transition: all 0.3s ease-in-out;
        }
        .input-field:focus {
          border-color: #9b59b6;
          box-shadow: 0 0 10px rgba(155, 89, 182, 0.8);
        }
      `}</style>
    </div>
  );
}
