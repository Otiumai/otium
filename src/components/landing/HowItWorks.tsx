const steps = [
  {
    number: "01",
    title: "Tell us your interest.",
    description:
      "Photography, cooking, chess, coding — whatever excites you. Just type it in.",
  },
  {
    number: "02",
    title: "Get your personalized guide.",
    description:
      "Otium AI instantly finds the best creators, courses, podcasts, and builds a step-by-step learning path.",
  },
  {
    number: "03",
    title: "Track and grow.",
    description:
      "Follow your path, check off milestones, chat with Otium for advice, and watch yourself level up.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="max-w-apple mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-body text-accent-600 font-semibold mb-3 tracking-wide uppercase">
            How It Works
          </p>
          <h2 className="text-headline md:text-display-sm font-bold text-surface-900 font-display">
            Three steps. That&apos;s it.
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-20 md:space-y-0 md:grid md:grid-cols-3 md:gap-16">
          {steps.map((step) => (
            <div key={step.number} className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface-100 mb-6">
                <span className="text-body font-bold text-surface-400">
                  {step.number}
                </span>
              </div>
              <h3 className="text-title text-surface-900 mb-3">
                {step.title}
              </h3>
              <p className="text-body text-surface-400 leading-relaxed max-w-sm mx-auto md:mx-0">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
