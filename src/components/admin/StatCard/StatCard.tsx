import React from 'react';
import { StatCardProps } from '../../../types';
// import styles from './StatCard.module.scss'; // Removed SCSS

/**
 * StatCard Component
 *
 * Reusable card for displaying dashboard statistics
 *
 * Props:
 * - title: Card title (e.g., "Total Novels")
 * - value: Statistic value (e.g., 42)
 * - icon: Emoji or icon character
 * - color: Theme color ('blue', 'green', 'purple', 'orange')
 * - trend: Optional trend indicator (e.g., "+12%")
 */

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'blue', trend, loading = false }) => {
  
  // Color mappings for Tailwind
  const colorStyles: Record<string, { bg: string, text: string, iconBg: string }> = {
    blue: { 
        bg: 'hover:border-neon-blue/50', 
        text: 'text-neon-blue', 
        iconBg: 'bg-neon-blue/10 text-neon-blue' 
    },
    green: { 
        bg: 'hover:border-green-400/50', 
        text: 'text-green-400', 
        iconBg: 'bg-green-400/10 text-green-400' 
    },
    purple: { 
        bg: 'hover:border-neon-magenta/50', 
        text: 'text-neon-magenta', 
        iconBg: 'bg-neon-magenta/10 text-neon-magenta' 
    },
    orange: { 
        bg: 'hover:border-neon-gold/50', 
        text: 'text-neon-gold', 
        iconBg: 'bg-neon-gold/10 text-neon-gold' 
    }
  };

  const currentStyle = colorStyles[color] || colorStyles.blue;

  if (loading) {
      return (
        <div className="bg-surface border border-border rounded-xl p-6 flex items-center gap-5 relative overflow-hidden">
            <div className="w-16 h-16 rounded-xl bg-muted/10 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-4 w-24 bg-muted/10 rounded animate-pulse" />
                <div className="h-8 w-16 bg-muted/10 rounded animate-pulse" />
            </div>
        </div>
      );
  }

  return (
    <div className={`
        relative overflow-hidden
        bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl p-6
        flex items-center gap-6 transition-[transform,border-color,background-color,box-shadow] duration-500
        hover:-translate-y-1 hover:border-accent/20 hover:bg-glass-bg/80
        hover:shadow-lg dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),0_0_20px_rgba(14,165,233,0.05)]
        group transform-gpu
    `}>
      {/* Dynamic Glow Background */}
      <div className={`absolute -right-4 -top-24 w-48 h-48 rounded-full blur-[80px] opacity-[0.05] dark:opacity-10 transition-opacity group-hover:opacity-20 ${currentStyle.text.replace('text-', 'bg-')}`} />

      <div className={`
        w-14 h-14 rounded-2xl flex items-center justify-center
        flex-shrink-0 transition-[transform,background-color] duration-500 group-hover:scale-110
        ${currentStyle.iconBg} shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]
        border border-glass-border transform-gpu
      `}>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="flex-1 min-w-0 z-10">
        <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1.5">{title}</h3>
        <div className="flex items-baseline gap-3">
          <p className="text-3xl font-black text-primary tracking-tight leading-none">
            {typeof value === 'number' ? value.toLocaleString() : value || '0'}
          </p>
          {trend && (
            <span className={`
                text-[10px] font-bold px-2 py-1 rounded-full
                ${trend.isPositive 
                    ? 'text-green-500 bg-green-500/10' 
                    : 'text-red-500 bg-red-500/10'}
                border border-glass-border
            `}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>
      </div>

      {/* Subtle border accent */}
      <div className={`absolute bottom-0 left-6 right-6 h-[2.5px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 ${currentStyle.text}`} />
    </div>
  );
};

export default StatCard;
