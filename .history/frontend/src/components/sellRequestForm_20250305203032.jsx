import { useState } from "react";

export default function SellRequestForm({ isOpen, onClose }) {
  const [sellData, setSellData] = useState({
    productName: "",
    price: "",
    noOfItems: "",
    description: "",
    sellerType: "",
    category: "",
  });

  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; // Don't render if modal is closed

  const handleChange = (e) => {
    setSellData({ ...sellData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productName", sellData.productName);
      formData.append("price", sellData.price);
      formData.append("noOfItems", sellData.noOfItems);
      formData.append("description", sellData.description);
      formData.append("sellerType", sellData.sellerType);
      formData.append("category", sellData.category);
      if (productImage) {
        formData.append("productImage", productImage);
      }

      const response = await fetch("http://localhost:3000/api/v1/products/createSell", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit sell request.");
      }

      const data = await response.json();
      console.log("Sell Request Submitted:", data);
      alert("Sell request submitted successfully!");
      onClose(); // Close modal
    } catch (error) {
      console.error("Error submitting sell request:", error);
      alert("Failed to submit sell request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Sell Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              value={sellData.productName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              value={sellData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          {/* Number of Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Items</label>
            <input
              type="number"
              name="numberOfItems"
              value={sellData.noOfItems}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={sellData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          {/* Seller Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Seller Type</label>
            <select
              name="sellerType"
              value={sellData.sellerType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="">Select Seller Type</option>
              <option value="shopkeeper">shopkeeper</option>
              <option value="individual">student</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={sellData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Product Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          {/* Buttons */}
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
