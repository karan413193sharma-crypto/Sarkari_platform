const STEPS = [
  {
    n: "01",
    title: "Add your qualification",
    body: "10th, 12th, degree, or the one you're currently pursuing. No login needed to try it.",
  },
  {
    n: "02",
    title: "See what you qualify for",
    body: "We match your qualification, age and category against every exam's real eligibility rules.",
  },
  {
    n: "03",
    title: "Get notified on time",
    body: "Create a profile and we'll alert you the moment a matching exam opens applications.",
  },
];

export default function HowItWorks() {
  return (
    <section id="eligibility" className="px-6 py-16 md:px-14">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">How it works</p>
      <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
        Three steps to your shortlist
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="glass-panel rounded-xl2 p-6">
            <span className="font-display text-3xl font-bold text-ink-faint">
              {step.n}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
