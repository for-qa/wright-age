import { Link } from 'react-router-dom';
import { topics } from '../../../data/static/topics';

interface FloatingTopicNavProps {
  currentFile: string;
}

export function FloatingTopicNav({ currentFile }: Readonly<FloatingTopicNavProps>) {
  const idx = topics.findIndex(t => t.file === currentFile);

  if (idx === -1) return null;

  const prev = idx > 0 ? topics[idx - 1] : null;
  const next = idx < topics.length - 1 ? topics[idx + 1] : null;

  return (
    <>
      <style>{`
        .floating-nav-btn {
          position: fixed; top: 50%; transform: translateY(-50%);
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; z-index: 50;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .floating-nav-btn.prev { left: calc(220px + 0.25rem); }
        .floating-nav-btn.next { right: 0.25rem; flex-direction: row-reverse; }
        .floating-nav-circle {
          width: 40px; height: 40px; border-radius: 8px;
          background: var(--surface-2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--ink); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .floating-nav-btn:hover .floating-nav-circle {
          background: var(--primary); color: var(--on-primary);
          border-color: var(--primary); transform: scale(1.1);
        }
        .floating-nav-label {
          display: flex; flex-direction: column;
          background: var(--surface); border: 1px solid var(--border);
          padding: 8px 16px; border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          opacity: 0; pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .floating-nav-btn.prev .floating-nav-label { transform: translateX(-10px); align-items: flex-start; }
        .floating-nav-btn.next .floating-nav-label { transform: translateX(10px); align-items: flex-end; }
        .floating-nav-btn:hover .floating-nav-label { opacity: 1; transform: translateX(0); }
        .floating-nav-label-prefix {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--ink3); line-height: 1; margin-bottom: 2px;
        }
        .floating-nav-label-title { font-size: 12px; font-weight: 600; color: var(--ink); }
        @media (max-width: 1200px) { .floating-nav-label { display: none; } }
        @media (max-width: 768px) { .floating-nav-btn { display: none !important; } }
      `}</style>
      {prev && (
        <Link to={`/pages/${prev.file}`} className="floating-nav-btn prev" aria-label={`Previous topic: ${prev.title}`} title={`Previous: ${prev.title}`}>
          <div className="floating-nav-circle">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span className="floating-nav-label"><span className="floating-nav-label-prefix">Previous</span><span className="floating-nav-label-title">{prev.title}</span></span>
        </Link>
      )}
      {next ? (
        <Link to={`/pages/${next.file}`} className="floating-nav-btn next" aria-label={`Next topic: ${next.title}`} title={`Next: ${next.title}`}>
          <div className="floating-nav-circle">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <span className="floating-nav-label"><span className="floating-nav-label-prefix">Next</span><span className="floating-nav-label-title">{next.title}</span></span>
        </Link>
      ) : (
        <Link to="/" className="floating-nav-btn next" aria-label="Finish and back to index" title="Finish and back to index">
          <div className="floating-nav-circle">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <span className="floating-nav-label"><span className="floating-nav-label-prefix">Finish</span><span className="floating-nav-label-title">Back to Index</span></span>
        </Link>
      )}
    </>
  );
}
