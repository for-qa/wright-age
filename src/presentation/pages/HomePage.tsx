import { Link } from 'react-router-dom';
import { topics } from '../../data/static/topics';
import { TopBar } from '../components/layout/TopBar';
import { Footer } from '../components/layout/Footer';
import { useProgressStore } from '../store/progressStore';

// Phase color mapping
const PHASE_THEMES = ['theme-blue', 'theme-teal', 'theme-violet', 'theme-green', 'theme-amber', 'theme-red'];

function getPhaseTheme(index: number): string {
  return PHASE_THEMES[Math.floor(index / 5) % PHASE_THEMES.length];
}

export function HomePage() {
  const { progress } = useProgressStore();
  const completedCount = Object.keys(progress.completedTopics).length;
  const totalCount = topics.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="home-container">
      <div className="site-constrain">
        <TopBar mode="home" />
        <main id="main-content" className="home-wrap">
          <h1>🎭 Playwright Learning Path</h1>
          <p>
            A comprehensive, hands-on guide to mastering Playwright for end-to-end testing.
            From installation to advanced patterns — learn by doing.
          </p>

          {totalCount > 0 && (
            <div style={{ maxWidth: 400, margin: '0 auto 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--ink3)', marginBottom: '0.4rem' }}>
                {completedCount} / {totalCount} completed ({progressPercent}%)
              </div>
              <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--green)', borderRadius: 3, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )}

          <div className="topic-grid">
            {topics.map((topic, i) => {
              const isComplete = !!progress.completedTopics[topic.file];
              return (
                <Link
                  key={topic.file}
                  to={`/pages/${topic.file}`}
                  className={`topic-card ${getPhaseTheme(i)}`}
                  style={{ position: 'relative' }}
                >
                  {isComplete && (
                    <div className="tc-completed-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                  <div className="tc-num">
                    <span className="tc-num-badge">{topic.number}</span>
                    {topic.category}
                  </div>
                  <div className="tc-title">{topic.title}</div>
                  {topic.desc && <div className="tc-desc">{topic.desc}</div>}
                  {topic.tags && (
                    <div className="tc-tags">
                      {topic.tags.map((tag) => (
                        <span key={tag.label} className="tc-tag" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
