import React from 'react';
import { ModalProps } from '../../../types';
import { YOUTUBE_CHANNELS } from '../../../utils/constants';
import youtubeLogo from '../../../assets/images/social/youtube-logo.png';
// import styles from './YouTubeModal.module.scss'; // Removed SCSS

const YouTubeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300"
        onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[500px] bg-bg-secondary border border-border rounded-xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="text-xl md:text-2xl font-bold text-primary">YouTube Channels</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-primary hover:bg-surface/50 transition-colors text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {YOUTUBE_CHANNELS.map((channel, index) => (
            <a
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 hover:bg-red-500/5 hover:border-red-500/20 border border-transparent transition-all duration-200 group"
            >
              <img src={youtubeLogo} alt="YouTube" className="w-8 h-8 object-contain" />
              <span className="text-primary font-medium group-hover:text-red-500 transition-colors">{channel.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouTubeModal;
