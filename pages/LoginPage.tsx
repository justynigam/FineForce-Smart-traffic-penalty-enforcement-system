import React, { useState } from 'react';
import { login } from '../services/authService';

interface LoginPageProps {
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error.message || 'Invalid email or password. Please try again.');
      }
      // On success, the App.tsx listener will handle the state change.
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="flex items-center justify-center min-h-screen font-sans bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1887&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-wider">
            Fine<span className="text-blue-500">Force</span>
          </h1>
          <p className="mt-2 text-slate-600">Officer Login</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-3 bg-slate-50/80 border border-slate-200 rounded-lg text-center text-sm">
            <p className="font-semibold text-slate-600">
                Demo Account
            </p>
            <p className="text-slate-500 mt-1">
                <span className="font-medium">Email:</span> <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded">sanjay.k@fineforce.gov.in</code>
            </p>
            <p className="text-slate-500">
                <span className="font-medium">Password:</span> <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded">password123</code>
            </p>
        </div>
        
        <p className="text-sm text-center text-slate-600">
          Don't have an account?{' '}
          <button onClick={onNavigateToSignup} className="font-medium text-blue-600 hover:text-blue-500">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;