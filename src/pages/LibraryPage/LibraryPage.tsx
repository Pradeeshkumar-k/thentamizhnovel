import React, { useEffect, useState } from 'react'; // Added useState for local loading handling if needed, though context handles main data
import Header from '../../components/layout/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext'; // Import context
import novelService from '../../services/API/novelService';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LibraryPage = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const { bookmarks, refreshLibrary, isLoading } = useReadingProgress(); // Use context loading state
    
    // No local isLoading state needed anymore because context handles it perfectly
    
    const t = {
        title: language === 'tamil' ? 'எனது நூலகம்' : 'My Library',
        empty: language === 'tamil' ? 'உங்கள் நூலகம் காலியாக உள்ளது' : 'Your library is empty',
        browse: language === 'tamil' ? 'நாவல்களைத் தேடுங்கள்' : 'Browse Novels',
        chapters: language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters',
        author: language === 'tamil' ? 'ஆசிரியர்' : 'Author',
        continue: language === 'tamil' ? 'தொடரவும்' : 'Continue Reading'
    };

    const getString = (val: string | { [key: string]: string } | undefined) => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        return val[language] || val['english'] || '';
    };

    // Handle initial fetch if context is empty but user is logged in is handled in Context Provider now.
    // We can trigger a background refresh if needed, but context does it on mount.

    const handleRemoveBookmark = async (e: React.MouseEvent, novelId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(language === 'tamil' ? 'இந்த நாவலை உங்கள் நூலகத்திலிருந்து நீக்க விரும்புகிறீர்களா?' : 'Do you want to remove this novel from your library?')) return;
        
        try {
            await novelService.removeBookmark(novelId);
            refreshLibrary(); // Refresh context
        } catch (err) {
            console.error('Failed to remove bookmark', err);
            alert('Failed to remove bookmark');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-bg-primary text-primary flex flex-col items-center justify-center">
                <Header />
                <div className="text-center p-8">
                    <p className="mb-4 text-xl">Please login to view your library.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-neon-gold text-black rounded-lg font-bold hover:scale-105 transition-transform"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary text-primary transition-colors duration-300">
            <Header />
            
            <main className="container mx-auto px-4 pt-36 md:pt-36 pb-12">
                <header className="mb-12 border-b border-border pb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-neon-gold">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {t.title}
                    </h1>
                    <button 
                        onClick={() => refreshLibrary()}
                        className="p-2 rounded-full hover:bg-surface text-secondary hover:text-primary transition-colors"
                        title="Refresh Library"
                    >
                        <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </header>

                {isLoading && bookmarks.length === 0 ? (
                    // Skeleton Grid
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-surface rounded-lg overflow-hidden border border-border h-full flex flex-col animate-pulse">
                                <div className="aspect-[4/5] bg-muted/20"></div>
                                <div className="p-3 flex-1 space-y-2">
                                    <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                                    <div className="h-3 bg-muted/20 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-20 bg-surface rounded-xl border border-border shadow-lg">
                        <p className="text-xl text-secondary mb-6">{t.empty}</p>
                        <button 
                             onClick={() => navigate('/novels')}
                             className="px-6 py-3 bg-neon-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-md hover:shadow-lg"
                        >
                            {t.browse}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
                        {bookmarks.map((novel) => (
                            <motion.div
                                key={novel.id || novel._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-surface rounded-lg overflow-hidden border border-border hover:border-neon-gold/50 transition-all group shadow-sm hover:shadow-md h-full flex flex-col relative"
                            >
                                <div className="absolute top-2 right-2 z-20">
                                    <button
                                        onClick={(e) => handleRemoveBookmark(e, novel.id || novel._id || '')}
                                        className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                                        title={language === 'tamil' ? 'நூலகத்திலிருந்து நீக்கு' : 'Remove from library'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <Link to={`/novel/${novel.id || novel._id}`} className="block relative aspect-[4/5] overflow-hidden">
                                     <img 
                                        src={(novel as any).coverImageUrl || novel.coverImage || 'https://via.placeholder.com/300x450'} 
                                        alt={getString(novel.title)}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                     />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                     <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                         <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-0.5 line-clamp-2 group-hover:text-neon-gold transition-colors">
                                             {getString(novel.title)}
                                         </h3>
                                     </div>
                                </Link>
                                <div className="p-2 sm:p-3 flex flex-col flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs text-secondary mb-3 gap-1">
                                        <span className="font-medium truncate">{(typeof novel.author === 'object' ? (novel.author as any).name : novel.author) as string}</span>
                                        <span className="bg-primary/10 px-1.5 py-0.5 rounded text-[10px] text-primary border border-primary/20 w-fit">
                                            {novel.status}
                                        </span>
                                    </div>
                                    <div className="mt-auto">
                                        <Link 
                                            to={`/novel/${novel.id || novel._id}`}
                                            className="block w-full py-1.5 text-center bg-transparent hover:bg-neon-gold hover:text-black border border-primary/20 hover:border-neon-gold rounded text-xs sm:text-sm font-medium text-primary transition-colors"
                                        >
                                            {t.continue}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LibraryPage;
