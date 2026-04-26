import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { X, Plus, Github, Search } from 'lucide-react';
import { Project } from './ProjectCard';
import axios from 'axios';

const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  description: z.string().max(5000),
  techStack: z.array(z.string()),
  githubRepoLink: z.string().url().optional().or(z.string().length(0)),
  liveDemoLink: z.string().url().optional().or(z.string().length(0)),
  status: z.enum(['In Progress', 'Completed']),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Project;
}

export default function ProjectForm({ open, onOpenChange, onSubmit, initialData }: ProjectFormProps) {
  const [techInput, setTechInput] = useState('');
  const [techs, setTechs] = useState<string[]>(initialData?.techStack || []);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      status: 'In Progress',
      techStack: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setTechs(initialData.techStack);
    } else {
      reset({ status: 'In Progress', techStack: [] });
      setTechs([]);
    }
  }, [initialData, reset]);

  const handleAddTech = () => {
    if (techInput && !techs.includes(techInput)) {
      const newTechs = [...techs, techInput];
      setTechs(newTechs);
      setValue('techStack', newTechs);
      setTechInput('');
    }
  };

  const removeTech = (t: string) => {
    const newTechs = techs.filter(i => i !== t);
    setTechs(newTechs);
    setValue('techStack', newTechs);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update your project details below.' : 'Share a new project with the community.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" {...register('title')} placeholder="My Awesome App" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="What does this project do?" className="min-h-[100px]" />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Tech Stack</Label>
            <div className="flex gap-2">
              <Input 
                value={techInput} 
                onChange={(e) => setTechInput(e.target.value)} 
                placeholder="e.g. React, Node.js" 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              />
              <Button type="button" variant="outline" onClick={handleAddTech}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {techs.map(t => (
                <Badge key={t} variant="secondary" className="pl-2 pr-1 h-6">
                  {t}
                  <button type="button" onClick={() => removeTech(t)} className="ml-1 rounded-full p-0.5 hover:bg-neutral-200">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                {...register('status')}
                className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="githubRepoLink">GitHub Repo</Label>
              <div className="relative">
                <Github className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                <Input id="githubRepoLink" {...register('githubRepoLink')} placeholder="https://github.com/..." className="pl-9" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="liveDemoLink">Live Demo</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                <Input id="liveDemoLink" {...register('liveDemoLink')} placeholder="https://..." className="pl-9" />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update Project' : 'Create Project'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
