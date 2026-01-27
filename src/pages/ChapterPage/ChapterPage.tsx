import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/layout/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import { translations } from '../../translations';
import { getChapterContent } from '../../utils/chapterContentLoader';
import { getNovelConfig, isValidChapter } from '../../config/novelConfig';
import styles from './ChapterPage.module.scss';

interface ChapterData {
  title?: string;
  content?: string;
  subtitle?: string;
}

const ChapterPage = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language: userLanguage } = useLanguage();
  const { updateProgress, completeNovel } = useReadingProgress();
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayChapterId, setDisplayChapterId] = useState(Number(chapterId));

  // Ensure numeric conversion for proper lookups
  const numNovelId = Number(novelId);
  const numChapterId = Number(chapterId);

  const t = translations[userLanguage as keyof typeof translations];
  const novelMeta = getNovelConfig(numNovelId);

  const handleLoginClick = () => {
    // Handle login if needed
  };

  const handleBack = useCallback(() => {
    navigate(`/novel/${novelId}`);
  }, [novelId, navigate]);

  const handlePreviousChapter = useCallback(() => {
    const prevChapter = Number(chapterId) - 1;
    if (isValidChapter(numNovelId, prevChapter)) {
      navigate(`/novel/${novelId}/chapter/${prevChapter}`);
    }
  }, [chapterId, novelId, navigate]);

  const handleNextChapter = useCallback(() => {
    const nextChapter = Number(chapterId) + 1;
    if (isValidChapter(numNovelId, nextChapter)) {
      navigate(`/novel/${novelId}/chapter/${nextChapter}`);
    }
  }, [chapterId, novelId, navigate]);

  // Update displayChapterId when route params change
  useEffect(() => {
    setDisplayChapterId(Number(chapterId));
  }, [chapterId]);

  // Load chapter content dynamically with proper language fallback
  useEffect(() => {
    const loadChapter = async () => {
      try {
        setLoading(true);
        const data = await getChapterContent(Number(novelId), Number(chapterId), userLanguage);
        setChapterData(data);
      } catch (error) {
        setChapterData(null);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [novelId, chapterId, userLanguage]);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterId]);

  // Update reading progress when chapter changes
  useEffect(() => {
    if (numNovelId && numChapterId) {
      updateProgress(novelId!, numChapterId);

      // Check if this is the last chapter based on novel metadata
      const metadata = getNovelConfig(numNovelId);
      const maxChapters = metadata?.totalChapters || 0;
      if (numChapterId === maxChapters && metadata) {
        // Mark as complete when reaching the last chapter
        completeNovel(novelId!, metadata.title, getNovelCoverImage(numNovelId), getNovelAuthor(numNovelId));
      }
    }
  }, [numNovelId, numChapterId, updateProgress, completeNovel]);

  // Helper function to get novel cover image
  const getNovelCoverImage = (id: number) => {
    const coverImages: Record<number, string> = {
      1: 'Novel Card/Thenmozhi Card.jpg',
      2: 'Novel Card/swetha card.jpg',
      3: 'Novel Card/Mohana card.jpg'
    };
    return coverImages[id] || '';
  };

  // Helper function to get novel author
  const getNovelAuthor = (id: number) => {
    const authors: Record<number, string> = {
      1: 'தென்மொழி',
      2: 'ஸ்வேதா ஸ்வே',
      3: 'மோகனா'
    };
    return authors[id] || '';
  };

  // Handle loading and not found states
  if (loading) {
    return (
      <div className={styles.chapterContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.content}>
          <div className={styles.chapterContent}>
            <h1 className={styles.chapterTitle}>{t.chapter.loading}</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className={styles.chapterContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.content}>
          <button className={styles.backButton} onClick={handleBack}>
            {t.chapter.back}
          </button>
          <div className={styles.chapterContent}>
            <h1 className={styles.chapterTitle}>{t.chapter.notFound}</h1>
            <p className={styles.placeholder}>{t.chapter.comingSoon}</p>
          </div>
        </div>
      </div>
    );
  }

  // Get max chapters - ensure it's always available
  const currentChapterId = Number(chapterId);
  const maxChapters = getNovelConfig(Number(novelId))?.totalChapters || 0;
  const showPrevButton = currentChapterId > 1;
  const showNextButton = currentChapterId < maxChapters;
  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph: string, index: number) => (
      <p key={index} className={styles.paragraph}>
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={styles.chapterContainer}>
      <Header onLoginClick={handleLoginClick} />

      <div className={styles.content}>
        <button className={styles.backButton} onClick={handleBack}>
          {t.chapter.back}
        </button>

        <div className={styles.chapterContent}>
          {/* Novel Title Heading */}
          {novelMeta && (
            <h1 className={styles.novelTitle}>{novelMeta.title}</h1>
          )}
          
          {/* Chapter Header */}
          {chapterData.title && (
            <h2 className={styles.chapterHeading}>{chapterData.title}</h2>
          )}

          <div className={styles.storyContent}>
            {formatContent(chapterData.content || '')}
          </div>

          {/* Chapter Navigation */}
          <div className={styles.chapterNavigation}>
            {showPrevButton ? (
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePreviousChapter}
              >
                {t.chapter.previous}
              </button>
            ) : (
              <div></div>
            )}

            {showNextButton ? (
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNextChapter}
              >
                {t.chapter.next}
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
