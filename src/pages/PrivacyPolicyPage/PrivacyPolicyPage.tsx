import React from 'react';
import Header from '../../components/layout/Header/Header';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';

const PrivacyPolicyPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations].terms;

  return (
    <div className="min-h-screen bg-bg-primary text-primary">
      <Header />
      <div className="container mx-auto px-4 pt-40 md:pt-36 pb-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-neon-gold mb-4 text-center">
          {t.privacyTitle}
        </h1>
        
        <p className="text-secondary text-lg leading-relaxed italic text-center mb-8 max-w-2xl mx-auto">
          {t.privacySubtitle}
        </p>

        <div className="bg-surface/50 p-6 md:p-8 rounded-2xl border border-border space-y-6 text-secondary leading-relaxed">
          {t.privacySections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-bold text-primary mb-3">
                {index + 1}. {section.title}
              </h2>
              <p>
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
