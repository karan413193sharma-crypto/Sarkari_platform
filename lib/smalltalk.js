import Fuse from "fuse.js";
import { db } from "@/lib/db";

// words that add no meaning in casual chat
const FILLER = new Set([
  "bro","bhai","bhaiya","yaar","dude","mate","buddy","sir","madam","dear",
  "boss","ji","pls","please","na",
]);

function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w))
    .join(" ");
}

let cache = null;

async function load() {
  if (cache) return cache;
  const { rows } = await db.query(
    "SELECT intent, patterns, responses FROM smalltalk WHERE active = TRUE"
  );
  const entries = rows
    .flatMap((r) =>
      (Array.isArray(r.patterns) ? r.patterns : []).map((p) => {
        const norm = normalize(p);
        return { intent: r.intent, norm, words: norm ? norm.split(" ").length : 0 };
      })
    )
    .filter((e) => e.norm)
    .sort((a, b) => b.words - a.words); // longest, most specific pattern first

  cache = {
    rows,
    entries,
    fuse: new Fuse(entries, { keys: ["norm"], includeScore: true, threshold: 0.3 }),
  };
  return cache;
}

const DISTRESS =
  /\b(want to die|kill myself|end my life|suicid\w*|no reason to live|hurt myself|self harm)\b/i;

export function distressReply(message) {
  if (!DISTRESS.test(message)) return null;
  return (
    "I'm really sorry you're feeling this way. You matter, and you don't have to carry this alone. " +
    "Please talk to someone you trust right now, or call a free helpline: Tele-MANAS at 14416 (India, 24x7). " +
    "If you're in immediate danger, call 112. I'll be here for your exam questions whenever you're ready."
  );
}

/** @param {string} message */
export async function smallTalkReply(message) {
  try {
    const { rows, entries, fuse } = await load();
    const msg = normalize(message);
    if (!msg || !entries.length) return null;

    const mWords = msg.split(" ").length;
    if (mWords > 12) return null;

    let intent = null;

    // 1. phrase found inside the message ("hey how are you" contains "how are you")
    const padded = ` ${msg} `;
    for (const e of entries) {
      if (mWords > e.words + 3) continue; // stop short patterns hijacking long messages
      if (padded.includes(` ${e.norm} `)) {
        intent = e.intent;
        break;
      }
    }

    // 2. typo tolerance for short messages ("helo", "how r yu")
    if (!intent && mWords <= 5) {
      intent = fuse.search(msg)[0]?.item.intent ?? null;
    }
    if (!intent) return null;

    const r = rows.find((x) => x.intent === intent);
    const responses = r?.responses;
    if (!Array.isArray(responses) || !responses.length) return null;
    return responses[Math.floor(Math.random() * responses.length)];
  } catch {
    return null;
  }
}