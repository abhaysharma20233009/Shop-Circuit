import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";

const SellRequestsCard = () => {
  const [sells, setSells] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch("/api/v1/products/userSells", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.status) {
          setSells(data.data);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRequestData();
  }, []);

  const handleMarkFulfilled = async (requestId) => {
    try {
      const response = await fetch(`/api/v1/products/markSold/${requestId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to mark request as fulfilled");

      setSells((prevSells) => prevSells.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error marking request as fulfilled:", error);
    }
  };

  const handleUpdateClick = (product) => {
    setEditingProduct({ ...product });
    setDropdownOpenId(null);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/v1/products/${editingProduct._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) throw new Error("Failed to update product");

      setSells((prevSells) =>
        prevSells.map((product) =>
          product._id === editingProduct._id ? { ...editingProduct } : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (requestId) => {
    try {
      const response = await fetch(`/api/v1/products/${requestId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete");

      setSells((prevSells) => prevSells.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-4 w-full border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 text-center">
       Your Sell Requests
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sells.length > 0 ? (
          sells.slice(0, visibleCount).map((sell) => (
            <div
              key={sell._id}
              className="relative p-6 bg-white/10 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <img
                src={sell.productImage}
                alt={sell.productName}
                className="w-full h-40 object-cover rounded-lg border border-cyan-500 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-cyan-300 mt-2">
                {sell.productName}
              </h3>
              <p className="text-gray-400 mt-2">
                Status:{" "}
                <span
                  className={`font-semibold ${sell.status === "pending"
                    ? "text-yellow-400"
                    : "text-green-400"
                    }`}
                >
                  {sell.status}
                </span>
              </p>
              <p className="text-gray-300">📦 Items: {sell.noOfItems}</p>
              <p className="text-gray-300">💰 Price: ${sell.price}</p>
              <p className="text-gray-300">📝 {sell.description}</p>

              {/* Dropdown Icon */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() =>
                    setDropdownOpenId(dropdownOpenId === sell._id ? null : sell._id)
                  }
                  className="text-white hover:text-cyan-300"
                >
                  <FaEllipsisV />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpenId === sell._id && (
                  <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 w-40">
                    {sell.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleMarkFulfilled(sell._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-green-600"
                        >
                          ✅ Mark Sold
                        </button>
                        <button
                          onClick={() => handleUpdateClick(sell)}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-600"
                        >
                          <FaEdit className="inline mr-1" />
                          Update
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(sell._id)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600"
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-lg">No sell requests found.</p>
        )}
      </div>

      {/* Update Modal */}
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Product</h2>
            <input
              type="text"
              value={editingProduct.productName}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, productName: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              value={editingProduct.noOfItems}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, noOfItems: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <button onClick={handleUpdate} className="w-full bg-blue-500 text-white p-2 rounded">
              Save Changes
            </button>
            <button
              onClick={() => setEditingProduct(null)}
              className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Show More Button */}
      {sells.length > 3 && visibleCount < sells.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount(visibleCount + 3)}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
          >
            🔽 Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default SellRequestsCard;
