import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query'; // Import React Query
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import Header from '../../components/layout/Header/Header';
import Carousel from '../../components/common/Carousel/Carousel';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import novelService from '../../services/API/novelService';
import { useReadingProgress } from '../../context/ReadingProgressContext'; // Import Context
import { motion, AnimatePresence } from 'framer-motion';
import NovelGridSkeleton from '../../components/skeletons/NovelGridSkeleton';
import { getLocalizedTitle } from '../../utils/languageUtils';

// Image mapping (Using public assets to avoid Base64)
const imageMap = {
  '/assets/images/Novel Card/Thenmozhi Card.jpg': '/assets/covers/Thenmozhi Card.jpg',
  '/assets/images/Novel Card/swetha card.jpg': '/assets/covers/swetha card.jpg',
  '/assets/images/Novel Card/Mohana card.jpg': '/assets/covers/Mohana card.jpg'
};

const NovelsPageAPI = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { ongoingNovels } = useReadingProgress(); // Use Context directly
  
  const t = translations[language as keyof typeof translations];

  // Removed manual fetch - Context handles it now for both Auth & Anon users

  // ==========================================
  // React Query Implementation
  // ==========================================
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error: queryError
  } = useInfiniteQuery({
    queryKey: ['novels', location.search],
    queryFn: async ({ pageParam = null }) => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        // Ensure novelService.getAllNovels accepts pageParam as cursor.
        // Assuming signature: getAllNovels(params, cursor)
        return novelService.getAllNovels({ search: query || undefined }, (pageParam as unknown) as string | undefined);
    },
    getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Flatten the pages into a single array of novels
  const novels = data?.pages.flatMap((page: any) => page.novels) || [];
  const loading = isLoading;
  // Format error message
  const errorMessage = isError ? ((queryError as any)?.response?.data?.error || (queryError as any)?.message || 'Unknown error') : null;

  // Infinite Scroll Trigger
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const target = document.querySelector('#infinite-scroll-trigger');
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleNovelClick = (novelId: string) => {
    navigate(`/novel/${novelId}`);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-primary pb-20">
      <Header onLoginClick={handleLoginClick} />
      
      <div className="pt-32 md:pt-28 pb-8">
        <Carousel />
        
        {/* Main Content Container */}
        <div className="container mx-auto px-4 pt-4 md:pt-8">
          {loading ? (
            <div className="space-y-12">
               <NovelGridSkeleton count={10} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/50 rounded-xl text-center">
              <p className="text-red-300 text-lg mb-4">{errorMessage}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {language === 'tamil' ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry'}
              </button>
            </div>
          ) : (
            <>
              {/* Continue Reading Section (Real Progress via Context) */}
              {ongoingNovels.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-l-4 border-neon-gold pl-4">
                    Continue Reading
                  </h2>
                  <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-neon-gold/30 scrollbar-track-bg-secondary">
                    {ongoingNovels.map((novel: any, index: number) => (
                      <motion.div 
                        key={novel.novelId}
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0 w-40 md:w-48 cursor-pointer relative group rounded-xl overflow-hidden shadow-lg border border-transparent hover:border-neon-gold/50 transition-all duration-300"
                        onClick={() => navigate(`/novel/${novel.novelId}/chapter/${novel.lastChapterId || novel.lastChapter}`)}
                      >
                         <div className="aspect-[2/3] w-full relative">
                            {novel.coverImage ? (
                              <img
                                src={(imageMap as any)[novel.coverImage] || novel.coverImage}
                                alt={novel.novelTitle}
                                loading={index === 0 ? "eager" : "lazy"}
                                fetchPriority={index === 0 ? "high" : "auto"}
                                width="180"
                                height="270"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-surface flex items-center justify-center text-4xl">
                                📖
                              </div>
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                            
                            {/* Compact details for continue reading */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-neon-gold transition-colors">
                                  {getLocalizedTitle(novel, language)}
                                </h3>
                                <p className="text-xs text-gray-300">
                                  Chapter {novel.lastChapterOrder} / {novel.totalChapters}
                                </p>
                                {/* Progress Bar */}
                                <div className="w-full h-1 bg-gray-600 rounded-full mt-2 overflow-hidden">
                                  <div 
                                    className="h-full bg-neon-gold" 
                                    style={{ width: `${Math.min(100, Math.round((novel.lastChapterOrder / novel.totalChapters) * 100))}%` }}
                                  ></div>
                                </div>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Launch Section */}
              {novels.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-l-4 border-neon-gold pl-4">
                    Latest Update
                  </h2>
                  <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-neon-gold/30 scrollbar-track-bg-secondary">
                    {novels.slice(0, 10).map((novel: any) => (
                      <motion.div 
                        key={novel.id || novel._id}
                        whileHover={{ y: -5 }}
                        className="flex-shrink-0 w-40 md:w-48 relative group cursor-pointer aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-surface ring-1 ring-white/10 hover:ring-neon-gold transition-all duration-300 hover:shadow-neon-gold/20"
                        onClick={() => handleNovelClick(novel.id || novel._id)}
                      >
                        {/* Image Layer */}
                        <div className="absolute inset-0">
                          {novel.coverImage ? (
                            <img
                              src={(imageMap as any)[novel.coverImage] || novel.coverImage}
                              alt={novel.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-surface flex items-center justify-center text-muted">
                               <span className="text-4xl">📖</span>
                            </div>
                          )}
                        </div>

                        {/* Gradient Overlay Layer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-300"></div>

                        {/* Content Layer */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <h3 className="text-lg md:text-xl font-bold text-white leading-normal py-1 mb-1 group-hover:text-neon-gold transition-colors line-clamp-2 font-['Noto_Sans_Tamil',_sans-serif]">
                                  {getLocalizedTitle(novel, language)}
                              </h3>
                              <p className="text-sm text-gray-300 font-medium mb-2">
                                  {novel.author}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 border-t border-gray-700 pt-2 mt-2">
                                  <span className="flex items-center gap-1">
                                      {novel.totalChapters} {novel.totalChapters === 1 ? 'Part' : 'Parts'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                      👁️ {novel.stats?.views || 0}
                                  </span>
                              </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ongoing Novels Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-primary border-l-4 border-neon-gold pl-4">
                  Ongoing Novels
                </h2>
                {novels.filter((n: any) => n.status !== 'COMPLETED').length > 0 ? (
                  <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-neon-gold/30 scrollbar-track-bg-secondary">
                    {novels.filter((n: any) => n.status !== 'COMPLETED').map((novel: any) => (
                      <motion.div 
                        key={novel.id || novel._id}
                        whileHover={{ y: -5 }}
                        className="flex-shrink-0 w-40 md:w-48 relative group cursor-pointer aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-surface ring-1 ring-white/10 hover:ring-neon-gold transition-all duration-300 hover:shadow-neon-gold/20"
                        onClick={() => handleNovelClick(novel.id || novel._id)}
                      >
                        {/* Image Layer */}
                        <div className="absolute inset-0">
                          {novel.coverImage ? (
                            <img
                              src={(imageMap as any)[novel.coverImage] || novel.coverImage}
                              alt={novel.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-surface flex items-center justify-center text-muted">
                               <span className="text-4xl">📖</span>
                            </div>
                          )}
                        </div>

                        {/* Gradient Overlay Layer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-300"></div>

                        {/* Content Layer */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <h3 className="text-lg md:text-xl font-bold text-white leading-normal py-1 mb-1 group-hover:text-neon-gold transition-colors line-clamp-2 font-['Noto_Sans_Tamil',_sans-serif]">
                                  {getLocalizedTitle(novel, language)}
                              </h3>
                              <p className="text-sm text-gray-300 font-medium mb-2">
                                  {novel.author}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 border-t border-gray-700 pt-2 mt-2">
                                  <span className="flex items-center gap-1">
                                      {novel.totalChapters} {novel.totalChapters === 1 ? 'Part' : 'Parts'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                      👁️ {novel.stats?.views || 0}
                                  </span>
                              </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                   <p className="text-gray-500 ml-4">No ongoing novels found.</p>
                )}
              </div>

              {/* Completed Novels Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-primary border-l-4 border-neon-gold pl-4">
                  Completed Novels
                </h2>
                {novels.filter((n: any) => n.status === 'COMPLETED').length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                    {novels.filter((n: any) => n.status === 'COMPLETED').map((novel: any) => (
                      <motion.div 
                        key={novel.id || novel._id}
                        whileHover={{ y: -5 }}
                        className="relative group cursor-pointer aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-surface ring-1 ring-white/10 hover:ring-neon-gold transition-all duration-300 hover:shadow-neon-gold/20"
                        onClick={() => handleNovelClick(novel.id || novel._id)}
                      >
                        {/* Image Layer */}
                        <div className="absolute inset-0">
                          {novel.coverImage ? (
                            <img
                              src={(imageMap as any)[novel.coverImage] || novel.coverImage}
                              alt={novel.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-surface flex items-center justify-center text-muted">
                               <span className="text-4xl">📖</span>
                            </div>
                          )}
                        </div>

                        {/* Gradient Overlay Layer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-300"></div>

                        {/* Content Layer */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <h3 className="text-lg md:text-xl font-bold text-white leading-normal py-1 mb-1 group-hover:text-neon-gold transition-colors line-clamp-2 font-['Noto_Sans_Tamil',_sans-serif]">
                                  {getLocalizedTitle(novel, language)}
                              </h3>
                              <p className="text-sm text-gray-300 font-medium mb-2">
                                  {novel.author}
                              </p>
                              <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400 rounded-full mb-2 border border-green-500/30">
                                COMPLETED
                              </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                   <p className="text-gray-500 ml-4">No completed novels found.</p>
                )}
              </div>

              {/* Infinite Scroll Trigger */}
              <div id="infinite-scroll-trigger" className="h-20 flex items-center justify-center">
                {isFetchingNextPage && (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-gold"></div>
                )}
                {!hasNextPage && novels.length > 0 && (
                  <p className="text-muted text-sm font-medium"></p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelsPageAPI;
