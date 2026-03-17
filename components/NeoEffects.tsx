import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';
import { Star, Hexagon, Zap } from 'lucide-react';

// ---------------------------
// NeoEffects
// ---------------------------

export const InfiniteMarquee: React.FC<{ text: string; className?: string; speed?: number }> = ({
    text,
    className,
    speed = 20
}) => {
    return (
        <div className={cn("w-full overflow-hidden whitespace-nowrap py-4", className)}>
            <motion.div
                className="inline-block"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed
                }}
            >
                <span className="mx-4 inline-block text-xl md:text-2xl">
                    {text} • {text} • {text} • {text} • {text} •
                </span>
            </motion.div>
            <motion.div
                className="inline-block"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed
                }}
            >
                <span className="mx-4 inline-block text-xl md:text-2xl">
                    {text} • {text} • {text} • {text} • {text} •
                </span>
            </motion.div>
        </div>
    );
};

export const DraggableSticker: React.FC<{
    children: React.ReactNode;
    initialX?: number;
    initialY?: number;
    rotate?: number;
    className?: string
}> = ({ children, initialX = 0, initialY = 0, rotate = 0, className }) => {
    return (
        <motion.div
            drag
            dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
            whileDrag={{ scale: 1.2, zIndex: 100, rotate: rotate + 10 }}
            whileHover={{ scale: 1.1, cursor: 'grab' }}
            initial={{ x: initialX, y: initialY, rotate }}
            className={cn("absolute cursor-grab active:cursor-grabbing", className)}
        >
            {children}
        </motion.div>
    );
};

export const NeoGridBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-neo-cream">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export const StickersPack = () => {
    return (
        <>
            <DraggableSticker initialX={100} initialY={-50} rotate={12}>
                <div className="bg-neo-red text-white font-bold p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-full w-24 h-24 flex items-center justify-center text-center text-xs uppercase">
                    100%<br />RAW
                </div>
            </DraggableSticker>

            <DraggableSticker initialX={-200} initialY={100} rotate={-5}>
                <Star size={60} className="fill-neo-yellow text-black stroke-[3px]" />
            </DraggableSticker>

            <DraggableSticker initialX={300} initialY={20} rotate={45}>
                <Zap size={50} className="fill-neo-violet text-black stroke-[3px]" />
            </DraggableSticker>
        </>
    )
}
