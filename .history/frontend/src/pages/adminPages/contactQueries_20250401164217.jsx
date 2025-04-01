import { useEffect, useState } from "react";

const AdminContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/v1/admin/contact-queries", {
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

    fetchQueries();
  }, []);

  if (loading) return <p className="text-center text-lg font-semibold">Loading queries...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Contact Queries</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Message</th>
              <th className="border p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {queries.length > 0 ? (
              queries.map((query, index) => (
                <tr
                  key={query._id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="border p-3">{query.name}</td>
                  <td className="border p-3">{query.email}</td>
                  <td className="border p-3">{query.message}</td>
                  <td className="border p-3 font-semibold">{query.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-4 text-center text-gray-500">
                  No contact queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContactQueries;
