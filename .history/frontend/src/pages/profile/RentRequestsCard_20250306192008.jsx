import { useEffect, useState } from 'react';
import axios from 'axios';

const RentRequestsCard = () => {
  const [rentRequests, setRentRequests] = useState([]);

  // Fetch rent requests
  useEffect(() => {
    axios.get(`/api/v1/rent/`) // Replace with actual user ID
      .then(response => setRentRequests(response.data.data))
      .catch(error => console.error('Error fetching rent requests:', error));
  }, []);

  // Handle Mark Fulfilled
  const handleMarkFulfilled = (requestId) => {
    axios.put(`/api/v1/rent/mark-fulfilled/${requestId}`)
      .then(() => {
        // Remove fulfilled request from UI
        setRentRequests(rentRequests.filter(req => req._id !== requestId));
      })
      .catch(error => console.error('Error marking request as fulfilled:', error));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Rent Requests</h2>
      <div className="grid grid-cols-3 gap-4">
        {rentRequests.length > 0 ? (
          rentRequests.map((request) => (
            <div key={request._id} className="p-4 border rounded shadow-md bg-white">
              <h3 className="text-lg font-semibold">{request.studentId.username}</h3>
              <p>Email: {request.studentId.email}</p>
              <p>Hostel: {request.studentId.hostelName}</p>
              <p>Room: {request.studentId.roomNumber}</p>
              <p>Contact: {request.studentId.contactNumber}</p>
              <p className="text-sm text-gray-600">Status: {request.status}</p>
              <button 
                onClick={() => handleMarkFulfilled(request._id)} 
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Mark Fulfilled
              </button>
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
