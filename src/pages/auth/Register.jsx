import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, confirmPassword } = formData;

    if (!email || !password || !name) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        setSuccess(result.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Register
      </h2>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

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
          <span className="text-blue-700">Creating your account...</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          placeholder="Enter your full name"
          onChange={handleChange}
          value={formData.name}
          required
        />
      </div>

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

      <div className="mb-4">
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

      <div className="mb-6">
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen"
          placeholder="Confirm your password"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ballorange hover:bg-ballorange/90 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg disabled:bg-ballorange/50"
      >
        {loading ? "Creating Account..." : "Register"}
      </button>

      <div className="mt-6 text-center text-sm">
        <NavLink
          to="/login"
          className="text-ballgreen hover:text-ballgreen/80 hover:underline"
        >
          Already have an account? Login
        </NavLink>
      </div>
    </form>
  );
}
