import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "student", // Default role
    shopName: "",
    shopAddress: "",
    hostelName: "",
    roomNumber: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost/api/v1/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed");

      setSuccess("Signup successful! Redirecting...");
      console.log("Signup Successful:", data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
          <input type="password" name="passwordConfirm" placeholder="Confirm Password" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
          
          <select name="role" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg">
            <option value="student">Student</option>
            <option value="shopkeeper">Shopkeeper</option>
          </select>

          {formData.role === "shopkeeper" ? (
            <>
              <input type="text" name="shopName" placeholder="Shop Name" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
              <input type="text" name="shopAddress" placeholder="Shop Address" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
            </>
          ) : (
            <>
              <input type="text" name="hostelName" placeholder="Hostel Name" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
              <input type="text" name="roomNumber" placeholder="Room Number" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />
            </>
          )}

          <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg" required />

          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
