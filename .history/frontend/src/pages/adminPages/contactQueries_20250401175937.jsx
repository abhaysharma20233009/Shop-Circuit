import { useEffect, useState } from "react";
import LoadingPage from "../../components/Loading";

const AdminContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Number of queries per page

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/v1/admin/contact-queries?page=${currentPage}&limit=${limit}`,
          { credentials: "include" }
        );

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (Array.isArray(data)) {
          setQueries(data);
          setTotalPages(data.totalPages || 1);
        } else {
          console.error("Error: Unexpected data format", data);
          setQueries([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setQueries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [currentPage]); // Re-fetch when page changes

  if (loading) return <LoadingPage />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-200">Contact Queries</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {queries.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No queries found.</td>
              </tr>
            ) : (
              queries.map((query, index) => (
                <tr key={query._id} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                  <td className="p-3 border-b">{query.name}</td>
                  <td className="p-3 border-b">{query.email}</td>
                  <td className="p-3 border-b">{query.message}</td>
                  <td className={`p-3 border-b font-semibold ${query.status === "New" ? "text-blue-600" : "text-green-600"}`}>
                    {query.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1} 
          className="px-4 py-2 mx-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-300 px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>

        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages} 
          className="px-4 py-2 mx-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminContactQueries;
