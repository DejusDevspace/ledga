/**
 * Brutalist-inspired vibrant color palette.
 * Creative, dynamic, and avoids overly "dark" or "hard" colors while remaining bold.
 */
const PALETTE = [
  "#FF7ED4", // Neon Pink
  "#AF7EEB", // Vibrant Lavender
  "#5ECFFF", // Sky Blue
  "#7AFF64", // Lime Green
  "#FFE15D", // Sunny Yellow
  "#FF914D", // Soft Orange
  "#2EC4B6", // Bright Teal
  "#F15BB5", // Hot Pink
  "#00BBF9", // Deep Sky Blue
  "#00F5D4", // Aquamarine
  "#9B5DE5", // Amethyst
  "#FEE440", // Electric Yellow
  "#FB8500", // Tangerine
  "#38B6FF", // Azure
  "#4CC9F0", // Cyan
  "#F72585", // Rose
  "#ADFF2F", // Green-Yellow
  "#39D353", // Leaf Green
  "#FF5757", // Coral Red
  "#48CAE4", // Light Blue
  "#00C2FF", // Vivid Blue
  "#FFCF00", // Golden Yellow
  "#00FF9C", // Spring Green
  "#9D00FF", // Neon Purple
  "#FF3131", // Candy Red
  "#70D6FF", // Pale Cyan
  "#AF7EEB", // Soft Purple
  "#ADFF2F", // Chartreuse
  "#57CC99", // Sea Green
  "#FF006E", // Magenta
];

/**
 * Simple hash function to turn a string into a number.
 * Used for stable color mapping across sessions.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Returns a stable, vibrant color for a given category name.
 */
export function getCategoryColor(category: string): string {
  if (!category) return "#A0A8B8"; // Fallback color
  const index = hashString(category) % PALETTE.length;
  return PALETTE[index];
}

/**
 * Returns a semi-transparent version of the category color for backgrounds.
 */
export function getCategoryColorRGBA(category: string, opacity: number = 0.2): string {
  const hex = getCategoryColor(category);
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
