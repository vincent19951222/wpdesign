import React from 'react';
import { ChevronLeft, Check, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import WeChatRenderer from './WeChatRenderer';
import { ITheme } from '../types/ITheme';

interface PreviewProps {
    markdown: string;
    theme: ITheme;
    copied: boolean;
    onBack: () => void;
    onCopy: () => void;
}

export const Preview: React.FC<PreviewProps> = ({
    markdown,
    theme,
    copied,
    onBack,
    onCopy
}) => {
    return (
        <div className="h-full min-h-screen flex flex-col items-center justify-center bg-neo-cream p-4">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="hover:-translate-x-1 transition-transform">
                        <div className="bg-neo-ink text-white p-2 border-2 border-black shadow-neo-sm">
                            <ChevronLeft strokeWidth={3} />
                        </div>
                    </button>
                    <Badge variant="default" className="bg-neo-green">PREVIEW MODE</Badge>
                </div>

                <div className="hidden md:block">
                    <Button onClick={onCopy} variant={copied ? "secondary" : "primary"}>
                        {copied ? <><Check strokeWidth={3} className="mr-2" /> COPIED!</> : <><Copy strokeWidth={3} className="mr-2" /> COPY HTML</>}
                    </Button>
                </div>
            </div>

            {/* Mobile Simulator */}
            <div className="relative w-full max-w-[400px] h-[85vh] border-8 border-neo-ink bg-white shadow-neo-xl overflow-hidden">
                {/* Fake Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neo-ink rounded-b-md z-20"></div>

                <div className="w-full h-full overflow-y-auto bg-white custom-scrollbar">
                    <WeChatRenderer content={markdown} theme={theme} />
                </div>
            </div>

            {/* Mobile Floating Button */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
                <button
                    onClick={onCopy}
                    className="w-16 h-16 bg-neo-yellow border-4 border-neo-ink shadow-neo-sm flex items-center justify-center active:translate-y-1 active:shadow-none transition-all"
                >
                    {copied ? <Check strokeWidth={3} /> : <Copy strokeWidth={3} />}
                </button>
            </div>
        </div>
    );
};
