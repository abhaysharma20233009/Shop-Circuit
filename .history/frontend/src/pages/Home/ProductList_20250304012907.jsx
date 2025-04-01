import { useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { useProductData } from "../../store/productDataStore.jsx";
import { FaSearch } from "react-icons/fa";


export default function ProductList() {
  const [visibleProducts, setVisibleProducts] = useState(5);
  const {products,loading}=useProductData();
  console.log(products);
  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Stationary", "Shops", "Fashion", "Grocery", "Foods", "Vehicles"];
  const handleFilterChange = (category) => {
    
  };
  return (
    <div>
       <div className={`flex flex-col md:flex-row items-center justify-between p-3 m-0 bg-gray-800 text-white`}>
       <div className="flex items-center gap-4 pb-2 flex-grow justify-center">
              <div className="relative  ">
                <input type="text" placeholder="Search..." className="p-2 rounded text-white border" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 "><FaSearch /></button>
              </div>
            </div>
       </div>
       <div className="flex flex-wrap gap-4 p-3 bg-gray-200 shadow-md items-center justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-md transition-all duration-500 ease-in-out ${
                  selectedCategory === category ? "bg-blue-900 text-white" : "bg-white text-black border"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
    <div className="pl-10 px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.slice(0, visibleProducts).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
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
    </div>
  );
}
