const QUAL_PATTERNS = [
  { key: "postgraduate", re: /\b(post\s?grad|pg|master|m\.?\s?sc|mba)\b/i },
  { key: "graduate", re: /\b(graduate|graduation|degree|b\.?\s?tech|b\.?\s?sc|b\.?\s?com|ba\b|bca)\b/i },
  { key: "diploma", re: /\b(diploma|polytechnic)\b/i },
  { key: "12th", re: /\b(12th|xii|hsc|intermediate|inter|plus two|\+2)\b/i },
  { key: "10th", re: /\b(10th|x|ssc pass|matric)\b/i },
];

const STREAM_PATTERNS = [
  { key: "maths", re: /\b(math|maths|pcm)\b/i },
  { key: "science", re: /\b(science|pcb|bio)\b/i },
  { key: "commerce", re: /\b(commerce|accounts)\b/i },
  { key: "arts", re: /\b(arts|humanities)\b/i },
];

/**
 * @param {string} message
 * @param {Record<string, unknown>} prev
 */
export function extractProfile(message, prev = {}) {
  /** @type {Record<string, unknown>} */
  const profile = { ...prev };
  const text = message.toLowerCase();

  for (const { key, re } of QUAL_PATTERNS) {
    if (re.test(message)) profile.qualification = key;
  }

  if (/\b(pursuing|currently in|studying in|in my)\b/i.test(message)) {
    profile.pursuing = true;
  }
  if (/\b(passed|completed|done with|finished)\b/i.test(message)) {
    profile.pursuing = false;
  }

  for (const { key, re } of STREAM_PATTERNS) {
    if (re.test(message)) profile.stream = key;
  }

  const ageMatch =
    text.match(/\b(?:age|i am|i'm|im)\s*(\d{2})\b/) ||
    text.match(/\b(\d{2})\s*(?:years?\s*old|yrs?)\b/);
  if (ageMatch) {
    const age = Number(ageMatch[1]);
    if (age >= 15 && age <= 45) profile.age = age;
  }

  return profile;
}

/** @param {Record<string, unknown>} profile */
export function hasProfile(profile) {
  return Boolean(profile.qualification || profile.age != null);
}
