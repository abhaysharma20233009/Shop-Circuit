import { useState } from "react";

export default function FilterBar() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Stationary", "Shops", "Fashion", "Grocery", "Foods", "Vehicles"];

  return (
    <div className="flex flex-wrap gap-4 p-3 bg-gray-100 shadow-md items-center justify-center">
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
  );
}