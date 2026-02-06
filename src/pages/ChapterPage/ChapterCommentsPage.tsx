import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import novelService from '../../services/API/novelService';
import { commentService } from '../../services/API/commentService';

const ChapterCommentsPage = () => {
    const { novelId, chapterId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [loading, setLoading] = useState(true);

    const t = translations[language as keyof typeof translations];

    const handleLoginClick = () => setIsLoginModalOpen(true);
    const handleCloseLogin = () => setIsLoginModalOpen(false);

    useEffect(() => {
        const fetchComments = async () => {
            if (!novelId || !chapterId) return;
            try {
                setLoading(true);
                // Fetch comments specifically
                const res = await commentService.getComments(chapterId);
                if (res.success && res.data && res.data.success) {
                    setComments(res.data.data || []);
                } else {
                    setComments([]);
                }
            } catch (err) {
                console.error('Error fetching comments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [novelId, chapterId, language]);

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

    return (
        <div className="min-h-screen bg-bg-primary text-secondary transition-colors duration-300">
            <Header onLoginClick={handleLoginClick} />

            <main className="container mx-auto px-4 pt-36 pb-20 max-w-4xl">
                {/* Back Link */}
                <button
                    onClick={() => navigate(`/novel/${novelId}/chapter/${chapterId}`)}
                    className="mb-8 text-muted hover:text-primary transition-colors flex items-center gap-2 font-medium"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Chapter
                </button>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-white/5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                        Comments
                        <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-bold">
                            {comments.length}
                        </span>
                    </h3>

                    {/* Comments List */}
                    <div className="space-y-8 mb-10">
                        {loading ? (
                            <div className="text-center py-10">Loading comments...</div>
                        ) : (
                            <>
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
                            </>
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
                </div>
            </main>

            <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
        </div>
    );
};

export default ChapterCommentsPage;
