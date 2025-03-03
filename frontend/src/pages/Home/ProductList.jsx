import { useState } from "react";
import ProductCard from "./ProductCard.jsx";

const products = [
  { id: 1, name: "Laptop", description: "High-performance laptop", seller: "John Doe", address: "New York, USA", price: 999, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Smartphone", description: "Latest model smartphone", seller: "Jane Smith", address: "Los Angeles, USA", price: 699, image: "https://via.placeholder.com/150" },
  { id: 3, name: "Headphones", description: "Noise-cancelling headphones", seller: "Mike Johnson", address: "Chicago, USA", price: 199, image: "https://via.placeholder.com/150" },
  { id: 4, name: "Camera", description: "Professional DSLR camera", seller: "Sarah Williams", address: "Houston, USA", price: 1200, image: "https://via.placeholder.com/150" },
  { id: 5, name: "Smartwatch", description: "Feature-packed smartwatch", seller: "Chris Brown", address: "San Francisco, USA", price: 299, image: "https://via.placeholder.com/150" },
  { id: 6, name: "Tablet", description: "10-inch display tablet", seller: "Emily Davis", address: "Seattle, USA", price: 450, image: "https://via.placeholder.com/150" },
  { id: 7, name: "Laptop", description: "High-performance laptop", seller: "John Doe", address: "New York, USA", price: 999, image: "https://via.placeholder.com/150" },
  { id: 8, name: "Smartphone", description: "Latest model smartphone", seller: "Jane Smith", address: "Los Angeles, USA", price: 699, image: "https://via.placeholder.com/150" },
  { id: 9, name: "Headphones", description: "Noise-cancelling headphones", seller: "Mike Johnson", address: "Chicago, USA", price: 199, image: "https://via.placeholder.com/150" },
  { id: 10, name: "Camera", description: "Professional DSLR camera", seller: "Sarah Williams", address: "Houston, USA", price: 1200, image: "https://via.placeholder.com/150" },
  { id: 11, name: "Smartwatch", description: "Feature-packed smartwatch", seller: "Chris Brown", address: "San Francisco, USA", price: 299, image: "https://via.placeholder.com/150" },
  { id: 12, name: "Tablet", description: "10-inch display tablet", seller: "Emily Davis", address: "Seattle, USA", price: 450, image: "https://via.placeholder.com/150" },
];

export default function ProductList() {
  const [visibleProducts, setVisibleProducts] = useState(5);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  return (
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
  );
}
