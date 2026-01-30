import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use setTimeout to ensure DOM is fully rendered/stabilized before scrolling
    setTimeout(() => {
      // The scrollable container is '.app', not window/body
      const appContainer = document.querySelector('.app');
      if (appContainer) {
        appContainer.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      } else {
        // Fallback just in case structure changes
        window.scrollTo(0, 0);
      }
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
