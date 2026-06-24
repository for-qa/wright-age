import { useEffect, useRef, useState } from 'react';
import { useSidebar } from '../../store/sidebarContext';
import { useParams } from 'react-router-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface SidebarProps {
  readonly isOpen?: boolean;
  readonly onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { sections } = useSidebar();
  const { topicFile } = useParams<{ topicFile: string }>();
  const [activeHref, setActiveHref] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);
  useFocusTrap(navRef, !!isOpen);

  // IntersectionObserver: highlight the nav link matching the visible section
  useEffect(() => {
    if (sections.length === 0) return;

    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      const sectionEls = document.querySelectorAll('[id]');
      if (sectionEls.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.target.id) {
              setActiveHref(`#${entry.target.id}`);
            }
          }
        },
        { rootMargin: '-15% 0px -75% 0px' }
      );

      sectionEls.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [sections]);

  return (
    <nav
      ref={navRef}
      id={`nav-${topicFile?.replace('.html', '') ?? 'sidebar'}`}
      className={isOpen ? 'open' : ''}
      aria-label="Topic sections"
    >
      {sections.map((sec) =>
        sec.isGroup ? (
          <div key={`group-${sec.label}`} className="nav-group">{sec.label}</div>
        ) : (
          <a
            key={sec.href}
            href={sec.href}
            className={activeHref === sec.href ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              setActiveHref(sec.href);
              if (onClose) onClose();
              const targetId = sec.href.replace('#', '');
              const el = document.getElementById(targetId);
              if (el) {
                const headerOffset = 60;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
          >
            {sec.label}
          </a>
        )
      )}
    </nav>
  );
}
