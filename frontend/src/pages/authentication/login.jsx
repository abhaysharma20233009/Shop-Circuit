import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../../assets/loading.json"; // Ensure this path is correct
import { FiMail, FiLock, FiLogIn, FiUserPlus, FiHelpCircle } from "react-icons/fi"; // Added icons

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
        credentials: "include", // Keep if needed for cookies/sessions
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      toast.success("🎉 Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 2000, // Slightly faster redirect feedback
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark", // Use dark theme for toast to match UI
      });


      if (data.role === "admin") {
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      } else {
        setTimeout(() => navigate("/dashboard"), 2000);
      }

    } catch (err) {
      toast.error(`❌ ${err.message}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark", // Use dark theme for toast
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0a031a] via-[#1a0433] to-[#05010d] text-gray-200 p-4 relative overflow-hidden">

      {/* Subtle Animated Background Elements (Optional Enhancement) */}
      {/* Example: Could add subtle moving stars or particles here */}
       <div className="absolute inset-0 opacity-20">
         {/* Placeholder for more complex background animations if desired */}
         <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-600 rounded-full filter blur-3xl animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-600 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
       </div>

      {/* Login Form Card - Enhanced Glassmorphism */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} // Smoother easing
        className="relative w-full max-w-md p-8 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-lg shadow-2xl shadow-purple-900/30 rounded-2xl border border-purple-400/30 z-10"
      >

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold text-center mb-8 flex items-center justify-center gap-2"
        >
           <FiLock className="text-cyan-400" />
           <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
             Secure Login
           </span>
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input with Icon */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 pl-10 bg-black/20 text-gray-200 rounded-lg border border-purple-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 outline-none transition-all duration-300 placeholder-gray-500"
              required
            />
          </motion.div>

          {/* Password Input with Icon */}
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4, duration: 0.5 }}
             className="relative"
          >
            <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pl-10 bg-black/20 text-gray-200 rounded-lg border border-purple-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 outline-none transition-all duration-300 placeholder-gray-500"
              required
            />
          </motion.div>

          {/* Submit Button - Animated Style */}
           <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            type="submit"
            className={`group relative w-full inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-wide text-white transition duration-300 ease-out border-2 ${
                loading
                ? "border-gray-500 cursor-not-allowed"
                : "border-cyan-500 hover:shadow-cyan-500/50"
            } rounded-lg shadow-md`}
            disabled={loading}
           >
            {loading ? (
                 <Player
                   src={loadingAnimation}
                   className="w-8 h-8" // Adjust size as needed
                   autoplay
                   loop
                 />
            ) : (
              <>
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-cyan-600 group-hover:translate-x-0 ease">
                  <FiLogIn className="w-6 h-6" />
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-cyan-400 transition-all duration-300 transform group-hover:translate-x-full ease">
                  Login
                </span>
                <span className="relative invisible">Login</span> {/* For sizing */}
              </>
            )}
           </motion.button>
        </form>

        {/* Additional Links - Added */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center text-sm flex flex-col sm:flex-row justify-between items-center gap-2"
        >
          <Link
            to="/forgot-password" // Update route as needed
            className="text-gray-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1"
          >
             <FiHelpCircle size={14}/> Forgot Password?
          </Link>
          <Link
            to="/signup" // Use Link for internal navigation
            className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-200 flex items-center gap-1"
          >
            <FiUserPlus size={14}/> Don't have an account? Sign Up
          </Link>
        </motion.div>

         {/* Optional: Add a subtle bottom glow to the card */}
         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg"></div>


      </motion.div>
    </div>
  );
}