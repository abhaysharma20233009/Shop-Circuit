import { useState, useEffect } from "react";

export default function AllRequests() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/rent/rent", {
          credentials: "include",
        });
        const data = await response.json();
        console.log("data"+data); 
        if (data.status === "success") {
          setProducts(data.data);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  return (
    <div className="pl-10 px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Requests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.slice(0, visibleProducts).map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mt-2">{product.itemName}</h2>
            <p className="text-gray-600">Items required: {product.numberOfItems}</p>
            <p className="text-gray-600">status: {product.status}</p>
            <p className="text-gray-600">description: {product.description}</p>
            <p className="text-gray-800 font-medium">Renter: {product.studentId.username}</p>
            {product.studentId && (
              <div className="mt-2 text-gray-700">
                <p>Contact: {product.studentId.contactNumber}</p>
                <p>Hostel: {product.studentId.hostelName}</p>
                <p>Room: {product.studentId.roomNumber}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {visibleProducts < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreProducts}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
