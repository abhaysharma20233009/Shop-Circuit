import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API failure by setting placeholder products
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Smartphone", category: "Electronics", price: 299, image: "https://via.placeholder.com/150" },
        { id: 2, name: "Laptop", category: "Electronics", price: 799, image: "https://via.placeholder.com/150" },
        { id: 3, name: "Wristwatch", category: "Fashion", price: 99, image: "https://via.placeholder.com/150" },
        { id: 4, name: "Sneakers", category: "Fashion", price: 120, image: "https://via.placeholder.com/150" },
      ]);
    }, 1000);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white text-center py-16">
        <h1 className="text-4xl font-bold">Welcome to Shop Circuit</h1>
        <p className="text-lg mt-2">Buy & Sell Easily, Just Like OLX</p>
      </div>

      {/* Login & Signup Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => navigate("/login")} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
          Login
        </button>
        <button onClick={() => navigate("/signup")} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Signup
        </button>
      </div>

      {/* Product Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Product Card Component
const ProductCard = ({ product }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-40 object-cover rounded-md"
    />
    <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
    <p className="text-gray-500">{product.category}</p>
    <p className="text-blue-600 font-bold mt-1">${product.price}</p>
    <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
      View Details
    </button>
  </div>
);
