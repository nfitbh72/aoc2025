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
  
  // Create 12 particles
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.textContent = '✨';
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: 20px;
      pointer-events: none;
      z-index: 1000;
      transition: all 0.6s ease-out;
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
  const gridContainer = document.createElement('div');
  gridContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(10, 40px);
    grid-gap: 0;
    position: absolute;
    left: 50%;
    top: 200px;
    transform: translateX(-50%);
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
        background: rgba(255, 255, 255, 0.05);
        border-radius: 5px;
        transition: all 0.3s ease;
      `;
      
      if (cell === '@') {
        cellElement.textContent = '🎄';
      } else {
        cellElement.textContent = '·';
        cellElement.style.opacity = '0.3';
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
