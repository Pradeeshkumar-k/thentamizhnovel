import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import Header from '../../components/layout/Header/Header';

const TermsPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations].terms;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-primary">
      <Header />
      
      <main className="pt-36 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            {/* Terms and Conditions Section */}
            <section>
              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-neon-gold mb-4 border-l-4 border-neon-gold pl-6">
                  {t.title}
                </h1>
                <p className="text-secondary text-lg leading-relaxed italic">
                  {t.subtitle}
                </p>
              </motion.div>

              <div className="space-y-8">
                {t.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-surface/30 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 hover:border-neon-gold/30 transition-all duration-300"
                  >
                    <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-neon-gold/10 flex items-center justify-center text-neon-gold text-sm">
                        {index + 1}
                      </span>
                      {section.title}
                    </h2>
                    <p className="text-secondary leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Privacy Policy Section */}
            <section className="pt-12 border-t border-border">
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-3xl font-bold text-neon-gold mb-4 border-l-4 border-neon-gold pl-6">
                  {t.privacyTitle}
                </h2>
                <p className="text-secondary text-lg leading-relaxed italic">
                  {t.privacySubtitle}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {t.privacySections.map((section, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-surface/30 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-neon-gold/30 transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-primary mb-3">
                      {section.title}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="text-center pt-8"
            >
              <div className="inline-block px-6 py-3 bg-neon-gold/5 border border-neon-gold/20 rounded-full">
                <p className="text-neon-gold font-medium">
                  {t.contact}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
