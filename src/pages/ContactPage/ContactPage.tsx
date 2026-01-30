import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import Header from '../../components/layout/Header/Header';
import { SOCIAL_LINKS } from '../../utils/constants';
import YouTubeModal from '../../components/common/Modal/YouTubeModal';

// Icons
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const _t = translations[language as keyof typeof translations];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset after 5 seconds
    setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleYouTubeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowYouTubeModal(true);
  };

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
      
      <main className="pt-44 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h1 variants={itemVariants} className="text-2xl md:text-5xl font-bold mb-4 text-neon-gold">
              {_t.contact.title}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-base md:text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
              {_t.about.shareThoughtsText}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Info Section */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="bg-surface/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-neon-gold/30 transition-colors shadow-lg group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neon-gold/10 text-neon-gold rounded-lg group-hover:bg-neon-gold group-hover:text-black transition-colors">
                    <MailIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold mb-2">{language === 'tamil' ? 'மின்னஞ்சல்' : 'Email Us'}</h3>
                    <p className="text-secondary mb-1">Send us your feedback or queries anytime.</p>
                    <a href="mailto:thentamizhamuthunovels@gmail.com" className="text-neon-gold hover:underline font-medium text-lg break-all">thentamizhamuthunovels@gmail.com</a>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-surface/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-neon-gold/30 transition-colors shadow-lg group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neon-blue/10 text-neon-blue rounded-lg group-hover:bg-neon-blue group-hover:text-black transition-colors">
                    <LocationIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{language === 'tamil' ? 'சமூக வலைத்தளங்கள்' : 'Social Channels'}</h3>
                    <p className="text-secondary mb-4">Follow us for updates and new releases.</p>
                  <div className="flex justify-center md:justify-start gap-3 flex-nowrap">
                        {/* Facebook */}
                        <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-[#1877F2] hover:text-white text-gray-400 transition-all duration-300 group/icon">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        
                        {/* Instagram */}
                        <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-[#E4405F] hover:text-white text-gray-400 transition-all duration-300 group/icon">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468.99c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                        
                        {/* YouTube */}
                        <a href="#" onClick={handleYouTubeClick} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-[#FF0000] hover:text-white text-gray-400 transition-all duration-300 group/icon">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" />
                            </svg>
                        </a>

                        {/* WhatsApp */}
                        <a href="https://whatsapp.com/channel/0029VbB0Wxt65yDK3ZTYCC1D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-[#25D366] hover:text-white text-gray-400 transition-all duration-300 group/icon">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M18.403 5.633A8.919 8.919 0 0012.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 004.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 00-2.627-6.373zM12.053 19.644h-.004a7.468 7.468 0 01-3.811-1.044l-.273-.162-2.834.743.756-2.763-.178-.283a7.482 7.482 0 01-1.15-3.978c.002-4.12 3.356-7.474 7.48-7.474a7.447 7.447 0 015.304 2.193 7.447 7.447 0 012.193 5.304c-.002 4.12-3.356 7.474-7.484 7.474zm4.096-5.592c-.224-.112-1.325-.654-1.53-.728-.206-.075-.356-.112-.506.112-.15.224-.58.73-.711.878-.13.15-.262.168-.486.056-.224-.112-.947-.35-1.803-1.112-.667-.595-1.117-1.329-1.248-1.554-.131-.224-.014-.345.098-.456.1-.1.224-.261.336-.393.112-.13.15-.224.224-.374.075-.15.038-.28-.019-.393-.056-.112-.505-1.217-.692-1.666-.181-.435-.366-.374-.505-.38l-.431-.007c-.15 0-.393.056-.6.28-.206.224-.787.767-.787 1.871 0 1.104.805 2.17.917 2.32.112.15 1.584 2.417 3.837 3.39.536.231.954.369 1.279.473.536.171 1.023.146 1.41.108.43-.042 1.325-.542 1.512-1.065.187-.523.187-.971.131-1.065-.056-.094-.206-.15-.43-.262z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                  </div>
                </div>
              </motion.div>

               {/* Decorative Element */}
               <motion.div variants={itemVariants} className="relative h-64 rounded-2xl overflow-hidden hidden lg:block border border-white/10">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-bg-primary"></div>
                   <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                       <p className="text-2xl font-script text-neon-gold/80 italic">
                         "{language === 'tamil' ? '❤️தேன்தமிழமுது தேடித்தேடி படி அள்ளி அள்ளி பருக ஆசை பெருகுமே!❤️' : 'The desire grows to seek out sweet Tamil nectar to scoop it up by the handful, and drink it again and again'}"
                       </p>
                   </div>
               </motion.div>
            </motion.div>

            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-surface border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative"
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-neon-gold/20 rounded-full blur-xl"></div>
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-neon-gold rounded-full block"></span>
                {_t.contact.sendMessage}
              </h2>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-secondary ml-1">{_t.contact.name}</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-bg-primary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-secondary ml-1">{_t.contact.email}</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-bg-primary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-secondary ml-1">{language === 'tamil' ? 'தலைப்பு' : 'Subject'}</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-bg-primary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-secondary ml-1">{_t.contact.message}</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-bg-primary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all resize-none"
                      placeholder="Your message here..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-neon-gold text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-neon-gold/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                          <span>{_t.contact.send}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center p-8 h-[400px]"
                >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-green-500/50 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{_t.contact.success}</h3>
                    <p className="text-secondary max-w-sm">
                        {language === 'tamil' 
                            ? 'தங்கள் செய்தி வெற்றிகரமாக அனுப்பப்பட்டது. விரைவில் உங்களைத் தொடர்புகொள்வோம்.' 
                            : 'Thank you for contacting us! We have received your message and will get back to you shortly.'}
                    </p>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="mt-8 text-neon-gold hover:text-white font-medium transition-colors"
                    >
                        {language === 'tamil' ? 'மற்றொரு செய்தியை அனுப்ப' : 'Send another message'}
                    </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* YouTube Modal */}
      <YouTubeModal isOpen={showYouTubeModal} onClose={() => setShowYouTubeModal(false)} />
    </div>
  );
};

export default ContactPage;
