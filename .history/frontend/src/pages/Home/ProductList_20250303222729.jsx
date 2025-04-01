import { useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { useData } from "../../store/productDataStore.jsx";

const {products,loading}=useData();
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
