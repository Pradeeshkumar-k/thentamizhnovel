import React, { useState, useEffect } from 'react';
import '../../styles/homebanner.scss';

const HomeBanner: React.FC = () => {
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const fullTitle = 'WELCOME TO தேன்தமிழமுது NOVELS';
  const fullSubtitle = 'தேன்தமிழமுது தேடிப்படி அள்ளி அள்ளி பருக ஆசை பெருகுமே!!';

  useEffect(() => {
    let titleIndex = 0;
    let subtitleIndex = 0;

    const typeTitle = () => {
      if (titleIndex < fullTitle.length) {
        setTitleText(fullTitle.slice(0, titleIndex + 1));
        titleIndex++;
        setTimeout(typeTitle, 100);
      } else {
        // Start typing subtitle after title is complete
        setTimeout(() => {
          const typeSubtitle = () => {
            if (subtitleIndex < fullSubtitle.length) {
              setSubtitleText(fullSubtitle.slice(0, subtitleIndex + 1));
              subtitleIndex++;
              setTimeout(typeSubtitle, 80);
            }
          };
          typeSubtitle();
        }, 500);
      }
    };

    typeTitle();

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="home-banner">
      <div className="overlay" />

      {/* Trees touching connecting elements */}
      <div className="connecting-elements">
        <div className="connect-line left"></div>
        <div className="connect-line right"></div>
        <div className="floating-dots">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      </div>

      <div className="content">
        <h1 className="title">
          {titleText}
          <span className={`cursor ${showCursor ? 'visible' : ''}`}>|</span>
        </h1>

        <p className="subtitle">
          {subtitleText}
          {subtitleText.length === fullSubtitle.length && (
            <span className={`cursor ${showCursor ? 'visible' : ''}`}>|</span>
          )}
        </p>
      </div>
    </section>
  );
};

export default HomeBanner;
