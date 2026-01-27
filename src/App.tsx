import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReadingProgressProvider } from './context/ReadingProgressContext';
import Footer from './components/layout/Footer/Footer';
import AppRoutes from './routes/routes';
import { consoleHelper } from './utils/consoleHelper';
import './styles/App.scss';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    // Initialize console helper on app load
    consoleHelper.disableDetailed()
  }, [])
  return (
    <AuthProvider>
      <ReadingProgressProvider>
        <ScrollToTop />
        <div className="app">
          <div className="app-content">
            <AppRoutes />
          </div>

          <Footer />
        </div>
      </ReadingProgressProvider>
    </AuthProvider>
  );
}

export default App;
