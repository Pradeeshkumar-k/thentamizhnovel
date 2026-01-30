import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext'; // Added import

import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import novelService from '../../services/API/novelService';
import { Novel, Chapter } from '../../types';
import { motion } from 'framer-motion';

// Import images
import thenmozhiCard from '../../assets/images/Novel Card/Thenmozhi Card.jpg';
import swethaCard from '../../assets/images/Novel Card/swetha card.jpg';
import mohanaCard from '../../assets/images/Novel Card/Mohana card.jpg';
import thenmozhiChapterImage from '../../assets/images/episodes_card/Thenmozhi_episodes.jpg';
import swethaChapterImage from '../../assets/images/episodes_card/swetha swe episodes.jpg';
import mohanaChapterImage from '../../assets/images/episodes_card/Mohanamozhi episodes.jpg';

// Image mappings
const coverImageMap = {
  '/assets/images/Novel Card/Thenmozhi Card.jpg': thenmozhiCard,
  '/assets/images/Novel Card/swetha card.jpg': swethaCard,
  '/assets/images/Novel Card/Mohana card.jpg': mohanaCard
};

const chapterImageMap = {
  'Thenmozhi': thenmozhiChapterImage,
  'Swetha Swe': swethaChapterImage,
  'Mohanaamozhi': mohanaChapterImage
};

