import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 4 Part 1 visualization - Santa Collecting Christmas Trees
 */
export default function visualize(container, onComplete) {
  audioManager.loadSound('collect', 'ding.mp3');
  
  const instructionText = '🎅 Santa collects trees that have fewer than 4 neighboring trees!';
  const counterLabel = 'Trees Collected';
  
  const gridData = [
    '..@@.@@@@.',
    '@@@.@.@.@@',
    '@@@@@.@.@@',
    '@.@@@@..@.',
    '@@.@@@@.@@',
    '.@@@@@@@.@',
    '.@.@.@.@@@',
    '@.@@@.@@@@',
    '.@@@@@@@@.',
    '@.@.@@@.@.'
  ];
  
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let gridContainer = null;
  let santaElement = null;
  
  // Create counter and instruction panel
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create grid container
  gridContainer = document.createElement('div');
  gridContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(10, 40px);
    gap: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  `;
  container.appendChild(gridContainer);
  
  // Create Santa element
  santaElement = document.createElement('div');
  santaElement.textContent = '🎅';
  santaElement.style.cssText = `
    position: absolute;
    font-size: 30px;
    transition: all 0.3s ease;
    z-index: 100;
    pointer-events: none;
  `;
  container.appendChild(santaElement);
  
  // Parse grid and find accessible trees
  const grid = gridData.map(row => row.split(''));
  const cells = [];
  const accessibleTrees = [];
  
  // Create grid cells
  grid.forEach((row, y) => {
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
        // Check if this tree has < 4 adjacent trees
        const adjacentCount = getAdjacentCount(grid, x, y, '@');
        if (adjacentCount < 4) {
          accessibleTrees.push({ x, y, element: cellElement });
          cellElement.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        }
      } else {
        cellElement.textContent = '·';
        cellElement.style.opacity = '0.3';
      }
      
      gridContainer.appendChild(cellElement);
      cells.push({ x, y, element: cellElement, type: cell });
    });
  });
  
  // Helper function to count adjacent trees
  function getAdjacentCount(grid, x, y, char) {
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
  
  // Position Santa initially
  function positionSanta(x, y) {
    const cellRect = gridContainer.getBoundingClientRect();
    const cellSize = 44; // 40px + 4px gap
    santaElement.style.left = `${cellRect.left + x * cellSize + 5}px`;
    santaElement.style.top = `${cellRect.top + y * cellSize + 5}px`;
  }
  
  // Start at top-left
  positionSanta(-1, 0);
  counterBox.setValue(0);
  
  // Animate Santa collecting trees
  let collectedCount = 0;
  let currentTreeIndex = 0;
  
  function collectNextTree() {
    if (currentTreeIndex >= accessibleTrees.length) {
      // All trees collected!
      setTimeout(() => {
        santaElement.style.opacity = '0';
        counterBox.markComplete();
        fireworks = celebrate(container, 5000);
        
        if (onComplete) {
          onComplete();
        }
      }, 500);
      return;
    }
    
    const tree = accessibleTrees[currentTreeIndex];
    
    // Move Santa to tree
    positionSanta(tree.x, tree.y);
    
    setTimeout(() => {
      // Collect the tree
      tree.element.style.transform = 'scale(0)';
      tree.element.style.opacity = '0';
      collectedCount++;
      counterBox.setValue(collectedCount);
      audioManager.play('collect', 0.3);
      
      currentTreeIndex++;
      setTimeout(collectNextTree, 400);
    }, 300);
  }
  
  // Start collecting after a short delay
  setTimeout(collectNextTree, 1000);
  
  return {
    cleanup: () => {
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (gridContainer && gridContainer.parentNode) {
        gridContainer.parentNode.removeChild(gridContainer);
      }
      if (santaElement && santaElement.parentNode) {
        santaElement.parentNode.removeChild(santaElement);
      }
      if (fireworks) fireworks.cleanup();
    }
  };
}
