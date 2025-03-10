'use client';

export default function ProblemSection() {
  return (
    <section className="py-20 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What&apos;s Really Holding Your Music Back?</h2>
          <p className="text-muted-foreground text-lg">
            It&apos;s not your talent. It&apos;s not your gear. It&apos;s the gap between where you are and where you want to be—a
            gap that can only be bridged by someone who&apos;s already made the journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card/50 p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold">01</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Generic Tutorials Fail You</h3>
            <p className="text-muted-foreground">
              YouTube tutorials can&apos;t hear your music. They can&apos;t identify your specific weaknesses or build on your
              unique strengths.
            </p>
          </div>

          <div className="bg-card/50 p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold">02</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Feedback From Friends Is Biased</h3>
            <p className="text-muted-foreground">
              Friends and family don&apos;t want to hurt your feelings. And even well-meaning producers in your network
              might lack the expertise to truly help.
            </p>
          </div>

          <div className="bg-card/50 p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold">03</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Trial & Error Takes Too Long</h3>
            <p className="text-muted-foreground">
              Learning through trial and error alone can take years. Our coaches help you skip the frustration and
              make rapid progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 