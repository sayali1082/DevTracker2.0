import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Github, Loader2, Import, Star, GitFork, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';

interface GithubImportProps {
  onImport: (repo: any) => void;
}

export default function GithubImport({ onImport }: GithubImportProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const fetchRepos = async () => {
    if (!username) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/github/repos/${username}`);
      setRepos(response.data);
    } catch (error) {
      toast.error('Failed to fetch repositories. Check the username.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (repo: any) => {
    onImport({
      title: repo.name,
      description: repo.description || '',
      techStack: repo.language ? [repo.language] : [],
      githubRepoLink: repo.html_url,
      liveDemoLink: repo.homepage || '',
      status: 'Completed'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
        <Github className="h-4 w-4" /> Import from GitHub
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import GitHub Project</DialogTitle>
          <DialogDescription>
            Enter a GitHub username to see their public repositories.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 py-4">
          <Input 
            placeholder="GitHub username (e.g. facebook)" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRepos()}
          />
          <Button onClick={fetchRepos} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto pr-2">
          <div className="space-y-4">
            {repos.map((repo) => (
              <div key={repo.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{repo.name}</span>
                    {repo.language && <Badge variant="secondary" className="text-[10px]">{repo.language}</Badge>}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">{repo.description || 'No description'}</p>
                  <div className="flex gap-4 text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {repo.stargazers_count}</span>
                    <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {repo.forks_count}</span>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleImport(repo)}>
                  <Import className="mr-2 h-4 w-4" /> Import
                </Button>
              </div>
            ))}
            {repos.length === 0 && !loading && (
              <div className="py-8 text-center text-sm text-neutral-500">
                Search for a user to see repositories
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
