import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import { translations } from '../../translations';
import novelService from '../../services/API/novelService';
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
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

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

        // Update reading progress
        if (chapterData && chapterData.chapterNumber) {
           updateProgress(novelId, chapterData.chapterNumber);
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
  const currentIndex = allChapters.findIndex(c => (c._id || c.id) === chapterId);
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setIsLoginModalOpen(true); return; }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    const res = await commentService.addComment(chapterId!, newComment);
    if (res.success) {
        setComments([res.data, ...comments]);
        setNewComment('');
    } else {
        alert('Failed to post comment');
    }
    setSubmittingComment(false);
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

      <main className="container mx-auto px-4 pt-36 pb-20 max-w-4xl">
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
        <div className="flex items-center justify-between border-y border-border py-6 mb-12">
            <div className="flex gap-6">
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
            
            <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
                 <span className="font-medium">{comments.length} Comments</span>
            </button>
        </div>

        {/* Comments Section */}
        <section className="mb-16 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                Comments 
                <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-bold">
                   {comments.length}
                </span>
            </h3>

            {/* Comments List */}
            <div className="space-y-8 mb-10">
                {comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1.5">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">
                                    {comment.user?.name || 'User'}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg rounded-tl-none">
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {comments.length === 0 && (
                     <div className="text-center py-10">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                           💬
                        </div>
                        <p className="text-gray-500 text-sm">No comments yet. Be the first to share thoughts!</p>
                     </div>
                )}
            </div>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "Write a comment..." : "Login to comment"}
                        disabled={!user}
                        className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-full py-3.5 pl-6 pr-14 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!user || submittingComment || !newComment.trim()}
                        className="absolute right-2 top-1.5 bottom-1.5 w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-95"
                    >
                         {submittingComment ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         ) : (
                            <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                         )}
                    </button>
                </div>
            </form>
        </section>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-16 border-t border-border pt-8">
          <button
            onClick={() => prevChapter && navigateToChapter(prevChapter._id || prevChapter.id)}
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
            onClick={() => nextChapter && navigateToChapter(nextChapter._id || nextChapter.id)}
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
                    .filter(c => (c._id || c.id) !== chapterId) // Exclude current
                    .slice(0, 6) // Show only next 6 recommendations
                    .map(c => (
                    <motion.div
                        key={c._id || c.id}
                        whileHover={{ y: -5 }}
                        className="bg-bg-primary p-4 rounded-lg border border-border hover:border-neon-gold/30 cursor-pointer group"
                        onClick={() => navigateToChapter(c._id || c.id)}
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
