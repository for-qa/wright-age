import type { ReactNode } from 'react';

interface ConceptSectionProps {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}

export function ConceptSection({ id, label, title, children }: Readonly<ConceptSectionProps>) {
  return (
    <div className="sec" id={id}>
      <div className="sec-label">{label}</div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
