import { useState } from "react";

export default function RentRequestForm({ isOpen, onClose }) {
  const [rentData, setRentData] = useState({ amount: "", duration: "" });

  if (!isOpen) return null; // Don't render if modal is closed

  const handleChange = (e) => {
    setRentData({ ...rentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rent Request Submitted:", rentData);
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Rent Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="String"
              name="itemName"
              value={rentData.itemName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Items </label>
            <input
              type="number"
              name="number"
              value={rentData.number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration </label>
            <input
              type="string"
              name="duration"
              value={rentData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description </label>
            <input
              type="string"
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
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
