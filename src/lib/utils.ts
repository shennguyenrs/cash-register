import { clsx, type ClassValue } from "clsx"
import { parse } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCreatedAt(dateStr: string) {
  if (dateStr.includes("T")) {
    return parse(dateStr, "yyyy-MM-dd'T'HH:mm:ss", new Date())
  } else {
    return parse(dateStr, "yyyy-MM-dd HH:mm:ss", new Date())
  }
}
