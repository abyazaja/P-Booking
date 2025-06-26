import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all fields.');
      return;
    }
    // Mock registration: just redirect to login
    navigate('/login');
  };

  return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Register</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ballgreen" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-ballorange text-white py-2 rounded-full font-semibold hover:bg-ballorange/90 transition">Register</button>
        <div className="text-center mt-2">
          <a href="/login" className="text-ballgreen hover:underline">Already have an account? Login</a>
        </div>
      </form>
  );
};

export default Register; 