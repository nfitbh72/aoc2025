// Christmas color palettes
export const boxColors = [
  '#e74c3c', // red
  '#27ae60', // green
  '#3498db', // blue
  '#f39c12', // orange
  '#9b59b6', // purple
  '#e67e22', // dark orange
  '#1abc9c', // turquoise
  '#c0392b', // dark red
  '#16a085', // dark turquoise
  '#d35400', // pumpkin
  '#8e44ad', // dark purple
  '#2980b9'  // dark blue
];

export const ribbonColors = [
  '#ffd700', // gold
  '#f1c40f', // yellow
  '#ff1493', // deep pink
  '#ff69b4', // hot pink
  '#00ced1', // dark turquoise
  '#ff6347', // tomato red
  '#4169e1', // royal blue
  '#32cd32', // lime green
  '#ff8c00', // dark orange
  '#9370db', // medium purple
  '#20b2aa', // light sea green
  '#ff4500', // orange red
];

export function getRandomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get a contrasting ribbon color for a given box color
 * Ensures ribbon is visually distinct from box
 */
export function getContrastingRibbon(boxColor) {
  // Map box colors to incompatible ribbon colors
  const incompatiblePairs = {
    '#e74c3c': ['#ff6347', '#ff4500'], // red box - no red ribbons
    '#27ae60': ['#32cd32', '#20b2aa'], // green box - no green ribbons
    '#3498db': ['#4169e1', '#00ced1'], // blue box - no blue ribbons
    '#f39c12': ['#ffd700', '#f1c40f', '#ff8c00'], // orange box - no yellow/orange ribbons
    '#9b59b6': ['#9370db', '#ff1493'], // purple box - no purple/pink ribbons
    '#e67e22': ['#ff8c00', '#ff4500', '#ffd700'], // dark orange - no orange/yellow
    '#1abc9c': ['#00ced1', '#20b2aa', '#32cd32'], // turquoise - no turquoise/green
    '#c0392b': ['#ff6347', '#ff4500'], // dark red - no red ribbons
    '#16a085': ['#00ced1', '#20b2aa'], // dark turquoise - no turquoise
    '#d35400': ['#ff8c00', '#ff4500'], // pumpkin - no orange
    '#8e44ad': ['#9370db', '#ff1493'], // dark purple - no purple
    '#2980b9': ['#4169e1', '#00ced1'], // dark blue - no blue
  };
  
  const incompatible = incompatiblePairs[boxColor] || [];
  const availableRibbons = ribbonColors.filter(color => !incompatible.includes(color));
  
  return availableRibbons[Math.floor(Math.random() * availableRibbons.length)];
}
