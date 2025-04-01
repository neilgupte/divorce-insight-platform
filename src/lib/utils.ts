
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNetWorth(value: number): string {
  return value >= 50 ? "$50M+" : `$${value}M`;
}
