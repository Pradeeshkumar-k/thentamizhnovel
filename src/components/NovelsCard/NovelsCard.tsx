import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NovelsCard.module.scss';

interface Novel {
  id: number;
  title: string;
  author: string;
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
            <div
              key={novel.id}
              className={styles.novelCard}
              onClick={() => handleCardClick(novel.novelUrl)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={novel.image}
                  alt={novel.title}
                  className={styles.novelImage}
                />
                <div className={styles.overlay}></div>
                <div className={styles.novelInfo}>
                  <h3 className={styles.novelTitle}>{novel.title}</h3>
                  <p className={styles.novelAuthor}>{novel.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NovelsCard;
