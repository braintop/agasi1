import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export function Slider({ className, ...props }: SliderProps) {
  return (
    <input
      type="range"
      className={cn(
        // Give the control a taller hit area so the thumb is vertically centered
        'h-8 w-full cursor-pointer appearance-none bg-transparent',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[color:var(--primary)] [&::-webkit-slider-thumb]:shadow-card',
        '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[color:var(--primary)]',
        '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-surface-2',
        '[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-surface-2',
        className,
      )}
      {...props}
    />
  )
}

