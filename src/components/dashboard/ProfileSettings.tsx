import { useState } from 'react';
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
  DialogTrigger,
} from '../ui/dialog';
import { X, Plus, UserCircle, Settings } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  profile: UserProfile;
}

export default function ProfileSettings({ profile }: ProfileSettingsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(profile.bio || '');
  const [githubUsername, setGithubUsername] = useState(profile.githubUsername || '');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', profile.uid), {
        bio,
        githubUsername,
        skills,
        updatedAt: serverTimestamp()
      });
      toast.success('Profile updated');
      setOpen(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter(i => i !== s));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <Settings className="h-4 w-4" /> Profile Settings
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Customize your public developer profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="github">GitHub Username</Label>
            <Input 
              id="github" 
              placeholder="e.g. octocat" 
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Write a short intro about yourself..." 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Add a skill..." 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button type="button" size="icon" variant="outline" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {skills.map(s => (
                <Badge key={s} variant="secondary" className="pl-2 pr-1">
                  {s}
                  <button onClick={() => removeSkill(s)} className="ml-1 rounded-full p-0.5 hover:bg-neutral-200">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
