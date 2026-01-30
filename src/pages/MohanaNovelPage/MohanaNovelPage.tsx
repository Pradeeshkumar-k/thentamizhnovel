import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import { getNovelConfig } from '../../config/novelConfig';
import styles from './MohanaNovelPage.module.scss';

// Import images
import mohanaCard from '../../assets/images/Novel Card/Mohana card.jpg';
import mohanaChapterImage from '../../assets/images/episodes_card/Mohanamozhi episodes.jpg';

const MohanaNovelPage = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  // Get novel config and generate chapters dynamically
  const novelConfig = getNovelConfig(3);
  const totalChapters = novelConfig?.totalChapters || 27;

  // Generate chapters array dynamically from config
  const chapters = Array.from({ length: totalChapters }, (_, i) => ({
    id: i + 1,
    title: `பாகம் ${i + 1}`,
    date: new Date(2025, 0, 5 + i).toLocaleDateString('en-GB'),
    words: 1500
  }));

  const novel = {
    id: 3,
    title: 'வந்தத்துணையே! என் வாழ்க்கைத் துணையே!',
    author: 'Mohanaamozhi',
    genres: ['Love', 'Romantic'],
    image: mohanaCard,
    stats: {
      views: '25.6K',
      bookmarks: '1.9K',
      chapters: totalChapters
    },
    description: {
      tamil: 'சிறுவயதில் வீட்டை விட்டு வெளியேறிய நாயகன், எட்டு வருடங்கள் கடந்து யாரும் எதிர்பார்க்காத வகையில், கையில் குழந்தையுடன் வீட்டிற்கு வருகிறான். சிறுவயது முதல் தாய், தந்தை, தங்கை, தம்பி என்று அவர்களையே தன் உலகம் என்று வாழ்ந்த நாயகிக்குத் துரோகம் இழைத்தது மட்டுமில்லாமல், அவளை "அவர்கள் வீட்டுப் பெண்ணே இல்லை" என்று கூறியதால், வீட்டை விட்டு வெளியேறி, யாரும் இல்லாமல் நிர்கதியாக நிற்கிறாள் நாயகி. இவர்கள் இருவரும் திருமண பந்தத்தில் ஒன்று சேர்ந்தால், அவர்களின் வாழ்க்கை எவ்வாறு இருக்கும்? தெரிந்துகொள்ளக் காத்திருங்கள்... "தாலாட்டும் தாழம்பூவே!"',
      english: ''
    },
    chapters: chapters
  };

  const handleChapterClick = (chapterId: number) => {
    console.log('[MOHANA_PAGE] Chapter clicked:', chapterId);
    navigate(`/novel/3/chapter/${chapterId}`);
  };

  const handleContinueReading = () => {
    console.log('[MOHANA_PAGE] Continue reading clicked');
    navigate(`/novel/3/chapter/1`);
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
            <h1 className={styles.novelTitle}>{novel.title}</h1>

            {/* Author */}
            <div className={styles.authorSection}>
              <span className={styles.author}>{novel.author}</span>
            </div>

            {/* Genres */}
            <div className={styles.genres}>
              {novel.genres.map((genre, index) => (
                <span key={index} className={styles.genreTag}>{genre}</span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.readButton} onClick={handleContinueReading}>
                Start Reading
              </button>
            </div>
          </div>
        </div>

        {/* Story Summary Section */}
        <div className={styles.storySection}>
          <h2 className={styles.sectionTitle}>{language === 'tamil' ? 'கதை சுருக்கம்' : 'Story Summary'}</h2>
          <div className={styles.storyContent}>
            <p className={styles.tamilDescription}>{novel.description.tamil}</p>
            <p className={styles.englishDescription}>{novel.description.english}</p>
          </div>
        </div>

        {/* Chapters Section */}
        <div className={styles.chaptersSection}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="border-l-[6px] border-neon-gold pl-4 flex items-center gap-2">
              {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'}
              <span className="text-gray-900 dark:text-white font-bold ml-1">
                [{novel.chapters.length}]
              </span>
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
                    src={mohanaChapterImage}
                    alt={chapter.title}
                    className={styles.chapterImage}
                  />
                </div>
                <h3 className={styles.chapterTitle}>{chapter.title}</h3>
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

export default MohanaNovelPage;
