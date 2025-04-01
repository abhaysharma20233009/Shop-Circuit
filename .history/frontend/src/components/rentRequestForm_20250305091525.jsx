import { useState } from "react";
import axios from "axios";

export default function RentRequestForm({ isOpen, onClose }) {
  const [rentData, setRentData] = useState({
    itemName: "",
    number: "",
    duration: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; // Don't render if modal is closed

  const handleChange = (e) => {
    setRentData({ ...rentData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRentData({ ...rentData, image: file });
      setPreview(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("itemName", rentData.itemName);
    formData.append("number", rentData.number);
    formData.append("duration", rentData.duration);
    formData.append("description", rentData.description);
    if (rentData.image) {
      formData.append("image", rentData.image);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/rent/rent", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Rent Request Submitted:", response.data);
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
        <h2 className="text-xl font-bold mb-4 text-center">Rent Request</h2>
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
              name="number"
              value={rentData.number}
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

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
            )}
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
