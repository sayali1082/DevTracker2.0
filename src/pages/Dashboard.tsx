import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import ProjectCard, { Project } from '../components/project/ProjectCard';
import ProjectForm from '../components/project/ProjectForm';
import GithubImport from '../components/dashboard/GithubImport';
import ProfileSettings from '../components/dashboard/ProfileSettings';
import { Button } from '../components/ui/button';
import { Plus, LayoutGrid, List, Search, Filter, Loader2, Code2, User, Github, Globe } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'projects'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({
        projectId: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projs);
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error("Failed to load projects");
      setLoading(false);
    });

    // Activity tracking bonus
    const updateActivity = async () => {
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            lastActive: serverTimestamp()
          });
        } catch (e) {
          // Ignore if fails
        }
      }
    };
    updateActivity();

    return () => unsubscribe();

  }, [user]);

  const handleCreateOrUpdate = async (data: any) => {
    if (!user) return;

    try {
      if (editingProject && editingProject.projectId) {
        await updateDoc(doc(db, 'users', user.uid, 'projects', editingProject.projectId), {
          ...data,
          updatedAt: serverTimestamp()
        });
        toast.success('Project updated');
      } else {
        await addDoc(collection(db, 'users', user.uid, 'projects'), {
          ...data,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success('Project created');
      }
      setFormOpen(false);
      setEditingProject(undefined);
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'projects', projectId));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Developer Dashboard</h1>
          <p className="text-slate-500">Manage your project portfolio and track progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => {
            setEditingProject(undefined);
            setFormOpen(true);
          }} className="pro-button gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
          {profile && <ProfileSettings profile={profile} />}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Projects", value: projects.length, change: "Active portfolio", color: "text-emerald-600" },
          { label: "GitHub Repos", value: projects.filter(p => p.githubRepoLink).length, change: "Synced", color: "text-indigo-600" },
          { label: "Tech Stack", value: new Set(projects.flatMap(p => p.techStack)).size, change: "Languages", color: "text-amber-600" },
          { label: "Profile Views", value: "1.2k", change: "Last 30 days", color: "text-indigo-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="pro-card p-6"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</div>
            <div className={`mt-1 text-xs font-medium ${stat.color}`}>{stat.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Column: Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="pro-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <h2 className="font-bold text-slate-900">Active projects</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Filter..." 
                  className="h-8 w-48 pl-9 text-xs border-slate-100 focus:bg-slate-50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project) => (
                    <div key={project.projectId} className="px-6 py-4 transition-colors hover:bg-slate-50">
                      <ProjectCard 
                        project={project} 
                        isOwner
                        onEdit={(p) => {
                          setEditingProject(p);
                          setFormOpen(true);
                        }}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                </AnimatePresence>
                {filteredProjects.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                      <Code2 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium text-slate-900">No projects found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {search ? "Try a different search term" : "Get started by adding your first project."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Import and Tips */}
        <div className="space-y-8">
          <div className="pro-card p-6">
             <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-slate-900 flex items-center gap-2">
                 <Github className="h-4 w-4" /> GitHub Integration
               </h2>
             </div>
             <GithubImport onImport={(data) => {
                setEditingProject(data as Project);
                setFormOpen(true);
             }} />
          </div>

          <div className="pro-card bg-indigo-600 p-6 text-white border-indigo-500 shadow-indigo-100">
            <h3 className="font-bold flex items-center gap-2">
              <Globe className="h-4 w-4" /> Portfolio is Live
            </h3>
            <p className="mt-2 text-xs text-indigo-100 leading-relaxed">
              Recruiters can view your professional trajectory at your unique public URL.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-4 w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none">
              <Link to={`/profile/${user?.uid}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </div>

      <ProjectForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingProject}
      />
    </div>
  );
}
