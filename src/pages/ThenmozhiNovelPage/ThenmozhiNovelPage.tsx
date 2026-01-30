import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import { getNovelConfig } from '../../config/novelConfig';
import styles from './ThenmozhiNovelPage.module.scss';

// Import images
import thenmozhiCard from '../../assets/images/Novel Card/Thenmozhi Card.jpg';
import thenmozhiChapterImage from '../../assets/images/episodes_card/Thenmozhi_episodes.jpg';

const ThenmozhiNovelPage = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { startReading } = useReadingProgress();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  // Get novel config and generate chapters dynamically
  const novelConfig = getNovelConfig(1);
  const totalChapters = novelConfig?.totalChapters || 14;

  // Chapters for Thenmozhi novel - generated from config
  const chapters = Array.from({ length: totalChapters }, (_, i) => ({
    id: i + 1,
    title: `வதைப்பதேன்-${i + 1}`,
    titleEnglish: `Chapter ${i + 1}`,
    date: new Date(2025, 0, 5 + i).toLocaleDateString('en-GB'),
    words: 1500
  }));

  const novel = {
    id: 1,
    title: 'ராட்சசனே எனை வதைப்பதேனடா!',
    titleEnglish: 'Why Do You Torment Me, Demon!',
    author: 'தென்மொழி',
    authorEnglish: 'Thenmozhi',
    genres: [
      { tamil: 'காதல்', english: 'Love' },
      { tamil: 'ரொமாண்டிக்', english: 'Romantic' }
    ],
    image: thenmozhiCard,
    stats: {
      views: '0',
      bookmarks: '0',
      chapters: chapters.length
    },
    description: {
      tamil: `காதலனால் ஏமாற்றபடும் நாயகி, தம்பியின் மரணத்திற்கு நாயகியே காரணம் என்று அவளை பழிவாங்க துடிக்கும் நாயகன்.

பழிவாங்கும்படலம் ஒரு கட்டத்தில் காதலாய் மலர்கிறது. நாயகி மீது தவறில்லை என்ற உண்மை அறியும் போது நாயகன் நிலை என்னவோ? வெறுப்பு மட்டுமே உமிழ்ந்த நாயகனை காதலுடன் ஏற்பாளா நாயகி?.
மரணத்துக்கு முன் நாயகன் கூறிய ஒரு வார்த்தை நாயகியின் வாழ்க்கையை மாற்றி வைக்குமா? காதல், வெறுப்பு, பழிவாங்கல் என மாறி மாறி வரும் உணர்வுகளால் நாயகியின் மனம் குழப்பமடையும் கதை இது`,
      english: `A heroine betrayed by her lover, and a hero seeking revenge, believing she is responsible for his brother's death.

The revenge saga blossoms into love at one point. What will be the hero's state when he learns the truth that the heroine is not at fault? Will the heroine accept the hero who only spewed hatred, with love?
Will a word spoken by the hero before death change the heroine's life? This is a story where the heroine's mind is confused by the ever-changing emotions of love, hatred, and revenge.`
    },
    chapters: chapters
  };

  const handleChapterClick = (chapterId: number) => {
    console.log('[THENMOZHI_PAGE] Chapter clicked:', chapterId);
    startReading('1', novel.title, 'Novel Card/Thenmozhi Card.jpg', language === 'tamil' ? novel.author : novel.authorEnglish);
    navigate(`/novel/1/chapter/${chapterId}`);
  };

  const handleContinueReading = () => {
    console.log('[THENMOZHI_PAGE] Continue reading clicked');
    startReading('1', novel.title, 'Novel Card/Thenmozhi Card.jpg', language === 'tamil' ? novel.author : novel.authorEnglish);
    navigate(`/novel/1/chapter/1`);
  };

  return (
    <div className={styles.novelDetailContainer}>
      <Header onLoginClick={handleLoginClick} />

      <div className={styles.content}>
        {/* Novel Header Section */}
        <div className={styles.novelHeader}>
          <div className={styles.imageSection}>
            <img src={novel.image} alt={novel.title} className={styles.novelImage} />
          </div>

          <div className={styles.infoSection}>
            {/* Title */}
            <h1 className={styles.novelTitle}>
              {language === 'tamil' ? novel.title : novel.titleEnglish}
            </h1>

            {/* Author */}
            <div className={styles.authorSection}>
              <span className={styles.author}>
                {language === 'tamil' ? novel.author : novel.authorEnglish}
              </span>
            </div>

            {/* Genres */}
            <div className={styles.genres}>
              {novel.genres.map((genre, index) => (
                <span key={index} className={styles.genreTag}>
                  {language === 'tamil' ? genre.tamil : genre.english}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.readButton} onClick={handleContinueReading}>
                {language === 'tamil' ? 'வாசிக்க தொடங்கு' : 'Start Reading'}
              </button>
            </div>
          </div>
        </div>

        {/* Story Summary Section */}
        <div className={styles.storySection}>
          <h2 className={styles.sectionTitle}>{language === 'tamil' ? 'கதை சுருக்கம்' : 'Story Summary'}</h2>
          <div className={styles.storyContent}>
            <p className={language === 'tamil' ? styles.tamilDescription : styles.englishDescription}>
              {language === 'tamil' ? novel.description.tamil : novel.description.english}
            </p>
          </div>
        </div>

        <div className={styles.chaptersSection}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="border-l-[6px] border-neon-gold pl-4 flex items-center gap-2">
              {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'} [{novel.chapters.length}]
            </span>
          </h2>
          <div className={styles.chaptersList}>
            {novel.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={styles.chapterCard}
                onClick={() => handleChapterClick(chapter.id)}
              >
                <div className={styles.chapterImageWrapper}>
                  <img
                    src={thenmozhiChapterImage}
                    alt={language === 'tamil' ? chapter.title : chapter.titleEnglish}
                    className={styles.chapterImage}
                  />
                </div>
                <h3 className={styles.chapterTitle}>
                  {language === 'tamil' ? chapter.title : chapter.titleEnglish}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default ThenmozhiNovelPage;
