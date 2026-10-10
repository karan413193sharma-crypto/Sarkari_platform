import { EXAMS } from "@/lib/data/exams";

/** @typedef {"eligibility"|"syllabus"|"apply"|"dates"|"overview"|"list"|"unknown"} Intent */

const QUAL_LABEL = {
  "10th": "10th pass",
  "12th": "12th pass",
  diploma: "diploma",
  graduate: "graduate",
  postgraduate: "postgraduate",
};

/** Phrases → exam slug(s). */
const ALIASES = [
  ["ssc cgl", "ssc-cgl"],
  ["combined graduate level", "ssc-cgl"],
  ["ssc chsl", "ssc-chsl"],
  ["ibps po", "ibps-po"],
  ["probationary officer", "ibps-po"],
  ["sbi clerk", "sbi-clerk"],
  ["junior associate", "sbi-clerk"],
  ["rrb ntpc", "rrb-ntpc"],
  ["railway ntpc", "rrb-ntpc"],
  ["ntpc", "rrb-ntpc"],
  ["rrb group d", "rrb-group-d"],
  ["group d", "rrb-group-d"],
  ["upsc cse", "upsc-cse"],
  ["civil services", "upsc-cse"],
  ["ias", "upsc-cse"],
  ["ips", "upsc-cse"],
  ["upsc ifs", "upsc-ifs"],
  ["forest service", "upsc-ifs"],
  ["state pcs", "state-pcs"],
  ["nda", "nda"],
  ["cds", "cds"],
  ["defence services", "cds"],
  ["upsc", ["upsc-cse", "upsc-ifs"]],
  ["ssc", ["ssc-cgl", "ssc-chsl"]],
  ["ibps", "ibps-po"],
  ["bank po", "ibps-po"],
  ["railway", ["rrb-ntpc", "rrb-group-d"]],
  ["rrb", ["rrb-ntpc", "rrb-group-d"]],
];

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * @param {string} message
 * @returns {import("@/types/exam").Exam[]}
 */
function findExams(message) {
  const q = normalize(message);
  const slugs = new Set();

  for (const [phrase, target] of ALIASES) {
    if (q.includes(phrase)) {
      const list = Array.isArray(target) ? target : [target];
      list.forEach((s) => slugs.add(s));
    }
  }

  for (const exam of EXAMS) {
    if (q.includes(exam.slug.replace(/-/g, " "))) slugs.add(exam.slug);
    if (q.includes(exam.categoryCode.toLowerCase()) && exam.categoryCode.length > 3) {
      slugs.add(exam.slug);
    }
    const nameWords = exam.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const hits = nameWords.filter((w) => q.includes(w));
    if (hits.length >= 2) slugs.add(exam.slug);
  }

  const matched = EXAMS.filter((e) => slugs.has(e.slug));
  if (matched.length) return matched;

  for (const exam of EXAMS) {
    const tokens = exam.slug.split("-");
    if (tokens.some((t) => t.length >= 3 && q.split(" ").includes(t))) {
      slugs.add(exam.slug);
    }
  }
  return EXAMS.filter((e) => slugs.has(e.slug));
}

/**
 * @param {string} message
 * @returns {Intent}
 */
function detectIntent(message) {
  const q = normalize(message);
  if (/\b(list|all|which|show)\b.*\b(exam|exams)\b/.test(q) || q === "exams") return "list";
  if (/\b(eligib|qualif|age limit|who can apply|minimum age|maximum age)\b/.test(q)) return "eligibility";
  if (/\b(syllabus|syllabi|pattern|subjects|exam pattern)\b/.test(q)) return "syllabus";
  if (/\b(apply|application|register|link|url|how to apply)\b/.test(q)) return "apply";
  if (/\b(date|deadline|last date|notification|when|schedule|open)\b/.test(q)) return "dates";
  if (/\b(what is|about|tell me|info|details|describe)\b/.test(q)) return "overview";
  return "unknown";
}

/** @param {import("@/types/exam").Exam} exam */
function eligibilityReply(exam) {
  return (
    `${exam.name}\n` +
    `• Minimum qualification: ${QUAL_LABEL[exam.minQualification] ?? exam.minQualification}\n` +
    `• Age: ${exam.minAge}–${exam.maxAge} years\n` +
    `More on SarkariPath: /exams/${exam.slug}`
  );
}

/** @param {import("@/types/exam").Exam} exam */
function syllabusReply(exam) {
  if (exam.syllabusUrl) {
    return `${exam.name}\nOfficial syllabus page: ${exam.syllabusUrl}\nFull details: /exams/${exam.slug}`;
  }
  return `${exam.name}\nWe don't have a dedicated syllabus URL in our database yet. Check the exam page: /exams/${exam.slug}`;
}

/** @param {import("@/types/exam").Exam} exam */
function applyReply(exam) {
  if (exam.applyUrl && exam.applyUrl !== "#") {
    return `${exam.name}\nApply here: ${exam.applyUrl}\nExam page: /exams/${exam.slug}`;
  }
  return `${exam.name}\nApply link isn't listed yet. See /exams/${exam.slug} for updates.`;
}

/** @param {import("@/types/exam").Exam} exam */
function datesReply(exam) {
  if (exam.notificationDate) {
    return `${exam.name}\nExpected notification / timeline: ${exam.notificationDate}\nDetails: /exams/${exam.slug}`;
  }
  return `${exam.name}\nNo notification date in our database yet. Check /exams/${exam.slug} for updates.`;
}

/** @param {import("@/types/exam").Exam} exam */
function overviewReply(exam) {
  let text = `${exam.name} (${exam.category})\n${exam.description}`;
  if (exam.notificationDate) text += `\nNotification: ${exam.notificationDate}`;
  text += `\n/exams/${exam.slug}`;
  return text;
}

/** @param {import("@/types/exam").Exam[]} exams */
function replyForExams(exams, intent) {
  if (exams.length === 0) {
    if (intent === "list") {
      const lines = EXAMS.map((e) => `• ${e.name} — /exams/${e.slug}`);
      return `We track ${EXAMS.length} exams:\n\n${lines.join("\n")}`;
    }
    return (
      "I couldn't match that to an exam in our database. Try naming the exam (e.g. SSC CGL, IBPS PO, UPSC) " +
      "or browse all exams at /exams."
    );
  }

  if (exams.length > 3 && intent !== "list") {
    const names = exams.map((e) => `• ${e.name}`).join("\n");
    return `Several exams matched. Which one do you mean?\n\n${names}\n\nAsk again with the full name.`;
  }

  const parts = exams.map((exam) => {
    switch (intent) {
      case "eligibility":
        return eligibilityReply(exam);
      case "syllabus":
        return syllabusReply(exam);
      case "apply":
        return applyReply(exam);
      case "dates":
        return datesReply(exam);
      case "overview":
      case "unknown":
        return overviewReply(exam);
      case "list":
        return `• ${exam.name} — /exams/${exam.slug}`;
      default:
        return overviewReply(exam);
    }
  });

  if (intent === "list") return `Exams in our database:\n\n${parts.join("\n")}`;
  return parts.join("\n\n---\n\n");
}

/**
 * @param {string} message
 * @returns {string}
 */
export function buildChatReply(message) {
  const trimmed = (message ?? "").trim();
  if (!trimmed) {
    return "Send a question about an exam — eligibility, syllabus, dates, or apply links.";
  }

  const intent = detectIntent(trimmed);
  const exams = findExams(trimmed);

  if (intent === "list" && exams.length === 0) {
    return replyForExams([], "list");
  }

  return replyForExams(exams, intent === "unknown" && exams.length ? "overview" : intent);
}
