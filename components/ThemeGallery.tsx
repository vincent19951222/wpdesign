import React from 'react';
import { motion } from 'framer-motion';
import { Check, MousePointerClick } from 'lucide-react';
import { Template } from '../types';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';

interface ThemeGalleryProps<T extends Template> {
    templates: T[];
    onSelect: (template: T) => void;
    currentId: string;
}

const ThemeGallery = <T extends Template>({ templates, onSelect, currentId }: ThemeGalleryProps<T>) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8; // 2 Rows on Desktop
    const totalPages = Math.ceil(templates.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const currentTemplates = templates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Grid Container */}
            <div className="min-h-[600px]"> {/* Fixed height container to prevent layout shift */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    {currentTemplates.map((item) => {
                        const isActive = item.id === currentId;

                        return (
                            <motion.div
                                layoutId={item.id}
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => onSelect(item)}
                                className={cn(
                                    "group relative flex flex-col cursor-pointer transition-all duration-200 border-4 border-neo-ink bg-white overflow-hidden h-[380px]",
                                    // Active State: "Pressed" down, yellow bg, no shadow
                                    isActive
                                        ? "transform translate-x-[8px] translate-y-[8px] shadow-none ring-4 ring-neo-yellow/50"
                                        : "shadow-neo-lg hover:-translate-y-2 hover:shadow-neo-xl"
                                )}
                            >
                                {/* Header / Color Block */}
                                <div
                                    className="h-32 w-full border-b-4 border-neo-ink relative overflow-hidden shrink-0"
                                    style={{
                                        backgroundColor: item.thumbnailColor,
                                        backgroundImage: item.thumbnailUrl ? `url(${item.thumbnailUrl})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {/* Pattern Overlay for texture - only if no image */}
                                    {!item.thumbnailUrl && (
                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:16px_16px]"></div>
                                    )}

                                    {/* Active Badge */}
                                    {isActive && (
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-neo-ink text-white border-white shadow-none animate-in zoom-in duration-200">
                                                <Check size={12} className="mr-1" strokeWidth={4} /> SELECTED
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Content Body */}
                                <div className={cn(
                                    "p-6 flex-1 flex flex-col transition-colors duration-200",
                                    isActive ? "bg-neo-yellow/10" : "bg-white"
                                )}>
                                    <h3 className="text-xl font-black font-sans uppercase text-neo-ink mb-3 leading-none tracking-tighter truncate">
                                        {item.name}
                                    </h3>

                                    {/* Decorative Separator */}
                                    <div className="flex gap-1 mb-4">
                                        <div className="w-2 h-2 bg-neo-ink"></div>
                                        <div className="w-2 h-2 bg-neo-accent"></div>
                                        <div className="w-2 h-2 bg-neo-ink"></div>
                                        <div className="w-full h-2 bg-neo-ink/10"></div>
                                    </div>

                                    <p className="text-sm font-bold font-mono text-neo-ink/70 leading-relaxed line-clamp-3">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t-2 border-dashed border-neo-ink/20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-black uppercase text-neo-accent flex items-center gap-1">
                                            <MousePointerClick size={14} /> SELECT
                                        </span>
                                        <div className="w-4 h-4 rounded-full border-2 border-neo-ink"></div>
                                    </div>
                                </div>

                                {/* Sticker Effect Details (Optional decorations) */}
                                {isActive && (
                                    <>
                                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-neo-yellow rounded-full blur-2xl opacity-20 pointer-events-none"></div>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-12 h-12 flex items-center justify-center bg-white border-4 border-neo-ink shadow-neo-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neo-yellow active:translate-y-1 active:shadow-none transition-all"
                    >
                        &lt;
                    </button>

                    <div className="flex gap-2 font-mono font-bold text-xl items-center bg-white px-4 py-2 border-4 border-neo-ink shadow-neo-sm">
                        <span>PAGE</span>
                        <span className="text-neo-accent">{currentPage}</span>
                        <span>/</span>
                        <span>{totalPages}</span>
                    </div>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-12 h-12 flex items-center justify-center bg-white border-4 border-neo-ink shadow-neo-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neo-yellow active:translate-y-1 active:shadow-none transition-all"
                    >
                        &gt;
                    </button>
                </div>
            )}

            {/* Context Helper Text */}
            <div className="text-center font-mono text-xs font-bold text-neo-ink/40 uppercase tracking-widest">
                [ SHOWING {Math.min(currentPage * itemsPerPage, templates.length)} / {templates.length} CARTRIDGES ]
            </div>
        </div>
    );
};



export default ThemeGallery;
