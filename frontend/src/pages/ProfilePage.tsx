import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { Loader2, User, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [bio, setBio] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [department, setDepartment] = useState('');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setCollege(userProfile.college);
      setBio(userProfile.bio || '');
      setYearOfStudy(userProfile.yearOfStudy || '');
      setDepartment(userProfile.department || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !college.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (bio.length > 300) {
      toast.error('Bio must be 300 characters or less');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        college: college.trim(),
        isPremium: userProfile?.isPremium || false,
        isAdmin: userProfile?.isAdmin || false,
        bio: bio.trim() || undefined,
        yearOfStudy: yearOfStudy.trim() || undefined,
        department: department.trim() || undefined,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (profileLoading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const bioCharCount = bio.length;
  const bioCharLimit = 300;
  const isFormValid = name.trim() && email.trim() && college.trim() && bioCharCount <= bioCharLimit;

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/20">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage your personal information and customize your profile
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@college.edu"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                required
              />
            </div>

            <div>
              <label htmlFor="college" className="block text-sm font-medium mb-2">
                College/University <span className="text-destructive">*</span>
              </label>
              <input
                id="college"
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Your college name"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                required
              />
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Additional Details</h2>
            <p className="text-sm text-muted-foreground">These fields are optional</p>

            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-2">
                Department <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Computer Science, Engineering"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium mb-2">
                Year of Study <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <select
                id="yearOfStudy"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              >
                <option value="">Select year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2">
                Bio <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={4}
                maxLength={300}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Share your interests, goals, or anything you'd like others to know
                </p>
                <p className={`text-xs ${bioCharCount > bioCharLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {bioCharCount}/{bioCharLimit}
                </p>
              </div>
              {bioCharCount > bioCharLimit && (
                <p className="text-xs text-destructive mt-1">
                  Bio exceeds maximum length
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saveProfile.isPending || !isFormValid}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="px-6 py-3 rounded-lg border border-border bg-background hover:bg-accent transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
