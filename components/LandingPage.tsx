import React from 'react';
import { Button } from './ui/button';
import { Wand2, Layout } from 'lucide-react';
import { InfiniteMarquee, StickersPack, NeoGridBackground } from './NeoEffects';
import ThemeGallery from './ThemeGallery';
import type { ITheme } from '../types/ITheme';
import type { Template } from '../types';

interface LandingPageProps {
    templates: (Template & { theme: ITheme })[];
    isLoading: boolean;
    onEnterStudio: () => void;
    onOpenExtractor: () => void;
    onSelectTheme: (theme: ITheme) => void;
    currentTheme: ITheme;
    templatesList: (Template & { theme: ITheme })[]; // Prop naming issue in App vs Here? 
    // ThemeGallery expects 'templates'.
}

// Adapting props to match App usage
export const LandingPage: React.FC<{
    templates: (Template & { theme: ITheme })[];
    isLoading: boolean;
    onEnterStudio: () => void;
    onOpenExtractor: () => void;
    onSelectTheme: (theme: ITheme) => void;
    currentThemeId: string;
}> = ({ templates, isLoading, onEnterStudio, onOpenExtractor, onSelectTheme, currentThemeId }) => {
    return (
        <NeoGridBackground>
            <div className="flex flex-col min-h-screen relative">
                {/* Navbar */}
                <nav className="flex justify-between items-center p-6 border-b-4 border-neo-ink bg-white z-50 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neo-ink text-white flex items-center justify-center font-black text-xl">
                            PL
                        </div>
                        <span className="font-sans font-bold text-xl uppercase tracking-wider hidden sm:block">Pixel Lab</span>
                    </div>
                    <div className="flex gap-4">
                        <Button size="sm" variant="secondary" onClick={onOpenExtractor}>
                            <Wand2 size={16} className="mr-2" /> EXTRACT
                        </Button>
                        <Button size="sm" onClick={() => window.open('https://github.com', '_blank')}>
                            GITHUB
                        </Button>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative py-20 px-4 text-center overflow-hidden">
                    <StickersPack />

                    <h1 className="text-7xl md:text-9xl font-black uppercase text-neo-ink mb-6 relative z-10 font-sans"
                        style={{ WebkitTextStroke: '2px black', color: 'transparent' }}
                    >
                        Digital<br />
                        <span className="text-neo-ink" style={{ WebkitTextStroke: '0' }}>Punk</span>
                    </h1>

                    <p className="font-mono text-lg md:text-xl font-bold bg-white inline-block px-4 py-2 border-4 border-neo-ink shadow-neo-sm rotate-2">
                        RAW AESTHETICS FOR WECHAT
                    </p>
                </header>

                {/* Marquee */}
                <InfiniteMarquee text="NEO-BRUTALISM • HIGH CONTRAST • RAW • BOLD •" />

                {/* Main Content - Gallery */}
                <main className="flex-1 flex flex-col items-center justify-center py-12 relative z-10">
                    {isLoading ? (
                        <div className="text-2xl font-black animate-pulse">LOADING RESOURCES...</div>
                    ) : (
                        <div className="w-full max-w-6xl">
                            <ThemeGallery
                                templates={templates}
                                onSelect={(t) => onSelectTheme(t.theme)}
                                currentId={currentThemeId}
                            />

                            <div className="flex justify-center mt-12">
                                <Button size="lg" onClick={onEnterStudio}>
                                    ENTER STUDIO <Layout className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t-4 border-neo-ink p-6 bg-neo-yellow text-center font-mono text-sm font-bold">
                    © 2025 PIXEL LAB. NO COPYRIGHTS RESERVED.
                </footer>
            </div>
        </NeoGridBackground>
    );
};
