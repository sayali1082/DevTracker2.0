import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Github, Globe, ExternalLink, Calendar, Tag, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Project {
  projectId: string;
  userId: string;
  title: string;
  description: string;
  techStack: string[];
  githubRepoLink?: string;
  liveDemoLink?: string;
  status: 'In Progress' | 'Completed';
  createdAt: any;
  updatedAt: any;
}

interface ProjectCardProps {
  project: Project;
  onEdit?: (p: Project) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

export default function ProjectCard({ project, onEdit, onDelete, isOwner }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
          {project.githubRepoLink && <Github className="h-3 w-3 text-slate-300" />}
        </div>
        <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-tight">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <div className="flex items-center gap-2 pr-4 sm:border-r sm:border-slate-100">
           {project.status === 'Completed' ? (
             <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
               Completed
             </span>
           ) : (
             <span className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
               <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
               In Progress
             </span>
           )}
        </div>

        <div className="flex items-center gap-2">
          {project.liveDemoLink && (
             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" asChild>
               <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer">
                 <ExternalLink className="h-4 w-4" />
               </a>
             </Button>
          )}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit?.(project)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete?.(project.projectId)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.div>
  );
}
