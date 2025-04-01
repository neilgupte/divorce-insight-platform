
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
    id: String(insight.id || Date.now()), // Ensure ID is a string
    text: insight.text || insight.description || "",
    title: insight.title || "",
    description: insight.description || "",
    tags: insight.tags || [],
    category: insight.category || (
      insight.severity === "high" ? "anomaly" :
      insight.severity === "medium" ? "opportunity" : "trend"
    ),
    severity: insight.severity || "medium",
    trend: insight.trend || "stable",
    userGenerated: insight.userGenerated || false,
    createdAt: insight.createdAt || new Date().toISOString(),
    createdBy: insight.createdBy || null
  }));
}

// Generate an AI insight based on user prompt
export async function generateAIInsight(prompt: string, currentFilters: any): Promise<any> {
  // This is a placeholder function that would normally call your backend API
  // For demo purposes, we'll simulate an API call with mock data
  console.log("Generating insight for prompt:", prompt);
  console.log("Using current filters:", currentFilters);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract keywords from prompt for categorization
  const promptLower = prompt.toLowerCase();
  
  let category = "trend";
  if (promptLower.includes("anomal") || promptLower.includes("unusual") || promptLower.includes("strange")) {
    category = "anomaly";
  } else if (promptLower.includes("opportunit") || promptLower.includes("potential") || promptLower.includes("growth")) {
    category = "opportunity";
  } else if (promptLower.includes("risk") || promptLower.includes("concern") || promptLower.includes("warning")) {
    category = "risk";
  }
  
  // Generate tags based on prompt keywords
  const tags = [];
  
  // State detection
  const states = ["california", "new york", "florida", "texas", "illinois", "colorado"];
  for (const state of states) {
    if (promptLower.includes(state)) {
      tags.push(state.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
      break;
    }
  }
  
  // Topic detection
  if (promptLower.includes("divorce")) tags.push("Divorce");
  if (promptLower.includes("asset") || promptLower.includes("wealth")) tags.push("Assets");
  if (promptLower.includes("protect")) tags.push("Protection");
  if (promptLower.includes("trend")) tags.push("Trend");
  if (promptLower.includes("property") || promptLower.includes("real estate")) tags.push("Property");
  
  // If no tags were added, add a generic one
  if (tags.length === 0) {
    tags.push("Analysis");
  }
  
  // Create a new insight
  return {
    id: `user-${Date.now()}`,
    text: generateInsightText(prompt, currentFilters),
    title: generateInsightTitle(prompt),
    tags,
    category,
    userGenerated: true,
    createdAt: new Date().toISOString(),
    createdBy: "Current User"
  };
}

// Helper function to generate insight title
function generateInsightTitle(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("asset protection") || promptLower.includes("protect")) {
    return "Asset Protection Analysis";
  } else if (promptLower.includes("divorce")) {
    return "Divorce Trend Analysis";
  } else if (promptLower.includes("property") || promptLower.includes("real estate")) {
    return "Property Insights";
  } else if (promptLower.includes("trend")) {
    return "Trend Analysis";
  } else if (promptLower.includes("anomal")) {
    return "Anomaly Detection";
  }
  
  return "Custom Insight";
}

// Helper function to generate insight text based on prompt
function generateInsightText(prompt: string, filters: any): string {
  const promptLower = prompt.toLowerCase();
  const stateFilter = filters.selectedState !== "All States" ? filters.selectedState : null;
  const cityFilter = filters.selectedCity !== "All Cities" ? filters.selectedCity : null;
  const netWorthMin = filters.netWorthRange[0];
  const netWorthMax = filters.netWorthRange[1];
  
  // Location text component
  let locationText = "across the United States";
  if (cityFilter) {
    locationText = `in ${cityFilter}`;
  } else if (stateFilter) {
    locationText = `in ${stateFilter}`;
  }
  
  // Net worth text component
  let netWorthText = "";
  if (netWorthMin > 1 || netWorthMax < 50) {
    netWorthText = ` for individuals with net worth between $${netWorthMin}M and $${netWorthMax}M`;
  }
  
  // Generate response based on prompt keywords
  if (promptLower.includes("asset protection") || promptLower.includes("protect")) {
    return `Asset protection rates ${locationText} have increased by 17.2% year-over-year${netWorthText}. This is significantly higher than the national average of 8.4%, suggesting heightened concerns about wealth preservation.`;
  } else if (promptLower.includes("divorce") && promptLower.includes("trend")) {
    return `Divorce rates ${locationText} show a distinctive seasonal pattern${netWorthText}, with filings 32% higher in January and February compared to summer months. Pre-filing financial restructuring activities typically begin 4-6 months prior.`;
  } else if (promptLower.includes("divorce") && promptLower.includes("anomal")) {
    return `An anomalous 28.5% spike in high-net-worth divorce filings was detected ${locationText} in the last quarter${netWorthText}. This correlates with recent legislative changes affecting trust structures and asset division.`;
  } else if (promptLower.includes("trust")) {
    return `Irrevocable trust establishment ${locationText} has increased 23.9% year-over-year${netWorthText}, with the highest concentration in coastal regions. 76% of these trusts were created between 12-18 months before formal divorce proceedings.`;
  } else if (promptLower.includes("property") || promptLower.includes("real estate")) {
    return `Luxury property transfers ${locationText} have increased by 15.4%${netWorthText} in the past six months, with 68% involving partial or complete ownership changes to LLCs or family trusts prior to divorce filings.`;
  }
  
  // Default response if no specific keywords match
  return `Analysis of current trends ${locationText}${netWorthText} shows significant patterns worth monitoring. The data suggests a 12.8% change in activity compared to last year, which may indicate shifting behaviors among high-net-worth individuals.`;
}
