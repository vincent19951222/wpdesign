import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-14 w-full border-4 border-neo-ink bg-white px-3 py-2 text-lg font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neo-ink/40 focus-visible:outline-none focus-visible:bg-neo-secondary focus-visible:shadow-neo-sm disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
