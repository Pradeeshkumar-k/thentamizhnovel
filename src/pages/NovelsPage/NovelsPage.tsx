import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Carousel from '../../components/common/Carousel/Carousel';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import styles from './NovelsPage.module.scss';
import NovelsCard from '../../components/NovelsCard/NovelsCard';



const NovelsPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [season, setSeason] = useState('winter');

  // Set seasonal background
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setSeason('spring');
    else if (month >= 6 && month <= 8) setSeason('summer');
    else if (month >= 9 && month <= 11) setSeason('fall');
    else setSeason('winter');
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  // Fetch Novels from API
  const [ongoingNovels, setOngoingNovels] = useState<any[]>([]);
  const [completedNovels, setCompletedNovels] = useState<any[]>([]);
  const [latestNovels, setLatestNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Import service
  // Note: Added import manually or assume it's available via previous context if replace_file_content allows.
  // Actually I should add the import line at the top. 
  // But wait, I can do it here if I replace the top too.
  // Ideally, I'll fetch in useEffect.
  
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        // Using imported service (will add import in next step or assume)
        // Dynamically import to avoid top-level issues if I can't edit top
        const { default: novelService } = await import('../../services/API/novelService');
        
        // Fetch all novels (limit 100 to get a good set)
        const response = await novelService.getAllNovels({ limit: 100 });
        const allNovels = response.novels || [];

        // Map backend format to component format
        const formattedNovels = allNovels.map((n: any) => ({
          id: n.id,
          title: n.title,
          author: n.author,
          image: n.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=500&fit=crop', // Fallback
          novelUrl: `/novel/${n.id}`, 
          status: n.status
        }));

        setLatestNovels(formattedNovels.slice(0, 10));
        setOngoingNovels(formattedNovels.filter((n: any) => n.status !== 'COMPLETED'));
        setCompletedNovels(formattedNovels.filter((n: any) => n.status === 'COMPLETED'));
        
      } catch (error) {
        console.error("Failed to fetch novels", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  // Continue Reading Novels Data (Mock for now, kept as requested)
  // In a real app, this would be fetched from user history
  const continueReadingNovels = [
    {
      id: 1,
      title: 'தாள்பாட்டும் தேவதை',
      author: 'தென்மொழி',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=500&fit=crop',
      novelUrl: '/novel/thaalpaattum-devadhai',
    },
    {
      id: 2,
      title: 'ராட்சசனே',
      author: 'ஸ்வேதா',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=500&fit=crop',
      novelUrl: '/novel/raatchasane',
    }
  ];

  return (
    <div className={`${styles.novelsContainer} ${styles[season]}`}>
      <Header onLoginClick={handleLoginClick} />
      <Carousel />
      <NovelsCard sectionTitle="Continue Reading" novels={continueReadingNovels} />
      <NovelsCard sectionTitle="Latest Launch" novels={latestNovels} />
      <NovelsCard sectionTitle="Ongoing Novels" novels={ongoingNovels} />
      <NovelsCard sectionTitle="Completed Novels" novels={completedNovels} />

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelsPage;
