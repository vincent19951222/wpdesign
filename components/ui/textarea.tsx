import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[120px] w-full border-4 border-neo-ink bg-white px-3 py-2 text-lg font-bold placeholder:text-neo-ink/40 focus-visible:outline-none focus-visible:bg-neo-secondary focus-visible:shadow-neo-sm disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-colors",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
