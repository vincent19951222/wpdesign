import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
    "inline-flex items-center border-2 border-neo-ink px-2.5 py-0.5 text-xs font-bold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-neo-sm",
    {
        variants: {
            variant: {
                default: "bg-neo-yellow text-neo-ink hover:bg-neo-yellow/80",
                secondary: "bg-neo-secondary text-neo-ink hover:bg-neo-secondary/80",
                destructive: "bg-neo-accent text-white hover:bg-neo-accent/80",
                outline: "text-neo-ink border-neo-ink",
            },
            shape: {
                default: "rounded-none",
                pill: "rounded-full",
            }
        },
        defaultVariants: {
            variant: "default",
            shape: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, shape, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, shape }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
