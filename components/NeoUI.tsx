
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ---------------------------
// NeoPrimitives
// ---------------------------

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
}

export const NeoButton: React.FC<NeoButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const baseStyles = "font-sans font-bold border-4 border-neo-ink shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 text-center flex items-center justify-center gap-2 rounded-none uppercase tracking-wide";

    const variants = {
        primary: "bg-neo-yellow text-neo-ink hover:bg-[#FFE170]",
        secondary: "bg-white text-neo-ink hover:bg-gray-100",
        accent: "bg-neo-red text-white hover:bg-[#FF8585]"
    };

    const sizes = {
        sm: "px-3 py-1 text-sm h-10",
        md: "px-6 py-2 text-base h-12",
        lg: "px-8 py-4 text-xl h-16"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export const NeoCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "bg-white border-4 border-neo-ink shadow-[8px_8px_0px_0px_#000] p-6 transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const NeoBadge: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({
    children,
    className,
    color = 'bg-neo-violet'
}) => {
    return (
        <span className={cn(
            "inline-block border-2 border-neo-ink px-2 py-0.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]",
            color,
            className
        )}>
            {children}
        </span>
    );
};

interface NeoSwitchProps {
    checked: boolean;
    onChange: () => void;
    label?: string;
}

export const NeoSwitch: React.FC<NeoSwitchProps> = ({ checked, onChange, label }) => {
    return (
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onChange}>
            <div className={cn(
                "w-12 h-6 border-4 border-neo-ink relative transition-colors",
                checked ? "bg-neo-green-400" : "bg-gray-200"
            )}>
                <div className={cn(
                    "absolute top-[-4px] left-[-4px] w-6 h-6 border-4 border-neo-ink bg-white transition-transform duration-100",
                    checked ? "translate-x-full bg-neo-yellow" : "translate-x-0"
                )} />
            </div>
            {label && <span className="font-sans font-bold text-sm uppercase select-none">{label}</span>}
        </div>
    );
};
