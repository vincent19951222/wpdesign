import React from 'react';
import { motion } from 'framer-motion';
import { Check, MousePointerClick } from 'lucide-react';
import { Template } from '../types';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ThemeGalleryProps<T extends Template> {
    templates: T[];
    onSelect: (template: T) => void;
    currentId: string;
}

const ThemeGallery = <T extends Template>({ templates, onSelect, currentId }: ThemeGalleryProps<T>) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(templates.length / itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [templates]);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const currentTemplates = templates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentTemplates.map((item) => {
                    const isActive = item.id === currentId;

                    return (
                        <motion.button
                            type="button"
                            layoutId={item.id}
                            key={item.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={() => onSelect(item)}
                            data-pressed={isActive}
                            className={cn(
                                "group relative overflow-hidden border-4 border-neo-ink bg-pixel-panel text-left shadow-[4px_4px_0px_0px_#1a1a1a] transition-transform duration-150",
                                isActive && "translate-x-[4px] translate-y-[4px] shadow-none"
                            )}
                        >
                            <div
                                className="relative h-28 border-b-4 border-neo-ink md:h-32"
                                style={{
                                    backgroundColor: item.thumbnailColor,
                                    backgroundImage: item.thumbnailUrl ? `url(${item.thumbnailUrl})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {!item.thumbnailUrl && <div className="pixel-dot-bg absolute inset-0 opacity-20" />}
                                <div className="absolute inset-x-0 bottom-0 h-5 border-t-4 border-neo-ink bg-pixel-green" />
                                {isActive && (
                                    <div className="absolute right-2 top-2">
                                        <Badge variant="destructive" className="font-en-ui">
                                            <Check size={12} className="mr-1" strokeWidth={4} />
                                            ACTIVE
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 md:p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg leading-[1.5] text-neo-ink md:text-xl">{item.name}</h3>
                                        <div lang="en" className="font-en-ui mt-2 text-xs text-neo-ink/55">
                                            {item.id.replace(/-/g, ' ')}
                                        </div>
                                    </div>
                                    <div className="pixel-chip bg-pixel-panel px-2 py-1 text-xs">
                                        {item.category === 'api-safe' ? 'API' : 'STD'}
                                    </div>
                                </div>

                                <p className="mt-3 min-h-16 text-sm leading-[1.7] text-neo-ink/75">
                                    {item.description}
                                </p>

                                <div className="pixel-divider mt-3" />

                                <div className="mt-3 flex items-center justify-between gap-4">
                                    <span lang="en" className="font-en-ui flex items-center gap-2 text-xs text-neo-ink/70">
                                        <MousePointerClick size={14} />
                                        SELECT THEME
                                    </span>
                                    <span className="pixel-chip bg-pixel-yellow px-2 py-1 text-xs">
                                        {isActive ? '已选中' : '点击进入'}
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <Button type="button" variant="outline" size="icon" className="font-en-ui" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        &lt;
                    </Button>
                    <div className="pixel-chip bg-pixel-panel px-4 py-2">
                        <span lang="en" className="font-en-ui text-sm text-neo-ink">PAGE {currentPage} / {totalPages}</span>
                    </div>
                    <Button type="button" variant="outline" size="icon" className="font-en-ui" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </Button>
                </div>
            )}

            <div lang="en" className="font-en-ui text-center text-xs text-neo-ink/50">
                SHOWING {Math.min(currentPage * itemsPerPage, templates.length)} / {templates.length} CARTRIDGES
            </div>
        </div>
    );
};

export default ThemeGallery;
