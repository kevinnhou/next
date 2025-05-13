import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const baseColours = [
  {
    activeColour: {
      dark: "oklch(87.677% 0.007 277.151)",
      light: "oklch(22.977% 0.033 280.887)",
    },
    label: "mono",
    name: "mono",
  },
] as const

export type Basecolour = (typeof baseColours)[number]
