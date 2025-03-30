import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../../assets/loading.json"; // Ensure this file exists

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      toast.success("🎉 Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error(`❌ ${err.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#03001e] via-[#7303c0] to-[#ec38bc] text-white relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-black to-gray-900 opacity-50"
      ></motion.div>

      {/* Login Form Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl border border-purple-400"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-400">🔐 Login</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-purple-500 focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-purple-500 focus:ring-2 focus:ring-purple-300"
            required
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Player
                src={loadingAnimation}
                className="w-10 h-10"
                autoplay
                loop
              />
            ) : (
              "🚀 Login"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
