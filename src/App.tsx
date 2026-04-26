/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Navbar from './components/layout/Navbar';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center font-mono text-sm uppercase tracking-widest animate-pulse">
        Initializing DevTracker 2.0...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 selection:bg-neutral-900 selection:text-white">
        <Navbar user={user} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

