const CATEGORIES = [
  { code: "UPSC", name: "Civil Services", exams: "IAS · IFS · IPS" },
  { code: "SSC", name: "Staff Selection", exams: "CGL · CHSL · MTS" },
  { code: "BANK", name: "Banking", exams: "IBPS · SBI · RBI" },
  { code: "RRB", name: "Railways", exams: "NTPC · Group D" },
  { code: "PSC", name: "State Services", exams: "State PCS boards" },
  { code: "DEF", name: "Defence", exams: "NDA · CDS · AFCAT" },
];

export default function ExamRibbon() {
  return (
    <section id="exams" className="px-6 py-16 md:px-14">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
            Where to start
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Every major category, in one fan
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-0 gap-y-6 md:flex-nowrap md:gap-x-[-40px]">
        {CATEGORIES.map((cat, i) => (
          <a
            key={cat.code}
            href="#eligibility"
            style={{
              transform: `rotate(${(i - 2.5) * 4}deg)`,
              marginLeft: i === 0 ? 0 : "-2.5rem",
              zIndex: i,
            }}
            className="glass-panel group relative h-56 w-40 shrink-0 rounded-xl2 p-5
              transition-all duration-300 ease-out hover:z-50 hover:-translate-y-4 hover:rotate-0 hover:shadow-glow
              md:h-64 md:w-44"
          >
            <span className="font-display text-lg font-bold text-gradient">
              {cat.code}
            </span>
            <p className="mt-3 text-sm font-medium text-ink">{cat.name}</p>
            <p className="mt-1 text-xs text-ink-faint">{cat.exams}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
