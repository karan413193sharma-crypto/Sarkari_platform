import Fuse from "fuse.js";
import { db } from "@/lib/db";

/** @type {{ rows: object[], fuse: Fuse<{ pattern: string, intent: string }> } | null} */
let cache = null;

async function load() {
  if (cache) return cache;
  const rows = await db.query(
    "SELECT intent, patterns, responses FROM smalltalk WHERE active = TRUE"
  );
  const flat = rows.flatMap((r) =>
    (Array.isArray(r.patterns) ? r.patterns : []).map((p) => ({
      pattern: String(p),
      intent: r.intent,
    }))
  );
  cache = {
    rows,
    patternCount: flat.length,
    fuse: new Fuse(flat, { keys: ["pattern"], includeScore: true, threshold: 0.35 }),
  };
  return cache;
}

/** @param {string} message */
export async function smallTalkReply(message) {
  try {
    const { rows, fuse, patternCount } = await load();
    if (!rows.length || !patternCount) return null;

    const hit = fuse.search(message.toLowerCase().trim())[0];
    if (!hit) return null;

    const r = rows.find((x) => x.intent === hit.item.intent);
    const responses = r?.responses;
    if (!Array.isArray(responses) || responses.length === 0) return null;

    return responses[Math.floor(Math.random() * responses.length)];
  } catch {
    return null;
  }
}
