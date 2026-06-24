import { Link, useParams } from 'react-router-dom';
import { topics } from '../../../data/static/topics';
import { useThemeStore } from '../../store/themeStore';

interface TopBarProps {
  readonly mode?: 'home' | 'topic';
  readonly onToggleSidebar?: () => void;
  readonly children?: React.ReactNode;
  readonly topicNavFile?: string;
}

type TopicData = typeof topics[0];

function TopBarStyles() {
  return (
    <style>{`
      @media (max-width: 768px) {
        .is-topic-topbar {
          position: sticky !important;
          top: 0 !important;
          width: 100% !important;
          height: 54px !important;
          flex-direction: row !important;
          padding: 0 0.75rem !important;
          z-index: 100;
          background: rgba(18, 18, 18, 0.92) !important;
          backdrop-filter: blur(10px) !important;
          border-bottom: 1px solid var(--border);
          gap: 0.5rem !important;
          align-items: center !important;
        }
        .is-topic-topbar .tb-brand { display: none !important; }
        .is-topic-topbar .tb-back {
          display: flex !important;
          padding: 0 0.6rem !important;
          margin: 0 !important;
          flex: 0 0 auto !important;
          height: 36px !important;
          border-radius: 18px !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .is-topic-topbar .tb-back svg { width: 18px !important; height: 18px !important; }
        .is-topic-topbar .tb-back span { display: none !important; }
        .is-topic-topbar .tb-topic-title {
          flex: 1 !important; margin: 0 !important; padding: 0 !important;
          justify-content: flex-start !important; gap: 0.4rem !important;
        }
        .is-topic-topbar .tb-topic-category-chip { font-size: 10px !important; padding: 4px 8px !important; }
        .is-topic-topbar .tb-theme-btn { margin: 0 !important; position: static !important; flex: 0 0 auto !important; }
        .is-topic-topbar .tb-hamburger { position: static !important; margin: 0 !important; padding: 0.2rem !important; }
      }

      .tb-topic-nav { display: none; align-items: center; gap: 0.5rem; flex: 0 0 auto; }
      .tb-topic-nav-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border);
        background: var(--surface-2, var(--surface)); color: var(--ink); text-decoration: none; flex: 0 0 auto;
      }
      .tb-topic-nav-btn.is-disabled { opacity: 0.35; pointer-events: none; }
      @media (max-width: 768px) { .is-topic-topbar .tb-topic-nav { display: flex !important; } }
    `}</style>
  );
}

interface CompactTopicNavProps {
  readonly prevTopic: TopicData | null;
  readonly nextTopic: TopicData | null;
}

function CompactTopicNav({ prevTopic, nextTopic }: CompactTopicNavProps) {
  const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface-2, var(--surface))', color: 'var(--ink)', textDecoration: 'none', flexShrink: 0 };

  return (
    <div className="tb-topic-nav" aria-label="Topic navigation">
      {prevTopic ? (
        <Link to={`/pages/${prevTopic.file}`} className="tb-topic-nav-btn" aria-label={`Previous topic: ${prevTopic.title}`} title={`Previous: ${prevTopic.title}`} style={btnStyle}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
      ) : (
        <span className="tb-topic-nav-btn is-disabled" aria-hidden="true" style={{ ...btnStyle, opacity: 0.35, pointerEvents: 'none' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </span>
      )}
      {nextTopic ? (
        <Link to={`/pages/${nextTopic.file}`} className="tb-topic-nav-btn" aria-label={`Next topic: ${nextTopic.title}`} title={`Next: ${nextTopic.title}`} style={btnStyle}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>
      ) : (
        <Link to="/" className="tb-topic-nav-btn" aria-label="Finish and back to index" title="Finish and back to index" style={btnStyle}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </Link>
      )}
    </div>
  );
}

interface ThemeToggleBtnProps {
  readonly theme: string;
  readonly toggleTheme: () => void;
  readonly style?: React.CSSProperties;
}

function ThemeToggleBtn({ theme, toggleTheme, style }: ThemeToggleBtnProps) {
  return (
    <button className="tb-theme-btn" title="Toggle dark/light mode" onClick={toggleTheme} style={style} aria-label="Toggle dark/light mode">
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z"></path></svg>
      )}
    </button>
  );
}

interface TopicHeaderInfoProps {
  readonly backTo: string;
  readonly currentTopicCategory: string;
  readonly children: React.ReactNode;
}

function TopicHeaderInfo({ backTo, currentTopicCategory, children }: TopicHeaderInfoProps) {
  return (
    <>
      <Link to={backTo} className="tb-back" aria-label="Back to index">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
        <span>Index</span>
      </Link>
      <div className="tb-topic-title">
        <span className="tb-topic-category-chip">{currentTopicCategory}</span>
        {children}
      </div>
    </>
  );
}

export function TopBar({ mode = 'home', onToggleSidebar, children, topicNavFile }: TopBarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { topicFile } = useParams<{ topicFile: string }>();
  const currentTopic = topics.find(t => t.file === topicFile);

  const navIdx = topicNavFile ? topics.findIndex(t => t.file === topicNavFile) : -1;
  const prevTopic = navIdx > 0 ? topics[navIdx - 1] : null;
  const nextTopic = navIdx !== -1 && navIdx < topics.length - 1 ? topics[navIdx + 1] : null;
  const showTopicNav = navIdx !== -1;

  return (
    <div id="topbar" className={mode === 'topic' ? 'is-topic-topbar' : mode === 'home' ? 'home-topbar' : ''}>
      <TopBarStyles />

      {mode === 'topic' && onToggleSidebar && (
        <button className="tb-hamburger" title="Open menu" onClick={onToggleSidebar} aria-label="Open menu">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      )}

      {/* Brand — always shown */}
      <div className="tb-brand">
        <div className="tb-brand-icon">PW</div>
        <div>
          <div className="tb-brand-name">Playwright Learning Path</div>
          <div className="tb-brand-sub">E2E Testing Guide</div>
        </div>
      </div>

      {mode === 'topic' && (
        <TopicHeaderInfo
          backTo="/"
          currentTopicCategory={currentTopic?.category ?? ''}
        >
          {children}
        </TopicHeaderInfo>
      )}

      {/* Compact prev/next topic navigation (mobile header bar only) */}
      {showTopicNav && <CompactTopicNav prevTopic={prevTopic} nextTopic={nextTopic} />}

      {/* Theme toggle — always on the far right */}
      <ThemeToggleBtn
        theme={theme}
        toggleTheme={toggleTheme}
        style={mode === 'home' ? { marginLeft: 'auto' } : undefined}
      />
    </div>
  );
}
