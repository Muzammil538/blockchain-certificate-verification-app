import { ReactNode } from 'react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

export default function StepCard({ number, title, description, className = 'step-1' }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <div className={`step-icon ${className}`}>
        <span>{number}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
