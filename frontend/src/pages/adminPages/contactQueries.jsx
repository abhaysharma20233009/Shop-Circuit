import { useEffect, useState } from "react";
import LoadingPage from "../../components/Loading";

const AdminContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/admin/contact-queries", {
        credentials: "include",
      });


      const data = await response.json();
      console.log("Fetched Data:", data);

      if (Array.isArray(data)) {
        setQueries(data);
      } else {
        console.error("Error: Data is not an array", data);
        setQueries([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (queryId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/contact-queries/${queryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setQueries(queries.filter(query => query._id !== queryId));
      } else {
        console.error("Failed to delete query");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

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
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No queries found.
                </td>
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
                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleDelete(query._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContactQueries;
