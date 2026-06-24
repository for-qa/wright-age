import type { ReactNode } from 'react';

type NoteType = 'tip' | 'info' | 'warn';

interface NoteCalloutProps {
  type: NoteType;
  children: ReactNode;
  icon?: string;
}

const iconMap: Record<NoteType, string> = {
  tip: '✓',
  info: 'i',
  warn: '⚠',
};

export function NoteCallout({ type, children, icon }: Readonly<NoteCalloutProps>) {
  return (
    <div className={`note note-${type}`}>
      <span className="note-i">{icon || iconMap[type]}</span>
      <p>{children}</p>
    </div>
  );
}
