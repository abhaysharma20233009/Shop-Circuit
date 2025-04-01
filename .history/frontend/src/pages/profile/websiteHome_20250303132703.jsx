import { useState, useEffect } from "react";
import { Search, ShoppingBag, Tag } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch products from API (Replace with your actual API)
    fetch("http://localhost:3000/api/v1/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 🔥 Hero Section */}
      <div className="bg-blue-600 text-white text-center py-16">
        <h1 className="text-4xl font-bold">Welcome to Shop Circuit</h1>
        <p className="text-lg mt-2">Buy & Sell Easily, Just Like OLX</p>
      </div>

      {/* 🔎 Search Bar */}
      <div className="flex justify-center mt-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded-full pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* 🛍️ Product Categories */}
      <div className="flex justify-center gap-6 mt-8">
        <CategoryCard icon={<ShoppingBag />} label="Electronics" />
        <CategoryCard icon={<Tag />} label="Fashion" />
        <CategoryCard icon={<ShoppingBag />} label="Home & Living" />
        <CategoryCard icon={<Tag />} label="Vehicles" />
      </div>

      {/* 🏷️ Product Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

// 🔹 Category Card Component
const CategoryCard = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-blue-500 hover:text-white transition">
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

// 🔹 Product Card Component
const ProductCard = ({ product }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <img
      src={product.image || "https://via.placeholder.com/150"}
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
