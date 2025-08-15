import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
