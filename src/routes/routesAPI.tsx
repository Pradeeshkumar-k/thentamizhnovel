import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './routesAPI.css';

// Lazy load page components - API-connected versions
const HomePage = lazy(() => import('../pages/NovelsPage/NovelsPageAPI'));
const NovelsPageAPI = lazy(() => import('../pages/NovelsPage/NovelsPageAPI'));
const NovelDetailPageAPI = lazy(() => import('../pages/NovelDetailPage/NovelDetailPageAPI'));
const ChapterPage = lazy(() => import('../pages/ChapterPage/ChapterPage'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-container">
    <div>
      <div className="loading-emoji">⏳</div>
      <div>Loading...</div>
    </div>
  </div>
);

const AppRoutesAPI = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/novels" element={<NovelsPageAPI />} />
        {/* Dynamic route - works for all novels from API */}
        <Route path="/novel/:id" element={<NovelDetailPageAPI />} />
        <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutesAPI;
