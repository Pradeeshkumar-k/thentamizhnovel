import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, Component, ErrorInfo, ReactNode, memo } from 'react';
import './routes.scss';

// Lazy load page components
const NovelsPage = lazy(() => import('../pages/NovelsPage/NovelsPageAPI'));
const NovelDetailPage = lazy(() => import('../pages/NovelDetailPage/NovelDetailPageAPI'));

const ThenmozhiNovelPage = lazy(() => import('../pages/ThenmozhiNovelPage/ThenmozhiNovelPage'));
const MohanaNovelPage = lazy(() => import('../pages/MohanaNovelPage/MohanaNovelPage'));
const ChapterPage = lazy(() => import('../pages/ChapterPage/ChapterPageAPI'));

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage/SignupPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage/AboutUsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage/ContactPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));
const LibraryPage = lazy(() => import('../pages/LibraryPage/LibraryPage'));
const TermsPage = lazy(() => import('../pages/TermsPage/TermsPage'));

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import('../components/admin/AdminLayout/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard/AdminDashboard'));
const NovelList = lazy(() => import('../pages/Admin/NovelManagement/NovelList'));
const NovelCreate = lazy(() => import('../pages/Admin/NovelManagement/NovelCreate'));
const NovelEdit = lazy(() => import('../pages/Admin/NovelManagement/NovelEdit'));
const ChapterList = lazy(() => import('../pages/Admin/ChapterManagement/ChapterList'));
const ChapterCreate = lazy(() => import('../pages/Admin/ChapterManagement/ChapterCreate'));
const ChapterEdit = lazy(() => import('../pages/Admin/ChapterManagement/ChapterEdit'));
const ForbiddenPage = lazy(() => import('../pages/Admin/ForbiddenPage/ForbiddenPage'));

// Import route guard
import RoleProtectedRoute from '../components/common/RoleProtectedRoute/RoleProtectedRoute';

const LoadingFallback = memo(() => (
  <div className="loading-fallback">
    <div>Loading...</div>
  </div>
));

// Error boundary interfaces
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error boundary for lazy-loaded components
class LazyLoadErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Lazy loading error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div>Something went wrong. Please refresh the page.</div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppRoutes = () => {
  return (
    <LazyLoadErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Public Routes */}
        <Route path="/" element={<NovelsPage />} />
        <Route path="/novels" element={<NovelsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/terms" element={<TermsPage />} />
        {/* Specific routes first (for hardcoded novel pages) */}
        <Route path="/novel/1" element={<ThenmozhiNovelPage />} />
        <Route path="/novel/3" element={<MohanaNovelPage />} />
        {/* Generic routes after specific ones */}
        <Route path="/novel/:id" element={<NovelDetailPage />} />
        <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterPage />} />

        {/* 403 Forbidden Page (no protection needed) */}
        <Route path="/403" element={<ForbiddenPage />} />

        {/* Admin Routes - Protected by RoleProtectedRoute */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN', 'EDITOR']}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Novel Management */}
          <Route path="novels" element={<NovelList />} />
          <Route path="novels/create" element={<NovelCreate />} />
          <Route path="novels/edit/:id" element={<NovelEdit />} />

          {/* Chapter Management */}
          <Route path="chapters" element={<ChapterList />} />
          <Route path="chapters/create" element={<ChapterCreate />} />
          <Route path="chapters/edit/:id" element={<ChapterEdit />} />
        </Route>
        </Routes>
      </Suspense>
    </LazyLoadErrorBoundary>
  );
};

export default AppRoutes;
