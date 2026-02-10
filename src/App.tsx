import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReadingProgressProvider } from './context/ReadingProgressContext';
import Footer from './components/layout/Footer/Footer';
import AppRoutes from './routes/routes';
import { consoleHelper } from './utils/consoleHelper';
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
      </ReadingProgressProvider>
    </AuthProvider>
  );
}

export default App;
