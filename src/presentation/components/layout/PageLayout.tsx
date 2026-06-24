import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { FloatingTopicNav } from '../navigation/FloatingTopicNav';

export function PageLayout() {
  const location = useLocation();
  const topicFile = location.pathname.startsWith('/pages/')
    ? location.pathname.split('/').pop()
    : undefined;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <TopBar
        mode="topic"
        onToggleSidebar={() => setIsSidebarOpen(p => !p)}
        topicNavFile={topicFile}
      />
      {isSidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
          style={{ border: 'none', padding: 0, cursor: 'pointer', outline: 'none' }}
        />
      )}
      <div className="page-wrap">
        <div className="wrap">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main id="main-content" className="content animate-page-enter" key={location.pathname}>
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
      {topicFile && <FloatingTopicNav currentFile={topicFile} />}
    </>
  );
}
