import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../ui/button';
import { Layout, LogOut, User as UserIcon, LayoutGrid as DashboardIcon, Terminal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 font-bold text-white shadow-sm transition-transform group-hover:scale-105">D</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            DevTracker <span className="text-indigo-600">2.0</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 sm:block">
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="relative flex h-10 items-center gap-3 px-2 transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100" />
                }>
                    <Avatar className="h-8 w-8 border border-slate-200 shadow-sm">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-mono text-xs">{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col items-start text-xs sm:flex">
                      <span className="font-semibold text-slate-900 leading-tight">{user.displayName}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Pro Developer</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Layout className="mr-2 h-4 w-4" />
                      Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.uid}`)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Public Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
