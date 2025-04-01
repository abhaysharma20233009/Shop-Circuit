import { useEffect, useState } from "react";

const AdminContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async() => {
   try{
    const response=await fetch("http://localhost:3000/api/v1/admin/contact-queries",
        {
          credentials:"include",

        }
    )
      
    const data = await response.json();
        console.log("Fetched Data:", data); // Debugging
      if (Array.isArray(data)) {
        setQueries(data);  // ✅ Ensure it's an array
      } else {
        console.error("Error: Data is not an array", data);
        setQueries([]);  // Prevent errors
      }
        setLoading(false);
      
   } catch (err) {
    setError("Failed to fetch rent requests.");
  }
  }, []);

  if (loading) return <p>Loading queries...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contact Queries</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query) => (
            <tr key={query._id} className="border">
              <td className="border p-2">{query.name}</td>
              <td className="border p-2">{query.email}</td>
              <td className="border p-2">{query.message}</td>
              <td className="border p-2">{query.status}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => alert("Redirecting to query details")}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminContactQueries;
