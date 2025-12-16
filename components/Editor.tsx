import React from 'react';
import { ChevronLeft, Palette, Upload, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface EditorProps {
    markdown: string;
    setMarkdown: (value: string) => void;
    onBack: () => void;
    onPreview: () => void;
    onThemeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Editor: React.FC<EditorProps> = ({
    markdown,
    setMarkdown,
    onBack,
    onPreview,
    onThemeUpload,
    onFileUpload
}) => {
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-neo-cream p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="hover:-translate-x-1 transition-transform">
                        <div className="bg-neo-ink text-white p-2 border-2 border-black shadow-neo-sm">
                            <ChevronLeft strokeWidth={3} />
                        </div>
                    </button>
                    <Badge variant="default">EDITOR V2.0</Badge>
                </div>

                <div className="flex gap-3">
                    <input type="file" id="theme-upload" accept=".json" className="hidden" onChange={onThemeUpload} />
                    <Button size="sm" variant="secondary" onClick={() => document.getElementById('theme-upload')?.click()}>
                        <Palette size={16} className="mr-2" /> THEME
                    </Button>

                    <input type="file" id="md-upload" accept=".md" className="hidden" onChange={onFileUpload} />
                    <Button size="sm" variant="secondary" onClick={() => document.getElementById('md-upload')?.click()}>
                        <Upload size={16} className="mr-2" /> UPLOAD
                    </Button>

                    <Button onClick={onPreview}>
                        PREVIEW <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>

            <Card className="flex-1 p-0 overflow-hidden relative shadow-neo-lg border-4">
                <div className="absolute top-0 left-0 bg-neo-ink text-white font-mono text-xs px-2 py-1 border-b-4 border-r-4 border-black z-10">
                    MARKDOWN INPUT
                </div>
                <textarea
                    className="w-full h-full bg-white text-neo-ink font-mono resize-none focus:outline-none p-8 pt-10 text-lg"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    spellCheck={false}
                    placeholder="# START TYPING..."
                />
            </Card>
        </div>
    );
};
