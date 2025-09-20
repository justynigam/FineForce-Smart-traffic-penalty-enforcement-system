import React, { useState } from 'react';
import { signup } from '../services/authService';

interface SignupPageProps {
  onNavigateToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
    }

    try {
      const { error } = await signup(name, email, officerId, password);
      if (error) {
        setError(error.message || 'Could not create account. The email or officer ID might already be in use.');
      }
      // On success, the App.tsx listener will handle the state change.
    } catch (err) {
      setError('An unexpected error occurred during signup.');
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
          <p className="mt-2 text-slate-600">Create Officer Account</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="officerId" className="block text-sm font-medium text-slate-700">Officer ID</label>
            <input id="officerId" type="text" required value={officerId} onChange={(e) => setOfficerId(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <div>
            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-slate-600">
          Already have an account?{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;