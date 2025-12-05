/**
 * Shared utilities for Day 4 visualizations
 */

import { audioManager } from '../../../utils/audio.js';

/**
 * Create and position Santa element
 */
export function createSanta(container) {
  const santaElement = document.createElement('div');
  santaElement.textContent = '🎅';
  santaElement.style.cssText = `
    position: absolute;
    font-size: 30px;
    transition: all 0.3s ease;
    z-index: 100;
    pointer-events: none;
    transform: translate(-50%, -50%);
  `;
  container.appendChild(santaElement);
  return santaElement;
}

/**
 * Position Santa at a grid location (right next to the tree)
 */
export function positionSanta(santaElement, x, y, containerWidth) {
  const cellSize = 40;
  const gridLeft = (containerWidth - 400) / 2;
  const gridTop = 200;
  
  // Position Santa's center right next to the tree (to the right of the cell)
  santaElement.style.left = `${gridLeft + x * cellSize + cellSize + 15}px`;
  santaElement.style.top = `${gridTop + y * cellSize + cellSize / 2}px`;
}

/**
 * Create particle effect at the tree's position
 */
export function createParticles(container, x, y, containerWidth) {
  const cellSize = 40;
  const gridLeft = (containerWidth - 400) / 2;
  const gridTop = 200;
  const centerX = gridLeft + x * cellSize + cellSize / 2;
  const centerY = gridTop + y * cellSize + cellSize / 2;
  
  const particleEmojis = ['✨', '⭐', '🎁', '🔔', '❄️', '💫'];
  
  // Create 12 particles
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: 20px;
      pointer-events: none;
      z-index: 1000;
      transition: all 0.6s ease-out;
      filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
    `;
    container.appendChild(particle);
    
    // Animate particle outward
    setTimeout(() => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      
      particle.style.left = `${centerX + offsetX}px`;
      particle.style.top = `${centerY + offsetY}px`;
      particle.style.opacity = '0';
      particle.style.transform = 'scale(0.3)';
    }, 10);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 650);
  }
}

/**
 * Create the grid of trees
 */
export function createTreeGrid(container, gridData) {
  // Add CSS animations if not already added
  if (!document.getElementById('day4-animations')) {
    const style = document.createElement('style');
    style.id = 'day4-animations';
    style.textContent = `
      @keyframes treeGlow {
        0%, 100% { filter: drop-shadow(0 0 12px rgba(0, 255, 0, 0.8)); }
        50% { filter: drop-shadow(0 0 20px rgba(0, 255, 0, 1)); }
      }
      @keyframes ornamentTwinkle {
        0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 215, 0, 1)); }
        50% { opacity: 0.7; transform: scale(1.3); filter: drop-shadow(0 0 10px rgba(255, 215, 0, 1)); }
      }
      @keyframes gridPulse {
        0%, 100% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.15); }
        50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), inset 0 0 50px rgba(255, 255, 255, 0.25); }
      }
    `;
    document.head.appendChild(style);
  }
  
  const gridContainer = document.createElement('div');
  gridContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(10, 40px);
    grid-gap: 0;
    position: absolute;
    left: 50%;
    top: 150px;
    transform: translateX(-50%);
    padding: 20px;
    background: linear-gradient(135deg, rgba(255, 50, 80, 0.08) 0%, rgba(20, 200, 120, 0.08) 100%);
    border-radius: 15px;
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.15);
    border: 3px solid rgba(255, 215, 0, 0.8);
    animation: gridPulse 3s ease-in-out infinite;
  `;
  container.appendChild(gridContainer);
  
  const grid = gridData.map(row => row.split(''));
  const cellElements = [];
  
  grid.forEach((row, y) => {
    const rowElements = [];
    row.forEach((cell, x) => {
      const cellElement = document.createElement('div');
      cellElement.style.cssText = `
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        transition: all 0.3s ease;
        position: relative;
      `;
      
      if (cell === '@') {
        cellElement.textContent = '🎄';
        // Add festive glow to trees
        cellElement.style.filter = 'drop-shadow(0 0 12px rgba(0, 255, 0, 0.8)) brightness(1.2)';
        cellElement.style.animation = `treeGlow ${2 + Math.random()}s ease-in-out infinite`;
        
        // Random ornaments on some trees
        if (Math.random() > 0.7) {
          const ornament = document.createElement('div');
          ornament.textContent = ['🔴', '🟡', '⭐'][Math.floor(Math.random() * 3)];
          ornament.style.cssText = `
            position: absolute;
            font-size: 12px;
            top: ${5 + Math.random() * 15}px;
            left: ${10 + Math.random() * 15}px;
            animation: ornamentTwinkle ${1 + Math.random()}s ease-in-out infinite;
          `;
          cellElement.appendChild(ornament);
        }
      } else {
        cellElement.textContent = '❄️';
        cellElement.style.opacity = '0.4';
        cellElement.style.fontSize = '16px';
        cellElement.style.filter = 'drop-shadow(0 0 3px rgba(150, 200, 255, 0.6))';
      }
      
      gridContainer.appendChild(cellElement);
      rowElements.push(cellElement);
    });
    cellElements.push(rowElements);
  });
  
  return { gridContainer, grid, cellElements };
}

/**
 * Count adjacent matching characters in grid
 */
export function getAdjacentCount(grid, x, y, char) {
  let count = 0;
  const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
  ];
  
  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;
    if (newY >= 0 && newY < grid.length && newX >= 0 && newX < grid[0].length) {
      if (grid[newY][newX] === char) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Load audio assets for Day 4
 */
export async function loadDay4Audio() {
  await audioManager.loadSound('collect', 'pop.mp3');
}
