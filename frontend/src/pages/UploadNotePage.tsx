import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUploadNote } from '../hooks/useUploadNote';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { Upload, Loader2, FileText, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function UploadNotePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const uploadNote = useUploadNote();

  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [semester, setSemester] = useState('');
  const [college, setCollege] = useState(userProfile?.college || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !identity) return;

    const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await uploadNote.mutateAsync({
      id: noteId,
      metadata: {
        subject,
        topic,
        semester,
        college,
        uploader: identity.getPrincipal(),
        uploadTime: BigInt(Date.now() * 1000000),
      },
      file,
    });

    navigate({ to: '/browse' });
  };

  const isPremium = userProfile?.isPremium || false;

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Notes</h1>
        <p className="text-muted-foreground">Share your college notes with the community</p>
      </div>

      {!isPremium && (
        <div className="mb-6 p-4 rounded-lg bg-muted border border-border flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Free Tier Limit</p>
            <p className="text-muted-foreground">You can upload up to 5 notes per month. Upgrade to Premium for unlimited uploads.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-2xl bg-card border border-border">
        <div>
          <label className="block text-sm font-medium mb-2">Upload File</label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              required
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-3 w-full p-8 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
            >
              {file ? (
                <>
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="font-medium">{file.name}</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-muted-foreground">Click to upload PDF, DOC, or image (max 10MB)</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Computer Science"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Data Structures"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="semester" className="block text-sm font-medium mb-2">
              Semester
            </label>
            <input
              id="semester"
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g., Semester 3"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium mb-2">
              College
            </label>
            <input
              id="college"
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Your college name"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploadNote.isPending || !file}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploadNote.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Notes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
