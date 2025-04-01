import { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Font Awesome Close Icon
import { toast } from "react-toastify"; // Toast notifications
import LoadingPage from "./Loading";

export default function RentRequestForm({ isOpen, onClose }) {
  const [rentData, setRentData] = useState({
    itemName: "",
    numberOfItems: "",
    duration: "",
    description: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; // Don't render if modal is closed

  const handleChange = (e) => {
    setRentData({ ...rentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/v1/rent/rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(rentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rent request.");
      }

      toast.success("Rent request submitted successfully! 🎉");
      onClose(); // Close modal after successful submission
    } catch (error) {
      toast.error("Failed to submit rent request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingPage />} {/* Display LoadingPage when loading */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-lg">
        <div className="relative bg-white/10 border border-gray-700 shadow-2xl shadow-blue-500/30 rounded-xl p-6 w-96 backdrop-blur-lg">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-transform hover:scale-110"
          >
            <FaTimes size={18} />
          </button>

          <h2 className="text-2xl font-bold text-center text-blue-400 mb-6 neon-text">
            🚀 Rent Request 🚀
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Fields */}
            {[
              { label: "Item Name", name: "itemName", type: "text" },
              {
                label: "Number of Items",
                name: "numberOfItems",
                type: "number",
              },
              { label: "Duration (months)", name: "duration", type: "text" },
              { label: "Description", name: "description", type: "text" },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-300">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={rentData[field.name]}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 bg-gray-900/50 text-white border border-gray-600 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
