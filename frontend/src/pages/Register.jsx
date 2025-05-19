import { useState, useContext } from 'react';
import { Label, TextInput, Button, Alert } from 'flowbite-react';
import axios from '../api/axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
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
      await axios.post('register/', form);
      const { data } = await axios.post('login/', {
        username: form.username,
        password: form.password
      });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>
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
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={form.email}
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
          {loading ? 'Registering…' : 'Register'}
        </Button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
