import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, getDocs, orderBy } from 'firebase/firestore';
import { UserProfile } from '../hooks/useAuth';
import ProjectCard, { Project } from '../components/project/ProjectCard';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Github, Mail, Globe, MapPin, Loader2, Code2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
          setError('User not found');
          return;
        }
        setProfile(userDoc.data() as UserProfile);

        const projsQuery = query(
          collection(db, 'users', userId, 'projects'),
          orderBy('createdAt', 'desc')
        );
        const projsSnap = await getDocs(projsQuery);
        setProjects(projsSnap.docs.map(d => ({ projectId: d.id, ...d.data() })) as Project[]);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">{error || 'User not found'}</h2>
        <Link to="/" className="mt-4 text-neutral-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-24 animate-in fade-in duration-700">
      {/* Profile Header section */}
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="container mx-auto px-4 sm:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <Avatar className="h-40 w-40 border-4 border-white shadow-2xl shadow-indigo-100 ring-1 ring-slate-200">
              <AvatarImage src={profile.photoURL || ''} alt={profile.displayName || ''} />
              <AvatarFallback className="bg-slate-100 text-slate-400 text-5xl font-bold">{profile.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex items-center justify-center h-10 w-10 bg-indigo-600 rounded-full border-4 border-white text-white shadow-lg">
               <Code2 className="h-5 w-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-3xl"
          >
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">{profile.displayName}</h1>
            <p className="mt-4 text-xl text-slate-500 font-medium">@{profile.githubUsername || profile.email?.split('@')[0]}</p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {profile.skills?.map(skill => (
                <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-default uppercase tracking-tight">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-4">
              {profile.githubUsername && (
                <Button className="pro-button h-12 px-8 shadow-indigo-200 shadow-xl" asChild>
                  <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" /> Visit GitHub Portfolio
                  </a>
                </Button>
              )}
              <Button variant="outline" className="h-12 px-8 rounded-lg border-slate-200 hover:bg-slate-50 shadow-sm text-slate-700">
                <Mail className="mr-2 h-5 w-5" /> Contact Developer
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 -z-10 w-full max-w-screen-xl aspect-square bg-gradient-to-b from-indigo-50/30 to-transparent blur-3xl opacity-60"></div>
      </section>

      {/* Main Content Split Area */}
      <div className="container mx-auto px-4 sm:px-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column: About & Stats */}
        <div className="space-y-12">
          {profile.bio && (
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 divider flex items-center gap-3 after:flex-1 after:h-[1px] after:bg-slate-100">Biography</div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {profile.bio}
              </p>
            </motion.section>
          )}

          <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 divider flex items-center gap-3 after:flex-1 after:h-[1px] after:bg-slate-100">Dev Stats</div>
             <div className="grid grid-cols-2 gap-4">
                <div className="pro-card p-4">
                   <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Projects</div>
                   <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
                </div>
                <div className="pro-card p-4">
                   <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">GitHub Stars</div>
                   <div className="text-2xl font-bold text-slate-900">
                     {projects.reduce((acc, p) => acc + (p.githubRepoLink ? 5 : 0), 0)}
                   </div>
                </div>
             </div>
          </motion.section>
        </div>

        {/* Right Column: Project Showcase */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between border-b border-slate-200 pb-4">
             <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Work</h2>
             <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Public Feed</span>
           </div>

           <div className="space-y-6">
             {projects.length > 0 ? (
               projects.map((project, i) => (
                 <motion.div 
                   key={project.projectId}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 + (i * 0.1) }}
                   className="pro-card p-6"
                 >
                   <ProjectCard project={project} />
                 </motion.div>
               ))
             ) : (
               <div className="pro-card p-20 text-center flex flex-col items-center">
                 <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                   <Code2 className="h-6 w-6" />
                 </div>
                 <h3 className="text-slate-900 font-bold">No public projects yet</h3>
                 <p className="text-slate-500 text-sm mt-1">This workspace is currently being built.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
