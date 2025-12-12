import React from 'react';
import { LucideIcon } from 'lucide-react';

export const PixelButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
  icon?: LucideIcon
}> = ({ children, onClick, primary, className = "", icon: Icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group font-pixel text-xs sm:text-sm tracking-widest uppercase
        transition-transform active:scale-95
        border-2 border-pixel-darker
        px-6 py-3
        ${primary 
          ? 'bg-pixel-yellow text-pixel-darker hover:bg-white' 
          : 'bg-pixel-dark text-white hover:bg-gray-800 border-white/20'
        }
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        ${primary ? 'shadow-white/20' : 'shadow-pixel-purple'}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {children}
      </div>
    </button>
  );
};

export const TemplateCard: React.FC<{
  title: string;
  description: string;
  active: boolean;
  color: string;
  onClick: () => void;
}> = ({ title, description, active, color, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className={`
            cursor-pointer
            border-2 
            p-6 
            transition-all duration-200
            hover:-translate-y-1
            ${active 
                ? 'border-pixel-green bg-pixel-dark shadow-[8px_8px_0px_0px_#00E099]' 
                : 'border-white/20 bg-pixel-darker hover:border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]'
            }
        `}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 border-2 border-current flex items-center justify-center`} style={{ color: color }}>
                <div className="w-4 h-4 bg-current"></div>
            </div>
            <h3 className="font-pixel text-white text-sm">{title}</h3>
        </div>
        <p className="font-mono text-gray-400 text-xs leading-relaxed">
            {description}
        </p>
    </div>
  );
}