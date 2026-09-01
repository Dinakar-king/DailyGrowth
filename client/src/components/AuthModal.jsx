import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      loginUser(data);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl w-full max-w-md relative shadow-2xl text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
        
        <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-sm text-slate-400 mb-6">Track your streaks, daily DSA, and interview progress.</p>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="w-full py-2.5 mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg transition">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:underline">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}