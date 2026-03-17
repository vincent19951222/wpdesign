import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
    "pixel-chip inline-flex items-center px-2 py-1 text-xs leading-none text-neo-ink transition-colors",
    {
        variants: {
            variant: {
                default: "bg-pixel-yellow text-neo-ink",
                secondary: "bg-pixel-orange text-white",
                destructive: "bg-pixel-red text-white",
                outline: "bg-pixel-panel text-neo-ink",
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
