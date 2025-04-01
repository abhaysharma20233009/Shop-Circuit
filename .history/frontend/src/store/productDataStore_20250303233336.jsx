import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export const ProductsDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/products", {
          credentials: "include", // Include cookies for authentication
        });
        console.log(response);
        const data = await response.json();
        console.log(data.data.products);
        if (data.status) {
          setProducts(data.data.data);
          console.log("Products"+products);
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
  useEffect(() => {
    console.log("Updated Products:", products);
  }, [products]); 
  return (
    <DataContext.Provider value={{ products, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useProductData = () => useContext(DataContext);
