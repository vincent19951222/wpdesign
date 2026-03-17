import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "pixel-btn inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm leading-none text-neo-ink focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-pixel-yellow text-neo-ink",
                primary: "bg-pixel-yellow text-neo-ink",
                destructive: "bg-pixel-red text-white",
                accent: "bg-pixel-blue text-white",
                outline: "bg-pixel-panel text-neo-ink",
                secondary: "bg-pixel-orange text-white",
                ghost: "bg-pixel-panel text-neo-ink",
                link: "border-0 bg-transparent p-0 shadow-none text-neo-ink underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-4 py-2",
                sm: "h-10 px-4 py-2 text-xs",
                lg: "h-14 px-6 py-2 text-base",
                xl: "h-16 px-8 py-2 text-lg",
                icon: "h-12 w-12 p-2",
            },
            shape: {
                default: "rounded-none",
                pill: "rounded-full",
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
