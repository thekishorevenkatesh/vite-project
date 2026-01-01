import type { AssessmentStep } from "./assessment.types";

export const INITIAL_STEPS: AssessmentStep[] = [
  { id: "key_on", label: "Turn key ON", status: "active" },
  { id: "stand_open", label: "Open side stand", status: "locked" },
  { id: "fuel_cap_open", label: "Open fuel cap", status: "locked" },
  { id: "fuel_fill", label: "Refuel bike", status: "locked" },
  { id: "kill_switch_on", label: "Turn kill switch ON", status: "locked" },
];
