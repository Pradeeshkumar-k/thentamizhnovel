import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TotalChaptersSection.module.scss';

interface Chapter {
  id: number;
  chapterNumber: number;
  title: string;
  date: string;
  readTime: string;
  views: string;
  image: string;
  chapterUrl: string;
}

interface TotalChaptersSectionProps {
  totalChapters: number;
  chapters: Chapter[];
}

const TotalChaptersSection: React.FC<TotalChaptersSectionProps> = ({
  totalChapters,
  chapters,
}) => {
  const navigate = useNavigate();

  const handleChapterClick = (chapterUrl: string) => {
    navigate(chapterUrl);
  };

  return (
    <section className={styles.totalChaptersSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>அத்தியாயங்கள்</h2>
        <span className={styles.totalCount}>{totalChapters} அத்தியாயங்கள்</span>
      </div>

      <div className={styles.chaptersGrid}>
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={styles.chapterCard}
            onClick={() => handleChapterClick(chapter.chapterUrl)}
          >
            <div className={styles.chapterImageWrapper}>
              <img
                src={chapter.image}
                alt={chapter.title}
                className={styles.chapterImage}
              />
              <div className={styles.chapterNumber}>{chapter.chapterNumber}</div>
            </div>

            <div className={styles.chapterInfo}>
              <h3 className={styles.chapterTitle}>{chapter.title}</h3>
              <div className={styles.chapterMeta}>
                <span className={styles.metaItem}>{chapter.date}</span>
                <span className={styles.metaSeparator}>•</span>
                <span className={styles.metaItem}>{chapter.readTime}</span>
                <span className={styles.metaSeparator}>•</span>
                <span className={styles.metaItem}>{chapter.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TotalChaptersSection;
