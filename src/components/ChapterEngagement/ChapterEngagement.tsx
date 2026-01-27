import React, { useState, useEffect } from 'react';
import { Comment } from '../../types';
import engagementService from '../../services/API/engagementService';
import styles from './ChapterEngagement.module.scss';

interface ChapterEngagementProps {
  novelId: string;
  chapterId: string;
  chapterTitle: string;
}

const ChapterEngagement: React.FC<ChapterEngagementProps> = ({ novelId, chapterId }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadEngagementData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [novelId, chapterId]);

  const loadEngagementData = async () => {
    try {
      const [liked, count, commentsList] = await Promise.all([
        engagementService.isChapterLiked(novelId, chapterId),
        engagementService.getChapterLikesCount(novelId, chapterId),
        engagementService.getChapterComments(novelId, chapterId)
      ]);

      setIsLiked(liked);
      setLikesCount(count);
      setComments(commentsList);
    } catch (error) {
      console.error('[ENGAGEMENT] Error loading data:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await engagementService.unlikeChapter(novelId, chapterId);
        setLikesCount(Math.max(0, likesCount - 1));
        setIsLiked(false);
        console.log('[ENGAGEMENT] Chapter unliked');
      } else {
        await engagementService.likeChapter(novelId, chapterId);
        setLikesCount(likesCount + 1);
        setIsLiked(true);
        console.log('[ENGAGEMENT] Chapter liked');
      }
    } catch (error) {
      console.error('[ENGAGEMENT] Error toggling like:', error);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await engagementService.postComment(novelId, chapterId, newComment);
      
      if (response && !response.error) {
        setComments([...comments, response]);
        setNewComment('');
        console.log('[ENGAGEMENT] Comment posted successfully');
      }
    } catch (error) {
      console.error('[ENGAGEMENT] Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await engagementService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      console.log('[ENGAGEMENT] Comment deleted');
    } catch (error) {
      console.error('[ENGAGEMENT] Error deleting comment:', error);
    }
  };

  return (
    <div className={styles.engagement}>
      {/* Like Section */}
      <div className={styles.likeSection}>
        <button
          type="button"
          className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <span className={styles.likeIcon}>♥</span>
          <span className={styles.likesCount}>{likesCount}</span>
        </button>
        <span className={styles.likeText}>{likesCount} people liked this</span>
      </div>

      {/* Comment Section */}
      <div className={styles.commentSection}>
        <button
          type="button"
          className={styles.toggleCommentBtn}
          onClick={() => setShowComments(!showComments)}
        >
          💬 Comments ({comments.length})
        </button>

        {showComments && (
          <div className={styles.commentBox}>
            {/* Post Comment */}
            <div className={styles.postCommentArea}>
              <textarea
                className={styles.commentInput}
                placeholder="Share your thoughts on this chapter..."
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                rows={3}
              />
              <button
                type="button"
                className={styles.postBtn}
                onClick={handlePostComment}
                disabled={!newComment.trim() || loading}
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>

            {/* Display Comments */}
            <div className={styles.commentsList}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <span className={styles.userName}>{comment.userName || 'Anonymous'}</span>
                      <span className={styles.timestamp}>
                        {new Date(comment.postedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={styles.commentText}>{comment.comment}</p>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterEngagement;
