import type { Exam, QualificationLevel } from "@/types/exam";

// Order matters — index = rank. Used to check "has this level or higher".
const QUALIFICATION_ORDER: QualificationLevel[] = [
  "10th",
  "12th",
  "diploma",
  "graduate",
  "postgraduate",
];

function rankOf(level: QualificationLevel): number {
  return QUALIFICATION_ORDER.indexOf(level);
}

export interface EligibilityInput {
  qualificationLevel: QualificationLevel;
  currentlyPursuing: boolean;
  age: number;
}

export interface EligibilityResult {
  eligible: Exam[];
  upcoming: Exam[]; // unlocked once the in-progress qualification finishes
}

export function getEligibility(profile: EligibilityInput, exams: Exam[]): EligibilityResult {
  const currentRank = rankOf(profile.qualificationLevel);

  // If they're still pursuing this level, it isn't "completed" yet for
  // matching purposes — so their effective completed level is one below.
  const completedRank = profile.currentlyPursuing ? currentRank - 1 : currentRank;

  const eligible = exams.filter((exam) => {
    const meetsQualification = rankOf(exam.minQualification) <= completedRank;
    const meetsAge = profile.age >= exam.minAge && profile.age <= exam.maxAge;
    return meetsQualification && meetsAge;
  });

  const eligibleIds = new Set(eligible.map((e) => e.id));

  const upcoming = profile.currentlyPursuing
    ? exams.filter(
        (exam) => rankOf(exam.minQualification) === currentRank && !eligibleIds.has(exam.id)
      )
    : [];

  return { eligible, upcoming };
}