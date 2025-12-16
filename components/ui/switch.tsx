import * as React from "react"
import { cn } from "../../lib/utils"

interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
    ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "group inline-flex h-8 w-14 shrink-0 cursor-pointer items-center border-4 border-neo-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    checked ? "bg-neo-secondary" : "bg-gray-200",
                    className
                )}
                onClick={() => !disabled && onCheckedChange(!checked)}
                ref={ref}
                {...props}
            >
                <span
                    className={cn(
                        "pointer-events-none block h-4 w-4 border-2 border-neo-ink bg-white ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1",
                        checked ? "translate-x-[26px]" : "translate-x-[2px]"
                    )}
                />
            </div>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }
