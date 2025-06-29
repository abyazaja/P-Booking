import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Effect to handle redirect after successful login
  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Navigation will be handled by useEffect based on user role
        // No need to navigate here as useEffect will handle it
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Login
      </h2>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="bg-blue-50 mb-4 p-4 text-sm rounded-lg flex items-center border border-blue-200">
          <Loader2 className="me-2 animate-spin text-blue-600 w-4 h-4 flex-shrink-0" />
          <span className="text-blue-700">Mohon tunggu...</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          placeholder="Enter your email"
          onChange={handleChange}
          value={formData.email}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          placeholder="Enter your password"
          onChange={handleChange}
          value={formData.password}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ballgreen hover:bg-ballgreen/90 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg disabled:bg-ballgreen/50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="mt-6 flex justify-between text-sm">
        <NavLink
          to="/forgot"
          className="text-ballgreen hover:text-ballgreen/80 hover:underline"
        >
          Forgot Password?
        </NavLink>
        <NavLink
          to="/register"
          className="text-ballorange hover:text-ballorange/80 hover:underline"
        >
          Don't have an account? Register
        </NavLink>
      </div>
    </form>
  );
}
