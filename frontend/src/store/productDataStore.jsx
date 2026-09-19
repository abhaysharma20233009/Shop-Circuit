import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export const ProductsDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/v1/products", {
          credentials: "include", // Include cookies for authentication
        });
        const data = await response.json();
        if (data.status) {
          setProducts(data.data.products);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  return (
    <DataContext.Provider value={{ products, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useProductData = () => useContext(DataContext);
