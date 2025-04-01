import { useEffect, useState } from "react";
import { useProductData } from "../store/productDataStore";
export default function FilterBar() {
  const [selectedCategory, setSelectedCategory] = useState("All");
   const {products,loading}=useProductData();
   console.log(products);
  const categories = ["All", "Stationary", "Shops", "Fashion", "Grocery", "Foods", "Vehicles"];
  
  const getFilteredProducts = (category) => {
    if (category === "All") return products; // Return all products if "All" is selected

    let filteredProducts = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].category === category) {
        filteredProducts.push(products[i]);
      }
    }
    return filteredProducts;
  };

  const displayedProducts = getFilteredProducts(selectedCategory);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <div key={product._id} className="border p-4 shadow-md">
              <img
                src={product.imageCover}
                alt={product.productName}
                className="w-full h-40 object-cover"
              />
              <h3 className="text-lg font-semibold">{product.productName}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found for "{selectedCategory}".</p>
      )}
    </div>
  );
}
