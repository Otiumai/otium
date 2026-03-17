const features = [
  {
    emoji: "💬",
    title: "One prompt. Whole world.",
    description:
      "Tell us your interest. Otium instantly builds a personalized universe of creators, courses, and learning paths.",
  },
  {
    emoji: "🎯",
    title: "Step-by-step programs.",
    description:
      "Clear progression from beginner to advanced. Actionable steps tailored to your hobby, updated as you grow.",
  },
  {
    emoji: "📚",
    title: "Curated courses.",
    description:
      "The best from YouTube, Udemy, Coursera, and more — filtered, ranked, and recommended just for you.",
  },
  {
    emoji: "🎙️",
    title: "Discover creators.",
    description:
      "Find the podcasts, YouTubers, and thought leaders shaping your interest. Real people, real expertise.",
  },
  {
    emoji: "📈",
    title: "Track your progress.",
    description:
      "Milestones, check-offs, and a clear view of how far you've come. Watch yourself grow.",
  },
  {
    emoji: "✨",
    title: "Multiple interests.",
    description:
      "Photography, cooking, guitar — manage all your passions in one place with dedicated spaces for each.",
  },
];

export function Features() {
  return (
    <section id="features" className="section bg-surface-100">
      <div className="max-w-apple-wide mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-body text-accent-600 font-semibold mb-3 tracking-wide uppercase">
            Features
          </p>
          <h2 className="text-headline md:text-display-sm font-bold text-surface-900 mb-5 font-display">
            Everything you need
            <br className="hidden sm:block" /> to go deeper.
          </h2>
          <p className="text-body-lg text-surface-400 max-w-xl mx-auto">
            Not just recommendations. Your personal guide to mastering what you love.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-white rounded-apple-lg p-8 hover:shadow-lg hover:shadow-surface-900/5 transition-all duration-500 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {feature.emoji}
              </div>
              <h3 className="text-title text-surface-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-body text-surface-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
