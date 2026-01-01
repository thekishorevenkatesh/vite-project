import { createContext, useContext, useState } from "react";
import type { AssessmentStep } from "./assessment.types";
import { INITIAL_STEPS } from "./assessment.steps";

interface AssessmentContextType {
  steps: AssessmentStep[];
  completeStep: (id: string) => void;
  isStepActive: (id: string) => boolean;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [steps, setSteps] = useState<AssessmentStep[]>(INITIAL_STEPS);

 function completeStep(id: string) {
  setSteps(prev => {
    const index = prev.findIndex(step => step.id === id);

    if (index === -1) return prev;

    return prev.map((step, i) => {
      if (step.id === id) {
        return { ...step, status: "completed" };
      }

      if (i === index + 1 && step.status === "locked") {
        return { ...step, status: "active" };
      }

      return step;
    });
  });
}

  function isStepActive(id: string) {
    return steps.find((s) => s.id === id)?.status === "active";
  }

  return (
    <AssessmentContext.Provider value={{ steps, completeStep, isStepActive }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used inside provider");
  return ctx;
}
