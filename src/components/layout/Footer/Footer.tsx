import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { translations } from '../../../translations';
import { SOCIAL_LINKS } from '../../../utils/constants';
// Social icons are now loaded from /public/assets/icons/
import YouTubeModal from '../../common/Modal/YouTubeModal';
// import styles from './Footer.module.scss'; // Removed SCSS

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const _t = translations[language as keyof typeof translations];
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  const handleYouTubeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowYouTubeModal(true);
  };

  return (
    <footer className="w-full bg-[#010133] dark:bg-bg-primary border-t border-white/10 dark:border-border mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col items-center gap-4 md:gap-6">
        <div className="w-full flex flex-col items-center gap-4 md:gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/assets/logo.webp" alt="TTM Novels Logo" width={182} height={140} className="h-20 md:h-24 w-auto object-contain glow-sm" />
          </div>

          {/* Follow Us */}
          <div className="text-center">
            <h3 className="text-base md:text-lg font-medium text-gray-300 dark:text-muted mb-3 md:mb-4">{_t.footer.followUs}</h3>
            <div className="flex justify-center gap-4 md:gap-8">
              <a href="https://whatsapp.com/channel/0029VbB0Wxt65yDK3ZTYCC1D" target="_blank" rel="noopener noreferrer" 
                 aria-label="Join our WhatsApp channel"
                 className="text-gray-400 dark:text-muted hover:text-[#25D366] hover:scale-110 transition-all duration-300">
                <img src="/assets/icons/whatsapp-3d.png" alt="" className="w-10 h-10 md:w-14 md:h-14" />
              </a>

              <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" 
                 aria-label="Follow us on Facebook"
                 className="text-gray-400 dark:text-muted hover:text-[#1877F2] hover:scale-110 transition-all duration-300">
                <img src="/assets/icons/facebook-3d.png" alt="" className="w-10 h-10 md:w-14 md:h-14" />
              </a>

              <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" 
                 aria-label="Follow us on Instagram"
                 className="text-gray-400 dark:text-muted hover:text-[#E4405F] hover:scale-110 transition-all duration-300">
                <img src="/assets/icons/instagram-logo.png" alt="" className="w-10 h-10 md:w-14 md:h-14" />
              </a>

              <a href="#" onClick={handleYouTubeClick} 
                 aria-label="Watch our videos on YouTube"
                 className="text-gray-400 dark:text-muted hover:text-[#FF0000] hover:scale-110 transition-all duration-300">
                <img src="/assets/icons/youtube-logo.png" alt="" className="w-10 h-10 md:w-14 md:h-14" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full pt-4 md:pt-6 border-t border-white/10 dark:border-border flex flex-col items-center gap-2 md:gap-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-4 text-xs md:text-sm text-gray-400 dark:text-muted max-w-[90%] mx-auto">
              <Link to="/about" className="hover:text-white dark:hover:text-primary hover:underline transition-colors whitespace-nowrap">{_t.footer.aboutUs}</Link>
              <span className="text-white/20 dark:text-border hidden md:inline">|</span>
              <Link to="/contact" className="hover:text-white dark:hover:text-primary hover:underline transition-colors whitespace-nowrap">{_t.footer.contactUs}</Link>
              <span className="text-white/20 dark:text-border hidden md:inline">|</span>
              <Link to="/terms" className="hover:text-white dark:hover:text-primary hover:underline transition-colors whitespace-nowrap">{_t.footer.terms}</Link>
              <span className="text-white/20 dark:text-border hidden md:inline">|</span>
              <Link to="/privacy-policy" className="hover:text-white dark:hover:text-primary hover:underline transition-colors whitespace-nowrap">{language === 'tamil' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}</Link>
          </div>
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-muted/60">
              {_t.footer.rights}
          </p>
        </div>
      </div>

      {/* YouTube Modal */}
      <YouTubeModal isOpen={showYouTubeModal} onClose={() => setShowYouTubeModal(false)} />
    </footer>
  );
};

export default Footer;
