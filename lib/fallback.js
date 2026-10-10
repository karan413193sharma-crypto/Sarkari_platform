const STOP = new Set([
    "the","for","and","what","about","exam","exams","how","can","tell","give","are","you",
    "with","from","this","that","apply","link","last","date","dates","syllabus",
    "eligibility","eligible","please","show","when","who","pass","want","know",
  ]);
  
  const LABEL = { syllabus: "syllabus", dates: "dates", eligibility: "eligibility", link: "apply link" };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  
  // "ssc" -> every exam whose name contains all the meaningful words
  export function findCandidates(text, docs) {
    const words = text.split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP.has(w));
    if (!words.length) return [];
    return docs.filter((d) => {
      const n = String(d.name).toLowerCase();
      return words.every((w) => n.includes(w));
    });
  }
  
  export function buildFallback({ intent, docs, misses = 0 }) {
    const sample = docs.slice(0, 4).map((d) => d.name);
  
    // They asked for something specific but named no exam
    if (intent) {
      return {
        reply: `Sure, I can share the ${LABEL[intent]}. Which exam do you mean?`,
        suggestions: sample.map((n) => `${n} ${LABEL[intent]}`),
      };
    }
  
    // Repeated misses: change approach instead of repeating
    if (misses >= 2) {
      return {
        reply:
          "I'm still not finding that. You can browse every exam on the Explore exams page, or tell me your qualification (10th, 12th or graduate) and I'll shortlist exams for you.",
        suggestions: ["10th pass", "12th pass", "I'm a graduate"],
      };
    }
  
    return {
      reply: pick([
        "I didn't quite get that, but I can help you find the right exam. Here are some things people ask:",
        "Hmm, I'm not sure about that one. I'm best with exam eligibility, syllabus and dates. Want to try one of these?",
        "I couldn't match that to our exam data. Let's try a different angle:",
      ]),
      suggestions: [
        "I'm in 12th with maths",
        "Exams after 10th",
        "Exams after graduation",
        sample[0] ? `${sample[0]} syllabus` : "What can you do?",
      ],
    };
  }