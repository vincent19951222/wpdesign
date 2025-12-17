import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <motion.div
            className={`relative w-12 h-12 flex items-center justify-center cursor-pointer select-none ${className}`}
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
        >
            {/* Shadow/Base Layer */}
            <div className="absolute inset-0 bg-neo-ink translate-x-1 translate-y-1 rounded-lg" />

            {/* Main Keycap Layer */}
            <div className="absolute inset-0 bg-neo-ink border-2 border-white rounded-lg flex items-center justify-center overflow-hidden">
                {/* Inner Ring */}
                <div className="w-8 h-8 rounded-full border-2 border-neo-yellow flex items-center justify-center">
                    {/* SVG Letters */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                            d="M6 6v12h5c2.2 0 4-1.8 4-4s-1.8-4-4-4H6z M15 6v12h4"
                            stroke="#FFDE59" // neo-yellow
                            strokeWidth="3"
                            strokeLinecap="square"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
                        />
                        <motion.path
                            d="M17 18h4"
                            stroke="#FFDE59"
                            strokeWidth="3"
                            strokeLinecap="square"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, ease: "easeInOut", delay: 1, repeat: Infinity, repeatDelay: 3.5 }}
                        />
                    </svg>
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-50" />

            {/* Text Overlay for backup/clarity if SVG is abstract, but let's stick to the SVG P & L shape logic above. 
               Wait, the SVG path above is a bit generic 'P' and 'L' mix. Let's refine the path for "PL".
            */}
        </motion.div>
    );
};

// Refined Version with clearer PL
export const TypewriterLogo: React.FC<{ size?: number }> = ({ size = 40 }) => {
    return (
        <motion.div
            style={{ width: size, height: size }}
            className="relative cursor-pointer"
            whileHover={{ y: 2 }}
            whileTap={{ y: 4 }}
        >
            {/* Keycap Side (Depth) */}
            <div className="absolute inset-x-0 bottom-0 top-1 bg-gray-800 rounded-[0.4rem] translate-y-[2px]" />

            {/* Keycap Top */}
            <div className="absolute inset-0 bg-neo-ink rounded-[0.4rem] border-2 border-white shadow-sm flex items-center justify-center z-10 overflow-hidden">
                {/* Inner Ring/Decoration - Optional, keeping it subtle or removing if distracting. Let's keep a grid or something technical. */}
                {/* Let's try a pure SVG PL that looks engineered */}
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* W */}
                    <motion.path
                        d="M3 7 L6 17 L9 7 L12 17 L15 7"
                        stroke="#FFDE59"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "circOut" }}
                    />
                    {/* P */}
                    <motion.path
                        d="M17 7 V17 M17 7 H20 C21.5 7 22.5 8 22.5 9.5 C22.5 11 21.5 12 20 12 H17"
                        stroke="#FFDE59"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.8 }}
                    />
                </svg>
            </div>
        </motion.div>
    );
};

// Final component to export
export default TypewriterLogo;
