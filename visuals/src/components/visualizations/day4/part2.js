import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 4 Part 2 visualization - Santa Collecting Trees in Rounds
 */
export default function visualize(container, onComplete) {
  audioManager.loadSound('collect', 'ding.mp3');
  
  const instructionText = '🎅 Santa keeps collecting accessible trees until none remain!';
  const counterLabel = 'Total Trees Collected';
  
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
  let roundLabel = null;
  
  // Create counter and instruction panel
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create round label
  roundLabel = document.createElement('div');
  roundLabel.style.cssText = `
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  `;
  container.appendChild(roundLabel);
  
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
  
  // Parse grid
  const grid = gridData.map(row => row.split(''));
  const cellElements = [];
  
  // Create grid cells
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
  
  // Find accessible trees
  function findAccessibleTrees(grid) {
    const accessible = [];
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === '@' && getAdjacentCount(grid, x, y, '@') < 4) {
          accessible.push({ x, y });
        }
      });
    });
    return accessible;
  }
  
  // Position Santa
  function positionSanta(x, y) {
    const cellRect = gridContainer.getBoundingClientRect();
    const cellSize = 44; // 40px + 4px gap
    santaElement.style.left = `${cellRect.left + x * cellSize + 5}px`;
    santaElement.style.top = `${cellRect.top + y * cellSize + 5}px`;
  }
  
  // Start at top-left
  positionSanta(-1, 0);
  counterBox.setValue(0);
  
  let totalCollected = 0;
  let currentRound = 0;
  
  function processRound() {
    currentRound++;
    roundLabel.textContent = `Round ${currentRound}`;
    
    const accessibleTrees = findAccessibleTrees(grid);
    
    if (accessibleTrees.length === 0) {
      // No more trees to collect!
      setTimeout(() => {
        roundLabel.textContent = `Complete! ${currentRound - 1} rounds`;
        santaElement.style.opacity = '0';
        counterBox.markComplete();
        fireworks = celebrate(container, 5000);
        
        if (onComplete) {
          onComplete();
        }
      }, 500);
      return;
    }
    
    // Highlight accessible trees
    accessibleTrees.forEach(({ x, y }) => {
      cellElements[y][x].style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
    });
    
    let treeIndex = 0;
    
    function collectNextTree() {
      if (treeIndex >= accessibleTrees.length) {
        // Round complete, start next round
        setTimeout(() => processRound(), 800);
        return;
      }
      
      const { x, y } = accessibleTrees[treeIndex];
      
      // Move Santa to tree
      positionSanta(x, y);
      
      setTimeout(() => {
        // Collect the tree
        cellElements[y][x].style.transform = 'scale(0)';
        cellElements[y][x].style.opacity = '0';
        cellElements[y][x].textContent = '·';
        grid[y][x] = '.';
        
        totalCollected++;
        counterBox.setValue(totalCollected);
        audioManager.play('collect', 0.3);
        
        treeIndex++;
        setTimeout(collectNextTree, 300);
      }, 250);
    }
    
    setTimeout(collectNextTree, 500);
  }
  
  // Start first round after a short delay
  setTimeout(() => processRound(), 1000);
  
  return {
    cleanup: () => {
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (roundLabel && roundLabel.parentNode) {
        roundLabel.parentNode.removeChild(roundLabel);
      }
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
