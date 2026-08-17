import type { QualificationLevel } from "./exam";

export interface Profile {
  id: string; // matches auth.users.id
  email: string | null;
  firstName: string;
  lastName: string;
  age: number;
  qualificationLevel: QualificationLevel;
  field: string; // degree / stream, e.g. "B.Sc Physics"
  currentlyPursuing: boolean;
  category?: "general" | "obc" | "sc" | "st" | "ews";
}