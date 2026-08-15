import type { Qualification, Exam } from "@/types/exam";

// Placeholder — real matching rules (age, category, qualification level,
// currently-pursuing degree → future exams) get built out next.
export function getEligibleExams(
  qualification: Qualification,
  exams: Exam[]
): Exam[] {
  return exams.filter((exam) => exam.minQualification === qualification.level);
}
