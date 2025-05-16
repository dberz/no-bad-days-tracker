import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLogDate(dateString: string) {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    // Format the date in a simple way
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date error"
  }
}
