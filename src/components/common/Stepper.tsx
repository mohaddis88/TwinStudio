import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  number: string;
  title: string;
}

export interface StepperProps {
  currentStep: number;
  steps: StepItem[];
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-[20px] p-3 sm:p-4 shadow-sm transition-colors">
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {steps.map((s) => {
          const isCurrent = currentStep === s.id;
          const isCompleted = currentStep > s.id;

          return (
            <button
              key={s.id}
              type="button"
              disabled={!onStepClick || (!isCompleted && !isCurrent)}
              onClick={() => onStepClick && isCompleted && onStepClick(s.id)}
              className={`p-2 rounded-[12px] transition-all text-center flex flex-col items-center justify-center ${
                isCurrent
                  ? 'bg-[var(--surface-elevated)] font-semibold text-[var(--text-main)] border border-[var(--border-color)] shadow-xs'
                  : isCompleted
                  ? 'text-[var(--status-success)] hover:bg-[var(--surface-elevated)]/50 cursor-pointer'
                  : 'text-[var(--text-muted)] cursor-default'
              }`}
            >
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide">
                {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : s.number}
              </span>
              <span className="truncate block font-medium mt-0.5">{s.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
