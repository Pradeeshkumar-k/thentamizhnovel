import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OngoingNovel, CompletedNovel } from '../../types';
import readingProgressService from '../../services/API/readingProgressService';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import styles from './ReadingDashboard.module.scss';
import { getLocalizedTitle } from '../../utils/languageUtils';

interface Stats {
  totalNovels: number;
  startedNovels: number;
  completedNovels: number;
}

interface NovelProgress extends OngoingNovel {
  isCompleted?: boolean;
  completedAt?: string;
  lastChapterOrder?: number; // Add for strict typing locally
  lastChapterId?: string;
  totalChapters?: number;
}

const ReadingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isEnglish } = useLanguage();
  const { ongoingNovels: contextOngoing } = useReadingProgress();
  const [ongoingNovels, setOngoingNovels] = useState<NovelProgress[]>([]);
  const [completedNovels, setCompletedNovels] = useState<NovelProgress[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalNovels: 0,
    startedNovels: 0,
    completedNovels: 0
  });
  const progressRefs = useRef(new Map<string, HTMLDivElement>());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReadingProgress();
  }, []);

  useEffect(() => {
    ongoingNovels.forEach((novel) => {
      const el = progressRefs.current.get(novel.novelId);
      if (el) {
        el.style.width = `${calculateProgress(novel.lastChapterOrder || novel.lastChapter)}`;
      }
    });
  }, [ongoingNovels]);

  const fetchReadingProgress = async () => {
    try {
      setLoading(true);
      const progress = await readingProgressService.getReadingProgress();
      
      if (progress && progress.ongoing) {
        setOngoingNovels(progress.ongoing);
        setCompletedNovels(progress.completed || []);
        setStats({
          totalNovels: (progress.ongoing.length || 0) + (progress.completed?.length || 0),
          startedNovels: progress.ongoing.length || 0,
          completedNovels: progress.completed?.length || 0
        });
      }
    } catch (_error) {
      // Silent fail - show empty dashboard
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (lastChapter: number, totalChapters: number = 27): number => {
    return Math.round((lastChapter / totalChapters) * 100);
  };

  const handleContinueReading = (novel: NovelProgress) => {
    navigate(`/novel/${novel.novelId}`);
  };

  const handleViewNovel = (novelId: string) => {
    navigate(`/novel/${novelId}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading your reading progress...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.totalNovels}</div>
          <div className={styles.statLabel}>Total Novels</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.startedNovels}</div>
          <div className={styles.statLabel}>Started</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.completedNovels}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      {/* On-Going Novels */}
      {ongoingNovels.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📖 ON-GOING</h2>
          <div className={styles.novelsGrid}>
            {ongoingNovels.map((novel) => {
              const currentChapter = novel.lastChapterOrder || novel.lastChapter;
              const totalChapters = novel.totalChapters || 27;
              const progress = calculateProgress(currentChapter, totalChapters);
              return (
                <div key={novel.novelId} className={styles.novelCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={novel.coverImage}
                      alt={novel.novelTitle}
                      className={styles.novelImage}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/images/placeholder.jpg';
                      }}
                    />
                    <div className={styles.overlay}>
                      <button
                        type="button"
                        className={styles.continueBtn}
                        onClick={() => handleContinueReading(novel)}
                      >
                        Continue Reading
                      </button>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.novelTitle}>
                      {getLocalizedTitle(novel, isEnglish ? 'english' : 'tamil')}
                    </h3>
                    <p className={styles.author}>{novel.author}</p>

                    {/* Progress Bar */}
                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          ref={(el) => {
                            if (el) progressRefs.current.set(novel.novelId, el);
                            else progressRefs.current.delete(novel.novelId);
                          }}
                        ></div>
                      </div>
                      <span className="progressText">
                        Chapter {currentChapter} / {totalChapters} ({progress}%)
                      </span>
                    </div>

                    {/* Start Date */}
                    {novel.startedAt && (
                      <p className={styles.date}>
                        Started: {new Date(novel.startedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Novels */}
      {completedNovels.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>✅ COMPLETED</h2>
          <div className={styles.novelsGrid}>
            {completedNovels.map((novel) => (
              <div key={novel.novelId} className={styles.novelCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={novel.coverImage}
                    alt={novel.novelTitle}
                    className={styles.novelImage}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/images/placeholder.jpg';
                    }}
                  />
                  <div className={styles.overlay}>
                    <button
                      type="button"
                      className={styles.rereadBtn}
                      onClick={() => handleViewNovel(novel.novelId)}
                    >
                      Re-read
                    </button>
                  </div>
                  <div className={styles.completedBadge}>✓ COMPLETED</div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.novelTitle}>
                    {getLocalizedTitle(novel, isEnglish ? 'english' : 'tamil')}
                  </h3>
                  <p className={styles.author}>{novel.author}</p>

                  {/* Completion Dates */}
                  <div className={styles.completionDates}>
                    {novel.startedAt && (
                      <p className={styles.date}>
                        Started: {new Date(novel.startedAt).toLocaleDateString()}
                      </p>
                    )}
                    {novel.completedAt && (
                      <p className={styles.date}>
                        Completed: {new Date(novel.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Total Chapters */}
                  <p className={styles.stats}>📖 {novel.lastChapter} Chapters Read</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {ongoingNovels.length === 0 && completedNovels.length === 0 && (
        <div className={styles.emptyState}>
          <p>📚 Start reading novels to track your progress!</p>
          <button
            type="button"
            className={styles.browseBtn}
            onClick={() => navigate('/novels')}
          >
            Browse Novels
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingDashboard;
