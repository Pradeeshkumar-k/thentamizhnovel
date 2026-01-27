import React from 'react';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom'; // Using Header navigation now
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import Header from '../../components/layout/Header/Header';

const AboutUsPage: React.FC = () => {
  const { language } = useLanguage();
  const _t = translations[language as keyof typeof translations];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-primary transition-colors duration-300">
      <Header />
      
      <main className="pt-36 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
         {/* Abstract Background Elements */}
         <div className="absolute top-20 right-10 w-96 h-96 bg-neon-gold/5 rounded-full blur-3xl -z-10"></div>
         <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
             initial="hidden"
             animate="visible"
             variants={containerVariants}
             className="space-y-12"
          >
             {/* Title */}
             <motion.div variants={itemVariants} className="text-center mb-12">
                 <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neon-gold">
                   {_t.about.title}
                 </h1>
                 <div className="h-1 w-24 bg-gradient-to-r from-transparent via-neon-gold to-transparent mx-auto"></div>
             </motion.div>

             {/* Sections */}
             <motion.section variants={itemVariants} className="bg-surface/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-neon-gold/20 transition-all shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-neon-gold rounded-full"></span>
                   {_t.about.backgroundTitle}
                </h2>
                <p className="text-secondary leading-relaxed text-lg">
                  {_t.about.backgroundText}
                </p>
             </motion.section>

             <motion.section variants={itemVariants} className="bg-surface/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-neon-gold/20 transition-all shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-neon-gold rounded-full"></span>
                   {_t.about.passionTitle}
                </h2>
                <p className="text-secondary leading-relaxed text-lg">
                  {_t.about.passionText}
                </p>
             </motion.section>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.section variants={itemVariants} className="bg-surface/30 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-neon-gold/20 transition-all shadow-sm">
                    <h2 className="text-xl font-bold mb-3 text-neon-gold">
                      {_t.about.visionTitle}
                    </h2>
                    <p className="text-secondary leading-relaxed">
                      {_t.about.visionText}
                    </p>
                </motion.section>

                <motion.section variants={itemVariants} className="bg-surface/30 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-neon-gold/20 transition-all shadow-sm">
                    <h2 className="text-xl font-bold mb-3 text-neon-gold">
                       {_t.about.missionTitle}
                    </h2>
                    <p className="text-secondary leading-relaxed">
                      {_t.about.missionText}
                    </p>
                </motion.section>
             </div>

             <motion.section variants={itemVariants} className="bg-surface/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-neon-gold/20 transition-all shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-neon-gold rounded-full"></span>
                   {_t.about.valuesTitle}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-bg-primary/50 p-4 rounded-xl border border-border">
                       <h3 className="font-bold text-neon-gold mb-2">{_t.about.quality}</h3>
                       <p className="text-secondary text-sm">{_t.about.qualityText}</p>
                    </div>
                    <div className="bg-bg-primary/50 p-4 rounded-xl border border-border">
                       <h3 className="font-bold text-neon-gold mb-2">{_t.about.integrity}</h3>
                       <p className="text-secondary text-sm">{_t.about.integrityText}</p>
                    </div>
                    <div className="bg-bg-primary/50 p-4 rounded-xl border border-border">
                       <h3 className="font-bold text-neon-gold mb-2">{_t.about.innovation}</h3>
                       <p className="text-secondary text-sm">{_t.about.innovationText}</p>
                    </div>
                    <div className="bg-bg-primary/50 p-4 rounded-xl border border-border">
                       <h3 className="font-bold text-neon-gold mb-2">{_t.about.respect}</h3>
                       <p className="text-secondary text-sm">{_t.about.respectText}</p>
                    </div>
                </div>
             </motion.section>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;