const NovelDetailPageAPI = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { refreshLibrary } = useReadingProgress(); // Get refreshLibrary

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Helper functions to safely extract string values
  const getNovelTitle = (novel: Novel | null): string => {
    if (!novel) return '';
    if (language === 'english') {
      return novel.title_en || novel.titleEn || (typeof novel.title === 'string' ? novel.title : (novel.title?.english || novel.title?.tamil || ''));
    }
    if (typeof novel.title === 'string') return novel.title;
    return novel.title?.[language] || novel.title?.tamil || novel.title?.english || '';
  };

  const getNovelDescription = (novel: Novel | null): string => {
    if (!novel) return '';
    if (language === 'english') {
      return novel.summary_en || novel.description_en || novel.descriptionEn || (typeof novel.description === 'string' ? novel.description : (novel.description?.english || novel.description?.tamil || ''));
    }
    if (typeof novel.description === 'string') return novel.description;
    return novel.description?.[language] || novel.description?.tamil || novel.description?.english || '';
  };

  const getChapterTitle = (chapter: Chapter): string => {
    if (language === 'english' && chapter.titleEn) return chapter.titleEn;
    if (typeof chapter.title === 'string') return chapter.title;
    return chapter.title?.[language] || chapter.title?.tamil || chapter.title?.english || `Chapter ${chapter.chapterNumber}`;
  };

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString(language === 'tamil' ? 'ta-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper to calculate read time
  const calculateReadTime = (content?: string) => {
    if (!content) return null; // Hide if no content
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Fetch novel and chapters from API
  useEffect(() => {
    const fetchNovelData = async () => {
      if (!id) return;
      try {
        setLoading(true);

        // Fetch novel details
        const novelResponse = await novelService.getNovelById(id, language);
        setNovel(novelResponse.novel);
        
        // Initialize interaction state from API
        setIsLiked(!!novelResponse.isLiked);
        setIsBookmarked(!!novelResponse.isBookmarked);
        
        // Fetch chapters
        const chaptersResponse = await novelService.getNovelChapters(id);
        // Clean chapters data to remove fake read times if content is missing
        setChapters(chaptersResponse.chapters || []);

        setError(null);
      } catch (err) {
        console.error('Error fetching novel data:', err);
        setError('Failed to load novel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNovelData();
    }
  }, [id, language]);

  // Sync bookmark state with library context on load could be added here
  // But for now, we just implement the action.

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleChapterClick = (chapterId: string) => {
    navigate(`/novel/${id}/chapter/${chapterId}`);
  };



  const handleBookmark = async () => {
    if (!user) {
      handleLoginClick();
      return;
    }
    if (!id) return;

    // Optimistic UI update
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      if (!previousState) {
          await novelService.bookmarkNovel(id);
          // alert(language === 'tamil' ? 'புக்மார்க் சேர்க்கப்பட்டது' : 'Bookmarked successfully');
      } else {
          await novelService.removeBookmark(id);
          // alert(language === 'tamil' ? 'புக்மார்க் நீக்கப்பட்டது' : 'Bookmark removed');
      }
      
      // Update stats count locally
      setNovel(prev => {
        if (!prev) return null;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            views: prev.stats?.views || 0,
            likes: prev.stats?.likes || 0,
            bookmarks: (prev.stats?.bookmarks || 0) + (previousState ? -1 : 1)
          }
        };
      });

      // Update library cache
      refreshLibrary();

    } catch (err) {
      console.error('Error bookmarking novel:', err);
      // Revert on error
      setIsBookmarked(previousState);
      alert(language === 'tamil' ? 'பிழை ஏற்பட்டது' : 'Error occurred');
    }
  };

  const handleLike = async () => {
    if (!user) {
      handleLoginClick();
      return;
    }
    if (!id) return;

    // Optimistic UI
    const previousState = isLiked;
    setIsLiked(!previousState);

    try {
      if (!previousState) {
        await novelService.likeNovel(id);
      } else {
        await novelService.unlikeNovel(id);
      }
      
      // Update stats
      setNovel(prev => {
        if (!prev) return null;
        return {
          ...prev,
          stats: {
             ...prev.stats,
             views: prev.stats?.views || 0,
             bookmarks: prev.stats?.bookmarks || 0,
             likes: (prev.stats?.likes || 0) + (previousState ? -1 : 1)
          }
        };
      });
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert on error
      setIsLiked(previousState);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-primary pt-36 pb-12 flex justify-center items-center">
        <Header onLoginClick={handleLoginClick} />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-neon-gold"></div>
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

  const chapterImage = chapterImageMap[novel.author as keyof typeof chapterImageMap] || thenmozhiChapterImage;
  const coverImage = (coverImageMap as any)[novel.coverImage || ''] || novel.coverImage || thenmozhiCard;


  return (
    <div className="min-h-screen bg-bg-primary text-primary pb-20">
      <Header onLoginClick={handleLoginClick} />

      <div className="container mx-auto px-4 pt-36 md:pt-36">
        
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
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
                
                {/* Meta Row: Author, Genre, Views */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-secondary font-medium text-base mb-6">
                    <span className="text-primary dark:text-gray-200">{novel.author}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    <span className="text-neon-blue">{novel.genre}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    <div className="flex items-center gap-1.5 text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{novel.stats?.views || 0}</span>
                    </div>
                </div>



                {/* Description Section - MOVED & RESTYLED */}
                <div className="mb-8 w-full">
                    <h2 className="text-xl font-bold text-primary mb-3 border-l-4 border-neon-gold pl-3">
                        {language === 'tamil' ? 'கதை சுருக்கம்' : 'Story Summary'}
                    </h2>
                    <p className="text-secondary leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {getNovelDescription(novel)}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-auto justify-center md:justify-start w-full md:w-auto">

                    <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                            onClick={handleBookmark}
                            className={`flex-1 sm:flex-none px-6 py-3.5 border rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                                isBookmarked 
                                ? 'bg-neon-gold/10 border-neon-gold text-neon-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]' 
                                : 'bg-surface/50 border-gray-200 dark:border-white/10 text-secondary hover:border-gray-300 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                        >
                            <span className="text-xl">{isBookmarked ? '🔖' : '🏷️'}</span>
                            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                            <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-xs ml-1">
                              {novel.stats?.bookmarks || 0}
                            </span>
                        </button>

                        <button 
                            onClick={handleLike}
                            className={`flex-1 sm:flex-none px-6 py-3.5 border rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                                isLiked 
                                ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                                : 'bg-surface/50 border-gray-200 dark:border-white/10 text-secondary hover:border-gray-300 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                        >
                            <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span> 
                            <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-xs ml-1">
                              {novel.stats?.likes || 0}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>



        {/* Chapters List - REFERENCE STYLE */}
        <div className="max-w-4xl">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="border-l-[6px] border-neon-gold pl-4">
                    {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'} [{chapters.length}]
                </span>
            </h2>

            <div className="flex flex-col gap-3">
                {chapters.map((chapter) => (
                    <motion.div
                        key={chapter.id || chapter._id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ backgroundColor: 'rgba(30, 41, 59, 1)' }} // lighter slate on hover
                        className="group relative flex items-center p-3 sm:p-4 bg-bg-secondary/80 border border-gray-800 hover:border-neon-gold/30 rounded-xl cursor-pointer transition-all duration-300"
                        onClick={() => handleChapterClick(chapter.id || chapter._id || '')}
                    >
                        {/* Thumbnail with Badge */}
                        <div className="relative flex-shrink-0 mr-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ring-1 ring-white/10">
                                <img 
                                    src={coverImage} 
                                    alt="Chapter" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-neon-gold text-black text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                                {chapter.chapterNumber}
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
                                {calculateReadTime(chapter.content) && (
                                    <>
                                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-600"></span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {calculateReadTime(chapter.content)}
                                        </span>
                                    </>
                                )}
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
        </div>

      </div>

      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelDetailPageAPI;
