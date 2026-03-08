import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetNote } from '../hooks/useQueries';
import { Download, Sparkles, Brain, MessageSquare, ArrowLeft } from 'lucide-react';

export default function NoteDetailPage() {
  const { noteId } = useParams({ from: '/notes/$noteId' });
  const navigate = useNavigate();
  const { data: note, isLoading } = useGetNote(noteId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Note not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <button
        onClick={() => navigate({ to: '/browse' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </button>

      <div className="p-8 rounded-2xl bg-card border border-border mb-6">
        <h1 className="text-3xl font-bold mb-4">{note.metadata.topic}</h1>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Subject</p>
            <p className="font-medium">{note.metadata.subject}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Semester</p>
            <p className="font-medium">{note.metadata.semester}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">College</p>
            <p className="font-medium">{note.metadata.college}</p>
          </div>
        </div>

        <button
          onClick={() => window.open(note.blob.getDirectURL(), '_blank')}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Notes
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AI Study Tools</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => alert('AI Summary generation requires premium subscription and external AI service integration')}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-left group"
          >
            <div className="p-3 rounded-lg bg-gradient-to-br from-chart-1 to-chart-2 w-fit mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Generate Summary</h3>
            <p className="text-sm text-muted-foreground">AI-powered summary of the notes</p>
          </button>

          <button
            onClick={() => navigate({ to: `/quiz/${noteId}` })}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-left group"
          >
            <div className="p-3 rounded-lg bg-gradient-to-br from-chart-2 to-chart-3 w-fit mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Generate Quiz</h3>
            <p className="text-sm text-muted-foreground">Test your knowledge with AI quizzes</p>
          </button>

          <button
            onClick={() => navigate({ to: `/viva/${note.metadata.subject}` })}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-left group"
          >
            <div className="p-3 rounded-lg bg-gradient-to-br from-chart-4 to-chart-5 w-fit mb-4">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Viva Questions</h3>
            <p className="text-sm text-muted-foreground">Practice oral exam questions</p>
          </button>
        </div>
      </div>
    </div>
  );
}
