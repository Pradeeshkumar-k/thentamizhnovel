import React from 'react';
import Header from '../../components/layout/Header/Header';
import { useLanguage } from '../../context/LanguageContext';

const PrivacyPolicyPage = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-primary text-primary">
      <Header />
      <div className="container mx-auto px-4 pt-40 md:pt-36 pb-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-neon-gold mb-8 text-center">
          {language === 'tamil' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}
        </h1>

        <div className="bg-surface/50 p-6 md:p-8 rounded-2xl border border-border space-y-6 text-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and reading preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, including to personalized your reading experience, process transactions, and communicate with you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Sharing of Information</h2>
            <p>
              We do not share your personal information with third parties except as described in this policy, such as with vendors who perform services for us or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

           <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@thentamizhnovel.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
