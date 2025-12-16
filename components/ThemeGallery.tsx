import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Template } from '../types';

interface ThemeGalleryProps<T extends Template> {
    templates: T[];
    onSelect: (template: T) => void;
    currentId: string;
}

const ThemeGallery = <T extends Template>({ templates, onSelect, currentId }: ThemeGalleryProps<T>) => {
    // Find index of current theme to start with
    const initialIndex = templates.findIndex(t => t.id === currentId);
    const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

    // Handle circular navigation
    const rotateLeft = () => {
        setActiveIndex((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
    };

    const rotateRight = () => {
        setActiveIndex((prev) => (prev === templates.length - 1 ? 0 : prev + 1));
    };

    // Select the current active item
    const handleSelect = () => {
        onSelect(templates[activeIndex]);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') rotateLeft();
            if (e.key === 'ArrowRight') rotateRight();
            if (e.key === 'Enter') handleSelect();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, templates]);

    // Update selection when active index changes (optional - creates "live preview" feel)
    useEffect(() => {
        const timer = setTimeout(() => {
            onSelect(templates[activeIndex]);
        }, 300); // Small delay to prevent flashing while scrolling fast
        return () => clearTimeout(timer);
    }, [activeIndex]);

    const getCircularIndex = (index: number, length: number) => {
        const offset = (index - activeIndex + length) % length;
        // For length 4: 0->0, 1->1, 2->2, 3->3.
        // We want centered relative indices:
        // If length is small, we adjust.
        // For 4 items: Active=0. 1->Right, 3->Left(-1). 2->Back.
        if (offset > length / 2) return offset - length;
        return offset;
    };

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center perspective-1000 overflow-hidden">

            {/* Background Glow based on active theme color */}
            <motion.div
                className="absolute inset-0 z-0 opacity-20 blur-[100px] transition-colors duration-700"
                style={{ backgroundColor: templates[activeIndex].thumbnailColor }}
            />

            <div className="relative z-10 w-full max-w-5xl h-full flex items-center justify-center">
                {templates.map((item, index) => {
                    const offset = getCircularIndex(index, templates.length);
                    const isActive = offset === 0;
                    const isRight = offset === 1;
                    const isLeft = offset === -1;
                    const isBack = Math.abs(offset) >= 2; // For 4 items, 2 is back. 

                    // Determine X position
                    let x = 0;
                    if (isRight) x = 320;
                    if (isLeft) x = -320;
                    if (isBack) x = 0; // Behind center

                    // Determine Scale
                    let scale = 0.7;
                    if (isActive) scale = 1.0;
                    if (isBack) scale = 0.5;

                    // Determine Z-Index
                    let zIndex = 10;
                    if (isActive) zIndex = 30;
                    if (isRight || isLeft) zIndex = 20;
                    if (isBack) zIndex = 5;

                    // Opacity
                    let opacity = 0.5;
                    if (isActive) opacity = 1;
                    if (isBack) opacity = 0; // Hide back item to prevent visual clutter or let it fade

                    // Rotation
                    let rotateY = 0;
                    if (isLeft) rotateY = 25;
                    if (isRight) rotateY = -25;

                    return (
                        <motion.div
                            key={item.id} // Stable key!
                            animate={{
                                x,
                                scale,
                                opacity,
                                rotateY,
                                zIndex,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            className="absolute w-[280px] md:w-[320px] aspect-[3/4] p-0 cursor-pointer bg-white border-4 border-neo-ink shadow-[12px_12px_0px_0px_#000]"
                            onClick={() => {
                                if (isActive) handleSelect();
                                else if (isLeft) rotateLeft();
                                else if (isRight) rotateRight();
                            }}
                            style={{
                                perspective: 1000,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* Card Content */}
                            <div className="w-full h-full overflow-hidden relative group flex flex-col">
                                {/* Color Header */}
                                <div
                                    className="h-32 w-full transition-colors duration-500 border-b-4 border-neo-ink"
                                    style={{ backgroundColor: item.thumbnailColor }}
                                />

                                {/* Content Body */}
                                <div className="p-6 bg-white flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold font-sans uppercase text-neo-ink mb-2 tracking-tight">{item.name}</h3>
                                    <div className="bg-neo-ink h-1 w-12 mb-4"></div>
                                    <p className="text-neo-ink/70 text-sm font-sans font-medium leading-relaxed line-clamp-4">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Active Indicator Overlay */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute top-4 right-4 bg-neo-yellow text-black p-2 border-2 border-neo-ink shadow-[4px_4px_0px_0px_#000]"
                                        >
                                            <Check size={24} strokeWidth={4} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center items-center gap-8">
                <button
                    onClick={rotateLeft}
                    className="w-14 h-14 rounded-full bg-gray-800/80 hover:bg-white hover:text-black transition-all border border-gray-600 flex items-center justify-center backdrop-blur-sm"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                    {templates.map((t, idx) => (
                        <div
                            key={t.id}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-white' : 'w-2 bg-gray-600'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={rotateRight}
                    className="w-14 h-14 rounded-full bg-gray-800/80 hover:bg-white hover:text-black transition-all border border-gray-600 flex items-center justify-center backdrop-blur-sm"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

        </div>
    );
};

export default ThemeGallery;
