import type { PathQuestion } from "./types";

export interface ExamQuestion extends PathQuestion {
  id: string;
  unitId: string;
  passage?: string;
}
