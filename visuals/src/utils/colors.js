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
  '#f1c40f', // yellow
  '#e74c3c', // red
  '#ecf0f1', // white
  '#95a5a6', // silver
  '#f39c12', // gold
  '#3498db', // blue
  '#e67e22', // orange
  '#1abc9c', // turquoise
  '#9b59b6', // purple
  '#27ae60', // green
  '#c0392b', // dark red
  '#d35400'  // dark orange
];

export function getRandomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}
