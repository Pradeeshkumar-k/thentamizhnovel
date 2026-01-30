import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Aggressively reset scroll on all possible containers
    // Use a small timeout to ensure the new page layout is rendered
    setTimeout(() => {
      // 1. Standard window scroll
      window.scrollTo(0, 0);
      
      // 2. Document/Body scroll (for some mobile browsers)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 3. Custom container scroll (.app class)
      const appContainer = document.querySelector('.app');
      if (appContainer) {
        appContainer.scrollTop = 0;
      }
      
      // 4. Main content scroll (if it exists separately)
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }, 50); // Slight 50ms delay to allow React to render new route content
  }, [pathname]);

  return null;
};

export default ScrollToTop;
