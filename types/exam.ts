export type QualificationLevel =
  | "10th"
  | "12th"
  | "diploma"
  | "graduate"
  | "postgraduate";

export interface Qualification {
  level: QualificationLevel;
  field?: string;
  currentlyPursuing?: boolean;
  ageOnJune1: number;
  category?: "general" | "obc" | "sc" | "st" | "ews";
}

export interface Exam {
  id: string;
  slug: string;
  name: string;
  category: string; // display name e.g. "Civil Services"
  categoryCode: string; // short code used for filter tabs e.g. "UPSC"
  description: string;
  minQualification: QualificationLevel;
  minAge: number;
  maxAge: number;
  applyUrl: string;
  syllabusUrl?: string;
  notificationDate?: string;
}