
// Helper functions for the interactive map

/**
 * Determine opportunity color based on value
 */
export function getOpportunityColor(value: number): string {
  if (value >= 10) {
    return "#7f1d1d"; // Dark red for high opportunity ($10M+)
  } else if (value >= 1) {
    return "#b91c1c"; // Medium red for medium opportunity ($1M-$9.9M)
  } else {
    return "#ef4444"; // Light red for low opportunity (<$1M)
  }
}

/**
 * Determine opportunity category based on value
 */
export function getOpportunityCategory(value: number): 'Low' | 'Medium' | 'High' {
  if (value >= 10) {
    return 'High';
  } else if (value >= 1) {
    return 'Medium';
  } else {
    return 'Low';
  }
}
