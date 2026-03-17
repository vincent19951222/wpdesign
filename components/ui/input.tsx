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
                    "pixel-input flex h-12 w-full px-4 py-2 text-base text-neo-ink placeholder:text-neo-ink/45 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm",
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
