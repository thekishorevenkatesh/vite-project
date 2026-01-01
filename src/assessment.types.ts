export type StepStatus = "locked" | "active" | "completed";

export interface AssessmentStep {
  id: string;
  label: string;
  status: StepStatus;
}
