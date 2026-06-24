import { lazy, Suspense, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SidebarProvider } from './presentation/store/sidebarContext';
import { SkipLink } from './presentation/components/layout/SkipLink';

const HomePage = lazy(() => import('./presentation/pages/HomePage').then(m => ({ default: m.HomePage })));
const PageLayout = lazy(() => import('./presentation/components/layout/PageLayout').then(m => ({ default: m.PageLayout })));
const TopicPage = lazy(() => import('./presentation/pages/TopicPage').then(m => ({ default: m.TopicPage })));

function LoadingFallback() {
  return (
    <div className="page-loader-container">
      <div className="page-loader-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring-inner"></div>
        <div className="spinner-dot"></div>
      </div>
      <div className="page-loader-text">Loading...</div>
    </div>
  );
}

/**
 * Smart scroll manager:
 * - Home page ("/") → remembers & restores its scroll position
 * - Topic pages → always scroll to top
 */
function ScrollManager() {
  const { pathname } = useLocation();
  const homeScrollY = useRef(0);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === '/' && pathname !== '/') {
      homeScrollY.current = window.scrollY;
    }

    if (pathname === '/') {
      window.scrollTo(0, homeScrollY.current);
    } else {
      window.scrollTo(0, 0);
    }

    prevPath.current = pathname;
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <SkipLink />
      <ScrollManager />
      <SidebarProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<PageLayout />}>
              <Route path="/pages/:topicFile" element={<TopicPage />} />
            </Route>
          </Routes>
        </Suspense>
      </SidebarProvider>
    </HashRouter>
  );
}
