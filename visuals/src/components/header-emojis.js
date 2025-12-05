/**
 * Initialize jiggling emojis in the header
 */
export function initializeHeaderEmojis() {
  const header = document.getElementById('header');
  if (!header) return;

  // Top row emojis
  const topEmojis = ['❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄'];
  
  // Bottom row emojis
  const bottomEmojis = ['🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔'];

  // Create top row container
  const topRow = document.createElement('div');
  topRow.style.cssText = `
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    opacity: 0.6;
    height: 20px;
    pointer-events: none;
  `;

  // Create bottom row container
  const bottomRow = document.createElement('div');
  bottomRow.style.cssText = `
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    opacity: 0.7;
    height: 20px;
    pointer-events: none;
  `;

  // Animation patterns (pseudo-random but consistent)
  const animations = ['jiggle1', 'jiggle2', 'jiggle3'];
  const durations = [1.8, 2.2, 2.5];
  
  // Add top emojis with jiggling
  topEmojis.forEach((emoji, index) => {
    const span = document.createElement('span');
    span.className = 'header-emoji';
    span.textContent = emoji;
    
    // Use index to create pseudo-random but consistent pattern
    const animIndex = index % 3;
    const delay = (index * 0.15) % 2;
    
    span.style.animation = `${animations[animIndex]} ${durations[animIndex]}s ease-in-out infinite ${delay}s`;
    topRow.appendChild(span);
  });

  // Add bottom emojis with jiggling
  bottomEmojis.forEach((emoji, index) => {
    const span = document.createElement('span');
    span.className = 'header-emoji';
    span.textContent = emoji;
    
    // Use different offset for bottom row to create variety
    const animIndex = (index + 1) % 3;
    const delay = ((index * 0.18) + 0.5) % 2;
    
    span.style.animation = `${animations[animIndex]} ${durations[animIndex]}s ease-in-out infinite ${delay}s`;
    bottomRow.appendChild(span);
  });

  header.appendChild(topRow);
  header.appendChild(bottomRow);
}
