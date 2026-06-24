import type { ReactNode } from 'react';

interface CodeCardProps {
  number?: string | number;
  title: string;
  badge?: string;
  badgeColorClass?: 'ph1-card' | 'ph2-card' | 'ph3-card' | 'ph4-card' | 'ph5-card';
  children: ReactNode;
}

export function CodeCard({
  number,
  title,
  badge,
  badgeColorClass = 'ph1-card',
  children,
}: Readonly<CodeCardProps>) {
  return (
    <div className={`card ${badgeColorClass}`}>
      <div className="card-head">
        {number && <div className="card-num">{number}</div>}
        <div className="card-title">{title}</div>
        {badge && <span className="card-badge">{badge}</span>}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
