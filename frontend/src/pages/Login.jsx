import { useState, useContext } from 'react';
import { Label, TextInput, Button, Alert } from 'flowbite-react';
import axios from '../api/axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('login/', form);
      login(data);
      navigate('/');
    } catch {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Log In</h2>
        {error && <Alert color="failure">{error}</Alert>}

        <div>
          <Label htmlFor="username" value="Username" />
          <TextInput
            id="username"
            name="username"
            placeholder="Your username"
            required
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Logging in…' : 'Log In'}
        </Button>

        <p className="text-sm text-center">
          Need an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
