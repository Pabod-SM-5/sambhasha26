import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[10px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase tracking-wider text-white/40 mb-2 block font-mono",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
