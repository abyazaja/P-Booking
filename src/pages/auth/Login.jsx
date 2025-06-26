import { AlertTriangle, Loader2 } from "lucide-react"; 
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password, role);
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
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

      {/* Error Alert */}
      {error && (
        <div className="relative mb-5 p-4 pl-11 rounded-lg border border-red-300 bg-red-50 text-red-800 shadow-sm transition-all duration-300 ease-in-out">
          <AlertTriangle className="absolute left-4 top-4 w-5 h-5 text-red-500" />
          <div className="font-semibold mb-1">Login Failed</div>
          <div className="text-sm">{error}</div>
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
          placeholder="you@example.com"
          onChange={handleChange}
          value={formData.email}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          placeholder="********"
          onChange={handleChange}
          value={formData.password}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Role</label>
        <select
          name="role"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
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
