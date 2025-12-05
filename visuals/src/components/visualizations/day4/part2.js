import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { 
  createSanta, 
  positionSanta, 
  createParticles, 
  createTreeGrid, 
  getAdjacentCount,
  loadDay4Audio 
} from './shared.js';

/**
 * Day 4 Part 2 visualization - Santa Collecting Trees in Rounds
 */
export default function visualize(container, onComplete) {
  loadDay4Audio();
  
  const instructionText = '🎅 Santa collects accessible trees in rounds until none remain!';
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
  let roundLabel = null;
  
  // Create counter and instruction panel
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create round label
  roundLabel = document.createElement('div');
  roundLabel.style.cssText = `
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    color: #ffd700;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  `;
  roundLabel.textContent = 'Round 0';
  container.appendChild(roundLabel);
  
  // Create grid and Santa
  const { gridContainer: gc, grid, cellElements } = createTreeGrid(container, gridData);
  gridContainer = gc;
  santaElement = createSanta(container);
  
  // Find accessible trees in current grid state
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
  
  // Start at top-left
  positionSanta(santaElement, -1, 0, container.clientWidth);
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
      positionSanta(santaElement, x, y, container.clientWidth);
      
      setTimeout(() => {
        // Create particle effect
        createParticles(container, x, y, container.clientWidth);
        
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
      if (fireworks) fireworks.cleanup();
      
      if (roundLabel && roundLabel.parentNode) {
        roundLabel.parentNode.removeChild(roundLabel);
      }
      if (gridContainer && gridContainer.parentNode) {
        gridContainer.parentNode.removeChild(gridContainer);
      }
      if (santaElement && santaElement.parentNode) {
        santaElement.parentNode.removeChild(santaElement);
      }
    }
  };
}
