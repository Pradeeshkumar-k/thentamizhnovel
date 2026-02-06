import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import novelService from '../../services/API/novelService';
import { commentService } from '../../services/API/commentService';
import UserLogin from '../common/UserLogin/UserLogin';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  novelId: string;
  chapterId: string;
  onCommentAdded?: (comment: any) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ isOpen, onClose, novelId, chapterId, onCommentAdded }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchComments();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, novelId, chapterId]);

  const fetchComments = async () => {
    if (!novelId || !chapterId) return;
    try {
      setLoading(true);
      // Fix 1: Use dedicated comments API
      const res = await commentService.getComments(chapterId);
      if (res.success && res.data && res.data.success) {
        setComments(res.data.data || []);
      } else if (res.success && Array.isArray(res.data)) {
         setComments(res.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setIsLoginModalOpen(true); return; }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    setSubmittingComment(true);
    // Fix: Use novelService for cache invalidation
    const res = await novelService.addComment(novelId, chapterId, language, newComment);
    if (res && res.id) { // Assuming response is the comment object or has success?
        // novelService.addComment returns response.data directly. Usually it's the comment object.
        // Let's verify return type.
        // Step 1022: return response.data.
        // Usually API returns { id: ..., text: ... } or { success: true, data: ... }?
        // Backend usually returns the Created Object.
        // Let's assume it returns the comment.
      setComments([res, ...comments]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded(res);
    } else {
      alert('Failed to post comment');
    }
    setSubmittingComment(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-surface/50">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    Comments
                    <span className="bg-neon-gold/20 text-neon-gold text-xs px-2.5 py-1 rounded-full font-bold">
                      {comments.length}
                    </span>
                  </h3>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-muted"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Comments List (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface/30">
                  {loading ? (
                    <div className="text-center py-10">
                       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-gold mx-auto mb-2"></div>
                       <p className="text-muted">Loading comments...</p>
                    </div>
                  ) : (
                    <>
                      {comments.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center">
                          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 text-3xl">
                             💬
                          </div>
                          <p className="text-secondary font-medium">No comments yet</p>
                          <p className="text-muted text-sm mt-1">Be the first to share your thoughts!</p>
                        </div>
                      ) : (
                        comments.map((comment: any) => (
                          <div key={comment.id} className="flex gap-4 group">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-neon-gold to-yellow-600 flex items-center justify-center text-black font-bold text-lg shadow-md border-2 border-white dark:border-zinc-800">
                              {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">
                                  {comment.user?.name || 'User'}
                                </span>
                                <span className="text-xs text-muted font-medium whitespace-nowrap">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/5 shadow-sm group-hover:shadow-md transition-shadow">
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>

                {/* Footer (Input Form) */}
                <div className="p-4 sm:p-6 border-t border-border bg-surface/50">
                   <form onSubmit={handleCommentSubmit} className="relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={user ? "Write a comment..." : "Login to comment"}
                                disabled={!user}
                                className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-full py-3.5 pl-6 pr-14 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-gold/50 focus:border-neon-gold transition-all shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={!user || submittingComment || !newComment.trim()}
                                className="absolute right-2 top-1.5 bottom-1.5 w-10 h-10 bg-neon-gold hover:bg-yellow-400 rounded-full flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-95"
                            >
                                {submittingComment ? (
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Nested Login Modal */}
            <UserLogin isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommentsModal;
