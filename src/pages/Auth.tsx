import { useState } from 'react';
import { motion } from 'motion/react';
import { auth, googleProvider, githubProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Github, Chrome, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSocialLogin = async (provider: any) => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    
    try {
      setLoading(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="pro-card p-8 sm:p-10">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
               <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isLogin ? 'Access your elite developer profile' : 'Start tracking your development journey'}
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 transition-all hover:bg-slate-50" onClick={() => handleSocialLogin(githubProvider)} disabled={loading}>
                <Github className="mr-2 h-4 w-4" /> Continue with GitHub
              </Button>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 transition-all hover:bg-slate-50" onClick={() => handleSocialLogin(googleProvider)} disabled={loading}>
                <Chrome className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-400">
                <span className="bg-white px-3 font-bold">Or use email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="grid gap-4">
              <div className="grid gap-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-11 pl-10 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-colors" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-11 pl-10 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-colors" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button className="pro-button h-11 w-full rounded-xl shadow-indigo-100 shadow-xl" type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <button 
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
