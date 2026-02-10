import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NovelsCard.module.scss';

import { useLanguage } from '../../context/LanguageContext';

interface Novel {
  id: number | string; // Updated to allow string IDs
  title: string;
  titleEnglish?: string; // Added
  author: string;
  authorEnglish?: string; // Added
  image: string;
  novelUrl: string;
}

interface NovelsCardProps {
  sectionTitle: string;
  novels: Novel[];
}

const NovelsCard: React.FC<NovelsCardProps> = ({ sectionTitle, novels }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isEnglish } = useLanguage();

  const handleCardClick = (novelUrl: string) => {
    navigate(novelUrl);
  };

  return (
    <section className={styles.continueReadingSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.sliderWrapper} ref={sliderRef}>
          {novels.map((novel) => (
            <button
              key={novel.id}
              className={styles.novelCard}
              onClick={() => handleCardClick(novel.novelUrl)}
              aria-label={`Read ${isEnglish && novel.titleEnglish ? novel.titleEnglish : novel.title}`}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={novel.image}
                  alt={`Cover of ${isEnglish && novel.titleEnglish ? novel.titleEnglish : novel.title}`}
                  className={styles.novelImage}
                  width={98}
                  height={175}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('placeholder')) {
                        target.src = '/assets/images/placeholder.jpg';
                    }
                  }}
                />
                <div className={styles.overlay}></div>
                <div className={styles.novelInfo}>
                  <h3 className={styles.novelTitle}>
                    {isEnglish && novel.titleEnglish ? novel.titleEnglish : novel.title}
                  </h3>
                  <p className={styles.novelAuthor}>
                    {isEnglish && novel.authorEnglish ? novel.authorEnglish : novel.author}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NovelsCard;
