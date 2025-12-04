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
 * Day 4 Part 1 visualization - Santa Collecting Christmas Trees
 */
export default function visualize(container, onComplete) {
  loadDay4Audio();
  
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
  
  // Create grid and Santa
  const { gridContainer: gc, grid, cellElements } = createTreeGrid(container, gridData);
  gridContainer = gc;
  santaElement = createSanta(container);
  
  // Find accessible trees (those with < 4 adjacent trees)
  const accessibleTrees = [];
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '@' && getAdjacentCount(grid, x, y, '@') < 4) {
        accessibleTrees.push({ x, y, element: cellElements[y][x] });
        cellElements[y][x].style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
      }
    });
  });
  
  // Start at top-left
  positionSanta(santaElement, -1, 0, container.clientWidth);
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
    positionSanta(santaElement, tree.x, tree.y, container.clientWidth);
    
    setTimeout(() => {
      // Create particle effect at the tree's position
      createParticles(container, tree.x, tree.y, container.clientWidth);
      
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
      if (fireworks) fireworks.cleanup();
      
      if (gridContainer && gridContainer.parentNode) {
        gridContainer.parentNode.removeChild(gridContainer);
      }
      if (santaElement && santaElement.parentNode) {
        santaElement.parentNode.removeChild(santaElement);
      }
    }
  };
}
