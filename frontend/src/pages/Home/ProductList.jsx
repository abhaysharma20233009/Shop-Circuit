import { useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { useProductData } from "../../store/productDataStore.jsx";
import { FaSearch } from "react-icons/fa";
import LoadingPage from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import BannerScroller from "./BannerScroller.jsx";

export default function ProductList() {
  const navigate = useNavigate();
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { products, loading } = useProductData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Stationary", "Fashion", "Grocery", "Food", "Vehicle", "Electronics"];

  // Function to filter products
  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-1">
      
      {/* Sticky Container for Filter & Search */}
      <div className=" w-full z-10 bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between p-2">
          <h1 className="text-white text-lg font-bold">🔍 Search & Filter</h1>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full p-2 pl-10 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all">
              <FaSearch />
            </button>
          </div>

          {/* Rents & Sells Buttons */}
          <div className="flex gap-3 mt-2 md:mt-0">
            <button className="px-4 py-1 bg-purple-500 text-white rounded-md font-semibold hover:bg-purple-600 transition-all" onClick={() => navigate("/rents")}>
              Rents
            </button>
            <button className="px-4 py-1 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-all" onClick={() => navigate("/sells")}>
              Sells
            </button>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center py-2 bg-gray-800/90">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-blue-500/50 scale-105"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      {/* Banner Scroller */}
      <BannerScroller />

      {/* Product List */}
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-center text-white mb-6">🛍 Explore Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {getFilteredProducts().slice(0, visibleProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {visibleProducts < getFilteredProducts().length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMoreProducts}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
              >
                🔄 Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
