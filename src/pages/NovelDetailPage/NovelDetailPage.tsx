import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header/Header';
import TotalChaptersSection from '../../components/TotalChaptersSection/TotalChaptersSection';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import styles from './NovelDetailPage.module.scss';

const NovelDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleStartReading = () => {
    navigate(`/novel/${id}/chapter/1`);
  };

  const handleLike = () => {
    console.log('Liked');
  };

  const handleBookmark = () => {
    console.log('Bookmarked');
  };

  // Sample data - replace with actual API data
  const novelData = {
    title: 'தாள்பாட்டும் தேவதை',
    author: 'எழுதியவர் தென்மொழி',
    status: 'ONGOING',
    chapters: '45 அத்தியாயங்கள்',
    views: '12,500 பார்வைகள்',
    genre: 'Romance, Drama',
    description: 'காதல், சோதனை, மற்றும் வெற்றியின் ஒரு அற்புதமான கதை',
    coverImage: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=800&fit=crop',
  };

  // Sample chapters data - 45 chapters
  const chaptersData = Array.from({ length: 45 }, (_, index) => ({
    id: index + 1,
    chapterNumber: index + 1,
    title: `அத்தியாயம் ${index + 1}`,
    date: `${index + 1} ஜூன், 2024`,
    readTime: `${10 + (index % 5)} min read`,
    views: `${1000 + index * 100} பார்வைகள்`,
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=200&h=280&fit=crop',
    chapterUrl: `/novel/${id}/chapter/${index + 1}`,
  }));

  return (
    <div className={styles.novelDetailContainer}>
      <Header onLoginClick={handleLoginClick} />

      {/* Novel Banner Section */}
      <section className={styles.novelBanner}>
        <div className={styles.bannerContent}>
          {/* Left Side - Novel Cover Image */}
          <div className={styles.coverImageWrapper}>
            <img
              src={novelData.coverImage}
              alt={novelData.title}
              className={styles.coverImage}
            />
          </div>

          {/* Right Side - Novel Information */}
          <div className={styles.novelInfo}>
            {/* Novel Title */}
            <h1 className={styles.novelTitle}>{novelData.title}</h1>

            {/* Author Name */}
            <p className={styles.authorName}>{novelData.author}</p>

            {/* Status and Stats */}
            <div className={styles.statsRow}>
              <span className={styles.statusBadge}>{novelData.status}</span>
              <span className={styles.statItem}>{novelData.chapters}</span>
              <span className={styles.statItem}>{novelData.views}</span>
              <span className={styles.statItem}>{novelData.genre}</span>
            </div>

            {/* Description */}
            <p className={styles.description}>{novelData.description}</p>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.startReadingBtn} onClick={handleStartReading}>
                <span className={styles.playIcon}>▶</span>
                Read Now
              </button>
              <button className={styles.likeBtn} onClick={handleLike}>
                <span className={styles.icon}>👍</span>
              </button>
              <button className={styles.bookmarkBtn} onClick={handleBookmark}>
                <span className={styles.icon}>+</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Total Chapters Section */}
      <TotalChaptersSection
        totalChapters={45}
        chapters={chaptersData}
      />

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelDetailPage;
