import { useState } from "react";

export default function SellRequestForm({ isOpen, onClose }) {
  const [rentData, setRentData] = useState({
    itemName: "",
    numberOfItems: "",
    duration: "",
    description: "",
    status:"pending",
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
      const response = await fetch("http://localhost:3000/api/v1/rent/rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify(rentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rent request.");
      }

      const data = await response.json();
      console.log("Rent Request Submitted:", data);
      alert("Rent request submitted successfully!");
      onClose(); // Close modal
    } catch (error) {
      console.error("Error submitting rent request:", error);
      alert("Failed to submit rent request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Sell Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={rentData.itemName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Items</label>
            <input
              type="number"
              name="numberOfItems"
              value={rentData.numberOfItems}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (months)</label>
            <input
              type="text"
              name="duration"
              value={rentData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={rentData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
