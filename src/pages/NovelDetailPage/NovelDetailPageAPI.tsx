import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';

import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import novelService from '../../services/API/novelService';
import { Novel, Chapter } from '../../types';
import { motion } from 'framer-motion';
import ChapterGridSkeleton from '../../components/common/ChapterGridSkeleton/ChapterGridSkeleton';

// Image mappings (Using public assets to avoid Base64)
const coverImageMap = {
  '/assets/images/Novel Card/Thenmozhi Card.jpg': '/assets/covers/Thenmozhi Card.jpg',
  '/assets/images/Novel Card/swetha card.jpg': '/assets/covers/swetha card.jpg',
  '/assets/images/Novel Card/Mohana card.jpg': '/assets/covers/Mohana card.jpg'
};

const chapterImageMap = {
  'Thenmozhi': '/assets/episodes/Thenmozhi_episodes.jpg',
  'Swetha Swe': '/assets/episodes/swetha swe episodes.jpg',
  'Mohanaamozhi': '/assets/episodes/Mohanamozhi episodes.jpg'
};

const NovelDetailPageAPI = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { refreshLibrary } = useReadingProgress();
  const queryClient = useQueryClient();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Queries
  const { 
    data: novel, 
    isLoading: isNovelLoading, 
    error: novelError 
  } = useQuery({
    queryKey: ['novel', id, language],
    queryFn: () => novelService.getNovelById(id!, language),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { 
    data: chaptersData, 
    isLoading: isChaptersLoading 
  } = useQuery({
    queryKey: ['novel-chapters', id, language],
    queryFn: () => novelService.getNovelChapters(id!, language),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const chapters = chaptersData?.chapters || [];
  const error = novelError ? (novelError as Error).message : null;

  // View Increment
  useEffect(() => {
    if (id && novel) {
        novelService.incrementNovelView(id);
    }
  }, [id, novel]);


  // Mutations
  const likeMutation = useMutation({
    mutationFn: async (vars: { id: string, isLiked: boolean }) => {
        if (!vars.isLiked) {
            return novelService.likeNovel(vars.id);
        } else {
            return novelService.unlikeNovel(vars.id);
        }
    },
    onMutate: async ({ id, isLiked }) => {
        await queryClient.cancelQueries({ queryKey: ['novel', id, language] });
        const previousNovel = queryClient.getQueryData(['novel', id, language]);

        queryClient.setQueryData(['novel', id, language], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                isLiked: !isLiked,
                stats: {
                    ...old.stats,
                    likes: (old.stats?.likes || 0) + (isLiked ? -1 : 1)
                }
            };
        });
        return { previousNovel };
    },
    onError: (err, newTodo, context: any) => {
        queryClient.setQueryData(['novel', id, language], context.previousNovel);
        console.error('Like error:', err);
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['novel', id, language] });
    }
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (vars: { id: string, isBookmarked: boolean }) => {
        if (!vars.isBookmarked) {
            return novelService.bookmarkNovel(vars.id);
        } else {
            return novelService.removeBookmark(vars.id);
        }
    },
    onMutate: async ({ id, isBookmarked }) => {
        await queryClient.cancelQueries({ queryKey: ['novel', id, language] });
        const previousNovel = queryClient.getQueryData(['novel', id, language]);

        queryClient.setQueryData(['novel', id, language], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                isBookmarked: !isBookmarked,
                stats: {
                    ...old.stats,
                    bookmarks: (old.stats?.bookmarks || 0) + (isBookmarked ? -1 : 1)
                }
            };
        });
        return { previousNovel };
    },
    onError: (err, newTodo, context: any) => {
        queryClient.setQueryData(['novel', id, language], context.previousNovel);
        console.error('Bookmark error:', err);
        alert(language === 'tamil' ? 'பிழை ஏற்பட்டது' : 'Error occurred');
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['novel', id, language] });
        refreshLibrary();
    }
  });


  // Helper functions to safely extract string values
  const getNovelTitle = (novel: Novel | null): string => {
    if (!novel) return '';
    if (language === 'english') {
      return novel.titleEn || (typeof novel.title === 'string' ? novel.title : (novel.title?.english || novel.title?.tamil || ''));
    }
    if (typeof novel.title === 'string') return novel.title;
    return novel.title?.[language] || novel.title?.tamil || novel.title?.english || '';
  };

  const getNovelDescription = (novel: Novel | null): string => {
    if (!novel) return '';
    if (language === 'english') {
      return novel.descriptionEn || (typeof novel.description === 'string' ? novel.description : (novel.description?.english || novel.description?.tamil || ''));
    }
    if (typeof novel.description === 'string') return novel.description;
    return novel.description?.[language] || novel.description?.tamil || novel.description?.english || '';
  };

  const getChapterTitle = (chapter: Chapter): string => {
    if (language === 'english') {
      if (chapter.titleEn) return chapter.titleEn;
      if (typeof chapter.title === 'object' && (chapter.title.english || chapter.title.en)) {
        return chapter.title.english || chapter.title.en || '';
      }
      return `Chapter ${chapter.chapterNumber}`;
    }
    if (typeof chapter.title === 'string') return chapter.title;
    return chapter.title?.[language] || chapter.title?.tamil || chapter.title?.english || `Chapter ${chapter.chapterNumber}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString(language === 'tamil' ? 'ta-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content?: string) => {
    if (!content) return null;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleCloseLogin = () => setIsLoginModalOpen(false);
  const handleChapterClick = (chapterId: string) => navigate(`/novel/${id}/chapter/${chapterId}`);

  const handleBookmark = () => {
    if (!user) { handleLoginClick(); return; }
    if (!id || !novel) return;
    bookmarkMutation.mutate({ id, isBookmarked: !!novel.isBookmarked });
  };

  const handleLike = () => {
    if (!user) { handleLoginClick(); return; }
    if (!id || !novel) return;
    likeMutation.mutate({ id, isLiked: !!novel.isLiked });
  };

  // 1. Loading State: Only block full page if Novel Data (Metadata) isn't ready
  if (isNovelLoading) {
    return (
      <div className="min-h-screen bg-bg-primary pt-36 px-4">
        <Header onLoginClick={handleLoginClick} />
        <div className="max-w-6xl mx-auto">
             <div className="flex flex-col md:flex-row gap-8 mb-12 animate-pulse">
                <div className="w-48 sm:w-56 md:w-64 lg:w-72 aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="flex-1 space-y-4 py-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="space-y-2 pt-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen bg-bg-primary text-primary pt-36 pb-12 flex flex-col items-center">
        <Header onLoginClick={handleLoginClick} />
        <p className="text-red-400 mb-4">{error || 'Novel not found'}</p>
        <button 
          onClick={() => navigate('/novels')}
          className="px-6 py-2 bg-neon-gold text-black font-bold rounded hover:bg-yellow-400"
        >
          {language === 'tamil' ? 'நாவல்களுக்குத் திரும்பு' : 'Back to Novels'}
        </button>
      </div>
    );
  }

  const chapterImage = chapterImageMap[novel.author as keyof typeof chapterImageMap] || '/assets/episodes/Thenmozhi_episodes.jpg';
  const rawCover = novel.coverImageUrl || novel.coverImage || '';
  const coverImage = (coverImageMap as any)[rawCover] || rawCover || '/assets/covers/Thenmozhi Card.jpg';

  const isLiked = !!novel.isLiked;
  const isBookmarked = !!novel.isBookmarked;

  return (
    <div className="min-h-screen bg-bg-primary text-primary pb-20">
      <Header onLoginClick={handleLoginClick} />

      <div className="container mx-auto px-4 pt-40 md:pt-36">
        
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary dark:text-neon-gold hover:text-neon-gold transition-colors group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium text-lg">{language === 'tamil' ? 'பின்செல்க' : 'Back'}</span>
          </button>
        </div>

        {/* Novel Info Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Left: Cover Image */}
            <div className="flex-shrink-0 w-48 sm:w-56 mx-auto md:mx-0 md:w-64 lg:w-72">
                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
                    <img 
                      src={coverImage} 
                      alt={getNovelTitle(novel)} 
                      width="300"
                      height="450"
                      fetchPriority="high"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-normal pb-2 font-['Noto_Sans_Tamil',_sans-serif]">
                    {getNovelTitle(novel)}
                </h1>
                
                {/* Meta Row: Author & Genres */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                    <span className="text-primary dark:text-gray-200 font-bold bg-surface/30 px-3 py-1 rounded-lg border border-border/50 shadow-sm">{novel.authorName || novel.author}</span>
                    
                    {novel.genre && (
                      <div className="flex flex-wrap gap-2">
                        {novel.genre.split(',').map((g: string, i: number) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-neon-gold/5 border border-neon-gold/20 rounded-full text-xs font-bold text-neon-gold tracking-tight"
                          >
                            {g.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                {/* Description Section */}
                <div className="mb-8 w-full">
                    <h2 className="text-xl font-bold text-primary mb-3">
                        {language === 'tamil' ? 'கதை சுருக்கம்' : 'Story Summary'}
                    </h2>
                    <div className="relative group">
                        <p className={`text-secondary leading-relaxed whitespace-pre-line text-sm md:text-base transition-all duration-300 ${!isSummaryExpanded ? 'line-clamp-4' : ''}`}>
                            {getNovelDescription(novel)}
                        </p>
                        {getNovelDescription(novel).length > 200 && (
                            <button 
                                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                className="mt-2 text-neon-gold hover:text-primary transition-colors text-sm font-bold flex items-center gap-1"
                            >
                                {isSummaryExpanded 
                                    ? (language === 'tamil' ? 'சுருக்கமாக' : 'Read Less') 
                                    : (language === 'tamil' ? 'மேலும் படிக்க' : 'Read More')}
                                <svg 
                                    className={`w-4 h-4 transition-transform duration-300 ${isSummaryExpanded ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Actions: Views, Save, Like */}
                <div className="flex flex-wrap gap-3 mt-auto justify-center md:justify-start w-full md:w-auto">
                    
                    {/* Views Indicator */}
                    <div className="flex items-center gap-2 px-4 py-3.5 bg-surface/50 border border-gray-200 dark:border-white/10 rounded-xl text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-bold text-sm">{novel.stats?.views || 0}</span>
                    </div>

                    <button 
                        onClick={handleBookmark}
                        className={`flex-1 sm:flex-none px-5 py-3.5 border rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                            isBookmarked 
                            ? 'bg-neon-gold/10 border-neon-gold text-neon-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]' 
                            : 'bg-surface/50 border-gray-200 dark:border-white/10 text-secondary hover:border-neon-gold/30 hover:bg-neon-gold/5'
                        }`}
                    >
                        <span className="text-xl">{isBookmarked ? '🔖' : '🏷️'}</span>
                        <span className="hidden sm:inline font-bold text-sm tracking-tight">{isBookmarked ? 'Saved' : 'Save'}</span>
                        <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-[10px] font-black ml-1">
                          {novel.stats?.bookmarks || 0}
                        </span>
                    </button>

                    <button 
                        onClick={handleLike}
                        className={`flex-1 sm:flex-none px-5 py-3.5 border rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                            isLiked 
                            ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                            : 'bg-surface/50 border-gray-200 dark:border-white/10 text-secondary hover:border-red-500/30 hover:bg-red-500/5'
                        }`}
                    >
                        <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span> 
                        <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-[10px] font-black ml-1">
                          {novel.stats?.likes || 0}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        {/* Chapters List */}
        <div className="max-w-4xl">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span>
                    {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'} {chapters.length > 0 && `[` + chapters.length + `]`}
                </span>
            </h2>

            {isChaptersLoading ? (
               <div className="opacity-80">
                  <ChapterGridSkeleton count={5} />
               </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {chapters.map((chapter: Chapter) => (
                        <motion.div
                            key={chapter.id || chapter._id}
                            initial={false}
                            whileHover={{ backgroundColor: 'rgba(30, 41, 59, 1)' }}
                            className="group relative flex items-center p-3 sm:p-4 bg-bg-secondary/80 border border-gray-800 hover:border-neon-gold/30 rounded-xl cursor-pointer transition-all duration-300"
                            onClick={() => handleChapterClick(chapter.id || chapter._id || '')}
                        >
                            {/* Thumbnail with Badge */}
                            <div className="relative flex-shrink-0 mr-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ring-1 ring-white/10">
                                    <img 
                                        src={coverImage} 
                                        alt="Chapter" 
                                        width="80"
                                        height="80"
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-12">
                                <h3 className="text-base sm:text-lg font-bold text-primary mb-1 group-hover:text-neon-gold transition-colors truncate">
                                    {getChapterTitle(chapter)}
                                </h3>
                                
                                {/* Metadata Row */}
                                <div className="flex items-center text-xs sm:text-sm text-muted gap-2 sm:gap-3 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(chapter.createdAt)}
                                    </span>
                                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-600"></span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {chapter.views || 0} {language === 'tamil' ? 'பார்வைகள்' : 'Views'}
                                    </span>
                                </div>
                            </div>


                        </motion.div>
                    ))}
                </div>
            )}
        </div>

      </div>

      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelDetailPageAPI;
