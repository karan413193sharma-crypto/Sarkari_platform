import { NextResponse } from "next/server";
import Fuse from "fuse.js";
import { db, getAdmin } from "@/lib/db";
import { extractProfile, hasProfile } from "@/lib/profile";
import { recommend, formatReply } from "@/lib/recommend";
import { smallTalkReply,distressReply  } from "@/lib/smalltalk";
import { buildFallback, findCandidates } from "@/lib/fallback";
// import { smallTalkReply, distressReply } from "@/lib/smalltalk";


const INTENTS = {
  syllabus: ["syllabus", "topics", "subjects"],
  dates: ["date", "when", "apply by", "last date", "notification", "deadline"],
  eligibility: ["eligible", "eligibility", "qualification", "who can"],
  link: ["link", "apply", "website", "official"],
};

/** @type {{ fuse: Fuse<object>, docs: { id: string, name: string }[] } | null} */
let examSearch = null;

async function getExamSearch() {
  if (examSearch) return examSearch;
  const { rows } = await db.query("SELECT id, name FROM exams WHERE active = TRUE");
  const docs = rows ?? [];
  examSearch = {
    docs,
    fuse: new Fuse(docs, { keys: ["name"], threshold: 0.3, includeScore: true }),
  };
  return examSearch;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message : "";
    const prev = body.profile && typeof body.profile === "object" ? body.profile : {};
    const text = message.toLowerCase().trim();
    const profile = extractProfile(message, prev);
    const crisis = distressReply(message);

    const { fuse, docs } = await getExamSearch();
    const intent = Object.keys(INTENTS).find((k) =>
      INTENTS[k].some((w) => text.includes(w))
    );

    // 1. exam question
    const direct = docs.find((e) => text.includes(String(e.name).toLowerCase()));

    // ambiguous name like "ssc": ask which one
    if (!direct) {
      const cands = findCandidates(text, docs);
      if (cands.length > 1) {
        return NextResponse.json({
          reply: "I found a few matching exams. Which one do you mean?",
          suggestions: cands
            .slice(0, 5)
            .map((c) => (intent ? `${c.name} ${intent}` : c.name)),
          profile,
        });
      }
    }

    const found = direct || fuse.search(text)[0]?.item;

    if (found) {
      const { rows } = await db.query(
        "SELECT name, syllabus, dates, eligibility, apply_link FROM exams WHERE id = $1",
        [found.id]
      );
      const e = rows[0];
      if (e) {
        const replies = {
          syllabus: `Syllabus for ${e.name}: ${e.syllabus ?? "Not listed yet."}`,
          dates: `${e.name} dates: ${e.dates ?? "Not listed yet."}`,
          eligibility: `${e.name} eligibility: ${e.eligibility ?? "Not listed yet."}`,
          link: `Official link for ${e.name}: ${e.apply_link ?? "Not listed yet."}`,
        };
        return NextResponse.json({
          reply:
            replies[intent] ??
            `${e.name}: ${e.eligibility ?? "See our exam page for details."}\nAsk me about its syllabus, dates or apply link.`,
          profile,
        });
      }
    }

    // 2. recommendation
       // 2. recommendation
       if (hasProfile(profile) && JSON.stringify(profile) !== JSON.stringify(prev)) {
        const matches = await recommend(profile);
        return NextResponse.json({
          reply: formatReply(profile, matches) +
            "\n\nSign up and fill in your details, and I'll save this profile and alert you when a matching exam opens.",
          cta: "signup",
          profile,
        });
      }

    // 3. small talk
    const talk = await smallTalkReply(message);
    if (talk) return NextResponse.json({ reply: talk, profile });

    // 4. fallback
    const fb = buildFallback({ intent, docs, misses: Number(body.misses) || 0 });

    // log what the bot couldn't answer (fire and forget)
    try {
      getAdmin()
        ?.from("unanswered_questions")
        .insert({ message: message.slice(0, 300) })
        .then(() => {}, () => {});
    } catch {}

    return NextResponse.json({
      reply: fb.reply,
      suggestions: fb.suggestions,
      fallback: true,
      profile,
    });
  } catch (err) {
    console.error("chat route error:", err);
    return NextResponse.json(
      {
        reply: "Something went wrong reaching the exam database. Please try again.",
        profile: {},
      },
      { status: 500 }
    );
  }
}