export default function HeroSection() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
      <img
        src="/assets/generated/hero-banner.dim_1920x600.png"
        alt="Student Vibe Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent flex items-center">
        <div className="container">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Study Smarter with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Upload notes, generate summaries, create quizzes, and collaborate with fellow students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
