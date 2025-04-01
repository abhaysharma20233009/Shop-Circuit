import { useEffect, useState } from 'react';
import axios from 'axios';

const RentRequestsCard = () => {
  const [sells, setSells] = useState([]);


  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/products/userSells", {
          credentials: "include", // Include cookies for authentication
        });
        console.log(response);
        const data = await response.json();
        console.log(data.data);
        if (data.status) {
          setSells(data.data);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } 
    };

    fetchRequestData();
  }, []);
  

  // Handle Mark Fulfilled
  const handleMarkFulfilled = async(requestId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/products/markSold/${requestId}`, {
          method: 'PUT',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to mark request as fulfilled');
        }
    
        // Remove fulfilled request from UI
        setSells(prevSells => prevSells.filter(req => req._id !== requestId));
    
      } catch (error) {
        console.error('Error marking request as fulfilled:', error);
      }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Sells</h2>
      <div className="grid grid-cols-3 gap-4">
        {sells.length > 0 ? (
          sells.map((sell) => (
            <div key={sell._id} className="p-4 border rounded shadow-md bg-white">
              <h3 className="text-lg font-semibold">{sell.productName}</h3>
              <img
              src={product.productImage}
              alt={product.productName}
              className="w-full h-40 object-cover rounded-md"
            />
              <p className="text-sm text-gray-600">Status: {sell.status}</p>
             {
                sell.status==='pending'&& <button 
                onClick={() => handleMarkFulfilled(sell._id)} 
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Mark Sold
              </button>
             }
              <p>number of items: {sell.noOfItems}</p>
              <p>description: {sell.description}</p>
           
             
            </div>
          ))
        ) : (
          <p>No sell found.</p>
        )}
      </div>
    </div>
  );
};

export default RentRequestsCard;
