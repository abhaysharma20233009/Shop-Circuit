import { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingPage from "./Loading";

export default function SellRequestForm({ isOpen, onClose }) {
  const [sellData, setSellData] = useState({
    productName: "",
    price: "",
    noOfItems: "",
    description: "",
    sellerType: "",
    category: "",
  });
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setSellData({ ...sellData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(sellData).forEach((key) => formData.append(key, sellData[key]));
      formData.append("image", image);

      const response = await fetch("/api/v1/products/createProduct", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit sell request.");
      }

      toast.success("Sell request submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit sell request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingPage />} {/* Ensure it renders at the highest level */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-lg">
        <div className="relative bg-white/10 border border-gray-700 shadow-2xl shadow-blue-500/30 rounded-xl p-6 w-[600px] backdrop-blur-lg">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <FaTimes size={18} />
          </button>
  
          <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">🛒 Sell Your Product 🚀</h2>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[{ label: "Product Name", name: "productName", type: "text" },
                { label: "Price ($)", name: "price", type: "number" },
                { label: "Number of Items", name: "noOfItems", type: "number" },
                { label: "Seller Type", name: "sellerType", options: ["shopkeeper", "student"] },
                { label: "Category", name: "category", options: ["electronics", "food", "vehicle", "fashion", "stationary"] }].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-300">{field.label}</label>
                    {field.options ? (
                      <select
                        name={field.name}
                        value={sellData[field.name]}
                        onChange={handleChange}
                        className="w-full p-3 mt-1 bg-gray-900/50 text-white border border-gray-600 rounded-lg"
                        required
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={sellData[field.name]}
                        onChange={handleChange}
                        className="w-full p-3 mt-1 bg-gray-900/50 text-white border border-gray-600 rounded-lg"
                        required
                      />
                    )}
                  </div>
                ))}
            </div>
  
            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Product Image</label>
              <div className="relative w-full p-3 border border-gray-600 rounded-lg bg-gray-900/50 flex items-center justify-center cursor-pointer hover:border-blue-400">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                <FaUpload className="text-blue-400 text-xl" />
                <span className="ml-2 text-gray-400">{image ? image.name : "Upload Image"}</span>
              </div>
            </div>
  
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                name="description"
                value={sellData.description}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-gray-900/50 text-white border border-gray-600 rounded-lg"
                required
              />
            </div>
  
            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800">
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}  