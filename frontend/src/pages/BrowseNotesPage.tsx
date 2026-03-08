import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useNotesBySubject } from '../hooks/useQueries';
import { Search, Filter, Download, FileText } from 'lucide-react';

export default function BrowseNotesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Computer Science');
  
  const { data: notes = [], isLoading } = useNotesBySubject(selectedSubject);

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.metadata.topic.toLowerCase().includes(query) ||
      note.metadata.subject.toLowerCase().includes(query) ||
      note.metadata.college.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Notes</h1>
        <p className="text-muted-foreground">Discover and download notes shared by students</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, subject, or college..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notes found. Try a different search or subject.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer"
              onClick={() => navigate({ to: `/notes/${note.id}` })}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-chart-1">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(note.blob.getDirectURL(), '_blank');
                  }}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                {note.metadata.topic}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{note.metadata.subject}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{note.metadata.semester}</span>
                <span>{note.metadata.college}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
