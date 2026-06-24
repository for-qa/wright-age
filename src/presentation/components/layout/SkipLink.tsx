export function SkipLink() {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.getElementById('main-content');
    if (!main) return;
    if (!main.hasAttribute('tabindex')) {
      main.setAttribute('tabindex', '-1');
    }
    main.focus({ preventScroll: true });
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <a href="#main-content" className="skip-link" onClick={handleClick}>
      Skip to main content
    </a>
  );
}
