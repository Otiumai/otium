import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started and explore.",
    features: [
      "Basic interest profile",
      "Limited AI recommendations",
      "5 AI chats per day",
      "Browse creators & content",
      "1 interest",
    ],
    cta: "Get Started Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "Go all in on what you love.",
    features: [
      "Unlimited AI conversations",
      "Full learning paths & programs",
      "Progress tracking & milestones",
      "Unlimited interests",
      "Creator deep-dives",
      "Personalized accountability",
      "Course recommendations",
      "Priority AI responses",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section bg-surface-100">
      <div className="max-w-apple mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-body text-accent-600 font-semibold mb-3 tracking-wide uppercase">
            Pricing
          </p>
          <h2 className="text-headline md:text-display-sm font-bold text-surface-900 mb-5 font-display">
            Simple pricing.
          </h2>
          <p className="text-body-lg text-surface-400">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-apple-xl p-8 md:p-10 transition-all duration-300 ${
                plan.featured
                  ? "ring-2 ring-surface-900 shadow-xl shadow-surface-900/10"
                  : "border border-surface-200"
              }`}
            >
              {plan.featured && (
                <div className="inline-block bg-surface-900 text-white text-caption font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-title text-surface-900 mb-1">{plan.name}</h3>
              <p className="text-body-sm text-surface-400 mb-6">
                {plan.description}
              </p>
              <div className="mb-8">
                <span className="text-display-sm text-surface-900">
                  {plan.price}
                </span>
                <span className="text-body text-surface-400 ml-1">
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3.5 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent-500 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-body text-surface-600">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center w-full rounded-full py-3.5 font-medium transition-all duration-300 ${
                  plan.featured
                    ? "bg-surface-900 text-white hover:bg-surface-800"
                    : "bg-surface-100 text-surface-800 hover:bg-surface-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
