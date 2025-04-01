import { useState } from "react";
import { useProductData } from "../store/productDataStore";
export default function FilterBar({ onFilter }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
   const {products,loading}=useProductData();
   console.log(products);
  const categories = ["All", "Stationary", "Shops", "Fashion", "Grocery", "Foods", "Vehicles"];



  return (
    <div className="flex flex-wrap gap-4 p-3 bg-gray-100 shadow-md items-center justify-center">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-3 py-1 rounded-md transition-all duration-500 ease-in-out ${
            selectedCategory === category ? "bg-blue-900 text-white" : "bg-white text-black border"
          }`}
          onClick={() => handleFilterChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
