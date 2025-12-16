import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-ink disabled:pointer-events-none disabled:opacity-50 border-4 border-neo-ink shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    {
        variants: {
            variant: {
                default: "bg-neo-yellow text-neo-ink hover:bg-[#FFE170]",
                primary: "bg-neo-yellow text-neo-ink hover:bg-[#FFE170]", // Alias for backward compatibility if needed
                destructive: "bg-neo-accent text-white hover:bg-[#FF8585]",
                accent: "bg-neo-accent text-white hover:bg-[#FF8585]",
                outline: "bg-white text-neo-ink hover:bg-neo-bg",
                secondary: "bg-neo-secondary text-neo-ink hover:bg-[#FFC900]",
                ghost: "border-transparent shadow-none hover:bg-neo-accent/10 hover:text-neo-accent",
                link: "text-neo-ink underline-offset-4 hover:underline border-none shadow-none",
            },
            size: {
                default: "h-12 px-6 py-2",
                sm: "h-10 px-3 text-xs",
                lg: "h-14 px-8 text-lg",
                icon: "h-12 w-12",
            },
            shape: {
                default: "rounded-none",
                pill: "rounded-full", // Rare but allowed for strict neo vs mixed
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, shape, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
