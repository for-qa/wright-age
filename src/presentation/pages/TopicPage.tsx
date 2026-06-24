import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { topics } from '../../data/static/topics';

import { ProgressTracker } from '../components/navigation/ProgressTracker';
import { QuizSection } from '../components/quiz/QuizSection';
import { useSidebar } from '../store/sidebarContext';
import { getQuizQuestionsUseCase } from '../../data/di/container';
import { enhanceCodeBlocks } from '../utils/enhanceCodeBlocks';

type SidebarLink = { href: string; label: string; isGroup?: boolean };

function appendTopicExtras(links: SidebarLink[], topicFile: string): SidebarLink[] {
  const next = [...links];
  const quizQs = getQuizQuestionsUseCase.execute(topicFile);
  if (quizQs.length > 0) {
    next.push({ href: '#self-test', label: `Quick Quiz (${quizQs.length})` });
  }
  return next;
}

export function TopicPage() {
  const { topicFile } = useParams<{ topicFile: string }>();
  const [contentHtml, setContentHtml] = useState<string>('');
  const [heroHtml, setHeroHtml] = useState<string>('');
  const [heroId, setHeroId] = useState<string>('');
  const [prevTopicFile, setPrevTopicFile] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pageRef = useRef<HTMLDivElement>(null);
  const { setSections } = useSidebar();

  const currentTopic = topics.find((t) => t.file === topicFile);

  if (topicFile !== prevTopicFile) {
    setPrevTopicFile(topicFile);
    setIsLoading(true);
  }

  useEffect(() => {
    setSections([]);

    if (!topicFile) return;

    fetch(`${import.meta.env.BASE_URL}content/${topicFile}`)
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const legacyNav = doc.querySelector('nav[id]');
        if (legacyNav) {
          const links: SidebarLink[] = [];
          legacyNav.querySelectorAll('a, .nav-group').forEach((el) => {
            if (el.classList.contains('nav-group')) {
              links.push({ href: '', label: el.textContent || '', isGroup: true });
            } else {
              const a = el as HTMLAnchorElement;
              links.push({ href: a.getAttribute('href') || '#', label: a.textContent || '' });
            }
          });
          setSections(appendTopicExtras(links, topicFile));
        }

        const contentDiv = doc.querySelector('.content');
        if (contentDiv) {
          contentDiv.querySelectorAll('.pn-nav').forEach((n) => n.remove());

          const heroDiv = contentDiv.querySelector('.hero');
          if (heroDiv) {
            setHeroHtml(heroDiv.innerHTML);
            setHeroId(heroDiv.getAttribute('id') || '');
            heroDiv.remove();
          } else {
            setHeroHtml(`<h1>${currentTopic?.title || 'Topic'}</h1>`);
            setHeroId('');
          }

          setContentHtml(contentDiv.innerHTML);
        } else {
          setContentHtml('<p>Content not found.</p>');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setContentHtml('<p>Failed to load content.</p>');
        setIsLoading(false);
      });

    window.scrollTo(0, 0);
  }, [topicFile, currentTopic, setSections]);

  useLayoutEffect(() => {
    const root = pageRef.current;
    if (isLoading || !root) return;

    enhanceCodeBlocks(root);

    const observer = new MutationObserver(() => {
      enhanceCodeBlocks(root);
    });

    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [contentHtml, isLoading, topicFile]);

  if (!topicFile) return <div>Topic not found</div>;

  if (isLoading) {
    return (
      <div className="page-loader-container">
        <div className="page-loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring-inner"></div>
          <div className="spinner-dot"></div>
        </div>
        <div className="page-loader-text">Loading Session...</div>
      </div>
    );
  }

  return (
    <div className="animate-page-enter" ref={pageRef}>
      <div className="hero" id={heroId || undefined} style={{ position: 'relative' }}>
        <div dangerouslySetInnerHTML={{ __html: heroHtml }} />
        <ProgressTracker topicFile={topicFile} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <QuizSection topicFile={topicFile} />
    </div>
  );
}
