import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import { translations } from '../../translations';
import novelService from '../../services/API/novelService';
import readingProgressService from '../../services/API/readingProgressService';
import { Chapter, Novel } from '../../types';
import { motion } from 'framer-motion';
import { commentService } from '../../services/API/commentService';

const ChapterPageAPI = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { updateProgress } = useReadingProgress();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interaction State
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);


  const t = translations[language as keyof typeof translations];

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleCloseLogin = () => setIsLoginModalOpen(false);

  const handleBack = useCallback(() => {
    navigate(`/novel/${novelId}`);
  }, [novelId, navigate]);

  // Helper to calculate read time
  const calculateReadTime = (content?: string) => {
    if (!content) return '5 min';
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
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

  // Safe string getter
  const getString = (val: string | { [key: string]: string } | undefined) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[language] || val['english'] || '';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  useEffect(() => {
    const fetchChapterData = async () => {
      if (!novelId || !chapterId) return;
      try {
        setLoading(true);
        setError(null);

        // Fetch novel basic info if not already loaded
        if (!novel) {
          const novelData = await novelService.getNovelById(novelId);
          setNovel(novelData.novel);
        }

        // Fetch current chapter
        const chapterData = await novelService.getChapter(novelId, chapterId, language);
        setChapter(chapterData);

        // Fetch all chapters for navigation
        if (allChapters.length === 0) {
          const chaptersList = await novelService.getNovelChapters(novelId);
          setAllChapters(chaptersList.chapters || []);
        }

        // Update reading progress - Rule #1: Only when IDs exist
        if (novelId && chapterId && chapterData) {
            updateProgress(novelId, Number(chapterId));
            
            // Rule #4: Call progress fetch only on Reader page
            if (user) {
                readingProgressService.getReadingProgress(novelId, chapterId)
                    .then((res: any) => {
                        if (res?.success && res.data) {
                            console.log('Reading progress restored:', res.data.progress);
                        }
                    })
                    .catch((err: any) => console.error('Error fetching progress:', err));
            }
        }
        
        // Update interaction counts
        if (chapterData) {
            setLikesCount(chapterData._count?.likes || 0);
            setComments(chapterData.comments || []);
        }
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError('Failed to load chapter content.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [novelId, chapterId, language]);

  // Handle navigation
  const currentIndex = allChapters.findIndex(c => (c.id || c._id) === chapterId);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  const navigateToChapter = (id: string) => {
    navigate(`/novel/${novelId}/chapter/${id}`);
  };

  // Interaction Handlers
  const handleLike = async () => {
    if (!user) { setIsLoginModalOpen(true); return; }
    try {
        if (isLiked) {
            await novelService.unlikeChapter(chapterId!);
            setLikesCount(p => Math.max(0, p - 1));
        } else {
            await novelService.likeChapter(chapterId!);
            setLikesCount(p => p + 1);
        }
        setIsLiked(!isLiked);
    } catch (err) { console.error('Like error', err); }
  };

  const handleBookmark = async () => {
    if (!user) { setIsLoginModalOpen(true); return; }
    if (!novelId) return;
    try {
        if (isBookmarked) {
            await novelService.removeBookmark(novelId);
        } else {
            await novelService.bookmarkNovel(novelId);
        }
        setIsBookmarked(!isBookmarked);
        alert(isBookmarked ? 'Removed from Library' : 'Added to Library');
    } catch (err) { console.error('Bookmark error', err); }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-primary flex justify-center items-center">
        <Header onLoginClick={handleLoginClick} />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-gold"></div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-bg-primary text-primary pt-24 pb-12 flex flex-col items-center">
        <Header onLoginClick={handleLoginClick} />
        <p className="text-red-400 mb-4">{error || 'Chapter not found'}</p>
        <button 
          onClick={handleBack}
          className="px-6 py-2 bg-neon-gold text-black font-bold rounded hover:bg-yellow-400"
        >
          {t.chapter.back}
        </button>
      </div>
    );
  }

  const contentToDisplay = language === 'english' 
    ? (chapter.content_en || chapter.contentEn || chapter.content) 
    : chapter.content;
  const contentParagraphs = (contentToDisplay || '').split('\n\n');

  return (
    <div className="min-h-screen bg-bg-primary text-secondary transition-colors duration-300">
      <Header onLoginClick={handleLoginClick} />

      <main className="container mx-auto px-4 pt-52 md:pt-36 pb-20 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="mb-8 text-neon-gold hover:text-primary transition-colors flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {getString(novel?.title)}
        </button>

        {/* Title Section */}
        <header className="mb-12 text-center border-b border-border pb-8">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4 leading-tight">
            {language === 'english' 
              ? (chapter.title_en || chapter.titleEn || getString(chapter.title) || `Chapter ${chapter.chapterNumber}`)
              : (getString(chapter.title) || `Chapter ${chapter.chapterNumber}`)
            }
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-secondary font-medium">
            <span className="bg-surface px-3 py-1 rounded-full text-muted border border-border">
               {language === 'tamil' ? 'அத்தியாயம்' : 'Chapter'} {chapter.chapterNumber}
            </span>
            <span className="hidden sm:inline text-muted">•</span>
            <span className="flex items-center gap-1 text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(chapter.publishedAt || chapter.createdAt)}
            </span>
            <span className="hidden sm:inline text-muted">•</span>
            <span className="flex items-center gap-1 text-muted">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {calculateReadTime(chapter.content)}
            </span>
          </div>
        </header>

        {/* Story Content */}
        <article className="prose prose-lg max-w-none mb-16 dark:prose-invert">
          {contentParagraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className="text-primary leading-8 mb-6 font-serif"
            >
              {paragraph}
            </p>
          ))}
        </article>




        {/* Interaction Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-4 border-y border-border py-6 mb-12">
            {/* Left Group: Like & Save */}
            <div className="flex items-center gap-6 w-full md:w-auto">
                <button    
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-secondary hover:text-red-500'}`}
                >
                    <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">{likesCount} Likes</span>
                </button>
                
                <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 transition-colors ${isBookmarked ? 'text-neon-gold' : 'text-secondary hover:text-neon-gold'}`}
                >
                    <svg className={`w-6 h-6 ${isBookmarked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
            </div>
            
            {/* Right Group: Share & Comments */}
            <div className="flex items-center gap-6 w-full md:w-auto">
                {/* Share Button (Moved before Comments) */}
                <button 
                    onClick={async () => {
                        const shareData = {
                            title: getString(novel?.title) || 'Read this Novel',
                            text: `Check out this chapter: ${getString(chapter?.title)}`,
                            url: window.location.href
                        };
                        try {
                            if (navigator.share) {
                                await navigator.share(shareData);
                            } else {
                                await navigator.clipboard.writeText(window.location.href);
                                alert(language === 'tamil' ? 'இணைப்பு நகலெடுக்கப்பட்டது' : 'Link copied to clipboard');
                            }
                        } catch (err) {
                            console.error('Error sharing:', err);
                        }
                    }}
                    className="flex items-center gap-2 text-secondary hover:text-neon-gold transition-colors"
                >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                     </svg>
                     <span className="font-medium">{language === 'tamil' ? 'பகிர்' : 'Share'}</span>
                </button>

                {/* Comments Button */}
                <button onClick={() => navigate(`/novel/${novelId}/chapter/${chapterId}/comments`)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                     </svg>
                     <span className="font-medium">{comments.length} Comments</span>
                </button>
            </div>
        </div>

        {/* View Comments Link */}
        <div className="flex justify-center mb-16">
            <button
                onClick={() => navigate(`/novel/${novelId}/chapter/${chapterId}/comments`)}
                className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all group w-full sm:w-auto justify-center"
            >
                <div className="relative">
                     <svg className="w-6 h-6 text-gray-400 group-hover:text-neon-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                     </svg>
                     {comments.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white dark:border-zinc-900">
                            {comments.length}
                        </span>
                     )}
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary">
                    View & Post Comments
                </span>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-16 border-t border-border pt-8">
          <button
            onClick={() => prevChapter && navigateToChapter(prevChapter.id || prevChapter._id || '')}
            disabled={!prevChapter}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
                prevChapter 
                ? 'border-neon-gold text-neon-gold hover:bg-neon-gold hover:text-black hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                : 'border-border text-muted cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-bold">{t.chapter.previous}</span>
          </button>

          <button
            onClick={() => nextChapter && navigateToChapter(nextChapter.id || nextChapter._id || '')}
            disabled={!nextChapter}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
                nextChapter 
                ? 'border-neon-gold text-neon-gold hover:bg-neon-gold hover:text-black hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                : 'border-border text-muted cursor-not-allowed'
            }`}
          >
            <span className="font-bold">{t.chapter.next}</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* More Chapters Section */}
        <section className="bg-surface/50 rounded-xl p-6 border border-border">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-neon-gold rounded-full"></span>
                {language === 'tamil' ? 'மேலும் அத்தியாயங்கள்' : 'More Chapters'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allChapters
                    .filter(c => (c.id || c._id) !== chapterId) // Exclude current
                    .slice(0, 6) // Show only next 6 recommendations
                    .map(c => (
                    <motion.div
                        key={c.id || c._id}
                        whileHover={{ y: -5 }}
                        className="bg-bg-primary p-4 rounded-lg border border-border hover:border-neon-gold/30 cursor-pointer group"
                        onClick={() => navigateToChapter(c.id || c._id || '')}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-neon-gold text-xs font-bold bg-neon-gold/10 px-2 py-1 rounded">
                                #{c.chapterNumber}
                            </span>
                            <span className="text-xs text-muted">
                                {calculateReadTime(c.content)}
                            </span>
                        </div>
                        <h4 className="text-primary font-medium group-hover:text-neon-gold transition-colors line-clamp-2">
                            {(language === 'english' && c.titleEn) ? c.titleEn : getString(c.title)}
                        </h4>
                    </motion.div>
                ))}
            </div>
        </section>

      </main>

      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default ChapterPageAPI;
