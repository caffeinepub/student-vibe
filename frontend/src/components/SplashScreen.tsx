import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [animationPhase, setAnimationPhase] = useState<'fade-in' | 'hold' | 'fade-out'>('fade-in');

  useEffect(() => {
    // Phase 1: Fade in and scale (0.8s)
    const fadeInTimer = setTimeout(() => {
      setAnimationPhase('hold');
    }, 800);

    // Phase 2: Hold (0.7s)
    const holdTimer = setTimeout(() => {
      setAnimationPhase('fade-out');
    }, 1500);

    // Phase 3: Fade out (0.5s) then complete
    const fadeOutTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(holdTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-chart-1/10 transition-opacity duration-500 ${
        animationPhase === 'fade-out' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`relative transition-all duration-800 ${
          animationPhase === 'fade-in'
            ? 'opacity-0 scale-75'
            : animationPhase === 'hold'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-110'
        }`}
      >
        <div className="relative">
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 blur-3xl opacity-50 animate-pulse">
            <div className="w-full h-full bg-gradient-to-br from-primary via-chart-1 to-chart-2 rounded-full" />
          </div>
          
          {/* Logo */}
          <img
            src="/assets/generated/logo.dim_200x200.png"
            alt="Student Vibe Logo"
            className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* App name */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text animate-pulse">
            Student Vibe
          </h1>
        </div>
      </div>
    </div>
  );
}
