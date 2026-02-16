import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReadingProgressProvider } from './context/ReadingProgressContext';
import Footer from './components/layout/Footer/Footer';
import AppRoutes from './routes/routes';
import { consoleHelper } from './utils/consoleHelper';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './styles/App.scss';



function App() {
  useEffect(() => {
    // Initialize console helper on app load
    consoleHelper.disableDetailed()
  }, [])
  return (
    <AuthProvider>
      <ReadingProgressProvider>

        <div className="app">
          <main className="app-content">
            <AppRoutes />
          </main>

          <Footer />
        </div>
        <SpeedInsights />
      </ReadingProgressProvider>
    </AuthProvider>
  );
}

export default App;
