import { getAdmin } from "@/lib/db";

const STREAMS = {
  maths:    ["any", "maths"],
  bio:      ["any", "bio"],
  science:  ["any", "maths", "bio", "science"],
  commerce: ["any", "commerce"],
  arts:     ["any", "arts"],
};

export async function recommend(p) {
  if (!p.qualification) return { exams: [], future: [] };
  const client = getAdmin();
  if (!client) throw new Error("Database not configured");

  const qual = p.qualification === "postgraduate" ? "graduate" : p.qualification;
  const streams = STREAMS[p.stream] ?? ["any"];

  const { data: el, error: e1 } = await client
    .from("exam_eligibility")
    .select("exam_id, min_age, max_age, note")
    .eq("qualification", qual)
    .in("stream", streams);
  if (e1) throw e1;

  const ids = [...new Set((el ?? []).map((r) => r.exam_id))];
  const { data: ex, error: e2 } = ids.length
    ? await client.from("exams").select("id, name, active").in("id", ids)
    : { data: [], error: null };
  if (e2) throw e2;
  const byId = Object.fromEntries((ex ?? []).map((e) => [e.id, e]));

  const seen = new Set();
  const exams = (el ?? [])
    .filter((r) => byId[r.exam_id] && byId[r.exam_id].active !== false)
    .filter((r) => p.age == null || ((r.min_age == null || r.min_age <= p.age) && (r.max_age == null || r.max_age >= p.age)))
    .filter((r) => !seen.has(r.exam_id) && seen.add(r.exam_id))
    .map((r) => ({ name: byId[r.exam_id].name, min_age: r.min_age, max_age: r.max_age, note: r.note }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const { data: future, error: e3 } = await client
    .from("future_options")
    .select("title, description")
    .eq("qualification", qual)
    .in("stream", streams)
    .order("sort_order");
  if (e3) throw e3;

  return { exams, future: future ?? [] };
}

export function formatReply(p, { exams, future }) {
  if (!p.qualification) {
    return "Thanks! Tell me your qualification (10th, 12th or graduate) and I'll suggest exams.";
  }
  const who = `${p.qualification}${p.stream ? " (" + p.stream + ")" : ""}${p.age ? ", age " + p.age : ""}`;
  let out = `For ${who}:\n`;

  out += exams.length
    ? `\n✅ Exams you can look at now:\n` +
      exams.map((e) => `• ${e.name}${e.note ? " – " + e.note : ""}`).join("\n")
    : `\nI couldn't find exams matching this exactly right now.`;

  if (future.length) {
    out += `\n\n🚀 Future options:\n` +
      future.map((f) => `• ${f.title}${f.description ? ": " + f.description : ""}`).join("\n");
  }
  if (!p.stream && p.qualification !== "graduate")
    out += `\n\nTell me your stream (maths, bio, commerce or arts) for more precise options.`;
  if (!p.age)
    out += `\nAdd your age (for example "I'm 18 years old") and I'll filter by age limits too.`;
  return out;
}