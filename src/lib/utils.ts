
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNetWorth(value: number): string {
  return value >= 50 ? "$50M+" : `$${value}M`;
}

// Helper function to normalize AI insights data to match the expected format
export function normalizeAIInsights(insights: any[]): any[] {
  return insights.map(insight => ({
    id: String(insight.id), // Ensure ID is a string
    text: insight.text || insight.description || "",
    title: insight.title || "",
    description: insight.description || "",
    tags: insight.tags || [],
    category: insight.category || (
      insight.severity === "high" ? "anomaly" :
      insight.severity === "medium" ? "opportunity" : "trend"
    ),
    severity: insight.severity || "medium",
    trend: insight.trend || "stable"
  }));
}
