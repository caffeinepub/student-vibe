import { Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from './LoginButton';
import UserProfileDisplay from './UserProfileDisplay';
import { BookOpen, Upload, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SiCoffeescript } from 'react-icons/si';

export default function Layout() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!identity;

  const navItems = [
    { label: 'Dashboard', path: '/', icon: BookOpen },
    { label: 'Upload Notes', path: '/upload', icon: Upload },
    { label: 'Browse Notes', path: '/browse', icon: BookOpen },
    { label: 'Study Groups', path: '/groups', icon: Users },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/assets/generated/logo.dim_400x400.png"
                alt="Student Vibe Logo"
                className="h-10 w-10 rounded-xl shadow-lg hover:shadow-primary/50 transition-shadow"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                Student Vibe
              </span>
            </button>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && <UserProfileDisplay />}
            <LoginButton />
            {isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="container py-4 flex flex-col gap-2">
              <div className="px-4 py-3 mb-2">
                <UserProfileDisplay />
              </div>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {isAuthenticated ? (
          <Outlet />
        ) : (
          <div className="container py-20 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                Welcome to Student Vibe
              </h1>
              <p className="text-lg text-muted-foreground">
                Your AI-powered study companion for college notes, quizzes, and collaborative learning.
              </p>
              <div className="pt-4">
                <LoginButton />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Student Vibe. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Built with <SiCoffeescript className="h-4 w-4 text-red-500" /> using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
