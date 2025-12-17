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
    onOpenDocs: () => void;
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
    onOpenDocs: () => void;
    onSelectTheme: (theme: ITheme) => void;
    currentThemeId: string;
    currentTheme: ITheme;
    templatesList: (Template & { theme: ITheme })[];
}> = ({ templates, isLoading, onEnterStudio, onOpenExtractor, onOpenDocs, onSelectTheme, currentThemeId }) => {
    return (
        <NeoGridBackground>
            <div className="flex flex-col min-h-screen relative">
                {/* Navbar - Yellow Stripe */}
                <nav className="flex justify-between items-center p-6 border-b-4 border-neo-ink bg-neo-yellow z-50 relative sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neo-ink text-neo-yellow flex items-center justify-center font-black text-xl border-2 border-white">
                            PL
                        </div>
                        <span className="font-sans font-black text-xl uppercase tracking-wider hidden sm:block">Wp Design</span>
                    </div>
                    <div className="flex gap-4">
                        <Button size="sm" className="bg-white hover:bg-neo-raspberry hover:text-white border-neo-ink text-neo-ink font-bold" onClick={onOpenExtractor}>
                            <Wand2 size={16} className="mr-2" /> EXTRACT
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-neo-ink hover:text-white" onClick={onOpenDocs}>
                            DOCS
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-neo-ink hover:text-white" onClick={() => window.open('https://github.com', '_blank')}>
                            GITHUB
                        </Button>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative pt-20 pb-12 px-4 text-center overflow-hidden bg-neo-bg">
                    <StickersPack />

                    {/* Announcement Badge */}
                    <div className="mb-8 inline-block animate-bounce-slow">
                        <div className="bg-neo-raspberry text-white px-6 py-2 border-4 border-neo-ink shadow-neo-sm font-bold font-mono text-sm uppercase transform -rotate-2">
                            ★ The Way Your Team Works ★
                        </div>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black uppercase text-neo-ink mb-6 relative z-10 font-sans leading-[0.9]">
                        <span className="text-white relative inline-block px-4 font-cnhy tracking-widest" style={{ WebkitTextStroke: '4px black', textShadow: '8px 8px 0px #000' }}>微信公众号</span>
                        <br />
                        <span className="bg-neo-yellow px-4 border-4 border-neo-ink inline-block transform rotate-1 mt-2 font-cnhy">排版</span>
                    </h1>

                    <p className="font-mono text-lg md:text-xl font-bold bg-white inline-block px-6 py-3 border-4 border-neo-ink shadow-neo-sm -rotate-1 mt-8 max-w-2xl leading-normal">
                        Make your WeChat articles <span className="text-neo-raspberry font-black bg-neo-yellow px-2">POP</span> with raw aesthetics and high contrast themes.
                    </p>
                </header>

                {/* Raspberry Marquee with Yellow Text - THE CLASH */}
                <div className="bg-neo-raspberry border-y-4 border-neo-ink py-4 transform -rotate-1 scale-105 origin-left z-20 relative shadow-neo-lg">
                    <InfiniteMarquee text="NEO-BRUTALISM • HIGH CONTRAST • RAW • BOLD • VIBRANT • NO COMPROMISE • " className="text-neo-yellow font-black text-2xl" />
                </div>

                {/* Main Content - Gallery */}
                <main className="flex-1 flex flex-col items-center justify-center py-20 relative z-10 bg-white">
                    <div className="absolute top-0 left-0 w-full h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-20 h-full pointer-events-none"></div>

                    {isLoading ? (
                        <div className="text-2xl font-black animate-pulse bg-neo-yellow px-8 py-4 border-4 border-neo-ink shadow-neo-md">LOADING RESOURCES...</div>
                    ) : (
                        <div className="w-full max-w-7xl px-4">
                            <ThemeGallery
                                templates={templates}
                                onSelect={(t) => {
                                    onSelectTheme(t.theme);
                                    onEnterStudio(); // Auto-enter on click
                                }}
                                currentId={currentThemeId}
                            />

                            <div className="flex justify-center mt-20">
                                <div className="p-2 border-4 border-neo-ink bg-neo-raspberry shadow-neo-xl rotate-1 group hover:rotate-0 transition-transform duration-300">
                                    <Button
                                        size="xl"
                                        onClick={onEnterStudio}
                                        className="bg-neo-yellow text-neo-ink border-2 border-neo-ink hover:bg-white hover:scale-105 transition-all text-2xl px-12 py-8 h-auto shadow-none"
                                    >
                                        ENTER STUDIO <Layout className="ml-4 w-8 h-8" strokeWidth={3} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t-4 border-neo-ink p-12 bg-neo-ink text-neo-yellow text-center font-mono text-sm font-bold relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-neo-raspberry"></div>
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-2xl font-black uppercase tracking-tighter">LIMIANTIAO LAB INC.</div>
                        <div className="flex gap-4 opacity-70">
                            <span>© 2025 ALL RIGHTS RESERVED</span>
                            <span>•</span>
                            <span>DESIGNED FROM LIMIANTIAO</span>
                        </div>
                    </div>
                </footer>
            </div>
        </NeoGridBackground>
    );
};
