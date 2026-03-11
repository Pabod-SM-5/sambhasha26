import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative group">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-md border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all duration-200",
            icon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-focus-within:text-white/60 transition-colors">
            {icon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
