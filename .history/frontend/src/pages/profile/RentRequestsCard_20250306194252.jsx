import { useEffect, useState } from 'react';
import axios from 'axios';

const RentRequestsCard = () => {
  const [rentRequests, setRentRequests] = useState([]);


  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/rent/", {
          credentials: "include", // Include cookies for authentication
        });
        console.log(response);
        const data = await response.json();
        console.log(data.data);
        if (data.status) {
          setRentRequests(data.data);
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
        const response = await fetch(`http://localhost:3000/api/v1/rent/rent/${requestId}`, {
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
        setRentRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
    
      } catch (error) {
        console.error('Error marking request as fulfilled:', error);
      }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Rent Requests</h2>
      <div className="grid grid-cols-3 gap-4">
        {rentRequests.length > 0 ? (
          rentRequests.map((request) => (
            <div key={request._id} className="p-4 border rounded shadow-md bg-white">
              <h3 className="text-lg font-semibold">{request.itemName}</h3>
              <p className="text-sm text-gray-600">Status: {request.status}</p>
             {
                request.status==='pending'&& <button 
                onClick={() => handleMarkFulfilled(request._id)} 
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Mark Fulfilled
              </button>
             }
              <p>number of items: {request.numberOfItems}</p>
              <p>description: {request.description}</p>
              <p>duration: {request.duration}</p>
             
            </div>
          ))
        ) : (
          <p>No pending rent requests found.</p>
        )}
      </div>
    </div>
  );
};

export default RentRequestsCard;
