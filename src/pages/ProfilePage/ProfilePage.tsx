import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Header from '../../components/layout/Header/Header';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { language } = useLanguage();

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 text-white">
                <Header />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <p>Please login to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Header />
            <div className="container mx-auto px-4 pt-36 pb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto bg-slate-800/50 rounded-2xl p-8 border border-white/10 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-neon-gold/20 flex items-center justify-center text-4xl border-2 border-neon-gold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                            <p className="text-gray-400">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-slate-700 rounded-full text-xs text-neon-gold border border-neon-gold/30">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                            <h2 className="text-xl font-bold mb-4 text-white hover:text-neon-gold transition-colors">
                                {language === 'tamil' ? 'கணக்கு விவரங்கள்' : 'Account Details'}
                            </h2>
                            <div className="space-y-4 text-gray-300">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span>Username</span>
                                    <span className="text-white">{user.username || user.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span>Email</span>
                                    <span className="text-white">{user.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span>Member Since</span>
                                    <span className="text-white">{new Date().toLocaleDateString()}</span> {/* Mock date for now */}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={logout}
                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl transition-all duration-300 font-bold"
                        >
                            {language === 'tamil' ? 'வெளியேறு' : 'Logout'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
