import { createClient } from "@supabase/supabase-js";

let admin = null;

export function getAdmin() {
  if (admin) return admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}

function normalizeSql(sql) {
  return sql.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Supabase-backed SQL adapter (subset used by chat routes).
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {Promise<{ rows: object[] }>}
 */
async function query(sql, params = []) {
  const normalized = normalizeSql(sql);
  const client = getAdmin();
  if (!client) {
    throw new Error("Database not configured (Supabase URL / service role key).");
  }

  if (normalized.includes("from smalltalk")) {
    const { data, error } = await client
      .from("smalltalk")
      .select("intent, patterns, responses")
      .eq("active", true);
    if (error) throw error;
    return { rows: data ?? [] };
  }

  if (normalized.includes("from exams") && normalized.includes("where id")) {
    const id = params[0];
    const { data, error } = await client
      .from("exams")
      .select("id, name, syllabus, dates, eligibility, apply_link")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return { rows: data ? [data] : [] };
  }

  if (normalized.includes("from exams") && normalized.includes("where active")) {
    const selectMatch = sql.match(/select\s+(.+?)\s+from\s+exams/i);
    const fields = selectMatch?.[1]?.trim() || "id, name";
    const { data, error } = await client.from("exams").select(fields).eq("active", true);
    if (error) throw error;
    return { rows: data ?? [] };
  }

  throw new Error(`Unsupported SQL for db adapter: ${sql}`);
}

export const db = { query };
