import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { 
  createSanta, 
  positionSanta, 
  createParticles, 
  createTreeGrid, 
  getAdjacentCount,
  loadDay4Audio,
  createBucket,
  throwTreeToBucket
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
  let dayTitle = null;
  let fireworks = null;
  let gridContainer = null;
  let santaElement = null;
  let bucketInfo = null;
  
  // Create title, counter and instruction panel
  dayTitle = new DayTitle(container, 4, 1);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create grid, Santa, and bucket
  const { gridContainer: gc, grid, cellElements } = createTreeGrid(container, gridData);
  gridContainer = gc;
  santaElement = createSanta(container);
  bucketInfo = createBucket(container);
  
  // Find accessible trees (those with < 4 adjacent trees)
  const accessibleTrees = [];
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '@' && getAdjacentCount(grid, x, y, '@') < 4) {
        accessibleTrees.push({ x, y, element: cellElements[y][x] });
        cellElements[y][x].style.boxShadow = '0 0 20px rgba(255, 215, 0, 1), 0 0 35px rgba(255, 50, 50, 0.8)';
        cellElements[y][x].style.transform = 'scale(1.15)';
        cellElements[y][x].style.filter = 'brightness(1.3)';
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
      // Santa throws tree to bucket
      throwTreeToBucket(container, tree, bucketInfo, () => {
        // Counter increments when tree lands in bucket
        collectedCount++;
        counterBox.setValue(collectedCount);
      });
      
      currentTreeIndex++;
      setTimeout(collectNextTree, 1400);
    }, 300);
  }
  
  // Start collecting after a short delay
  setTimeout(collectNextTree, 1000);
  
  return {
    cleanup: () => {
      if (dayTitle) dayTitle.cleanup();
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (fireworks) fireworks.cleanup();
      
      if (gridContainer && gridContainer.parentNode) {
        gridContainer.parentNode.removeChild(gridContainer);
      }
      if (santaElement && santaElement.parentNode) {
        santaElement.parentNode.removeChild(santaElement);
      }
      if (bucketInfo && bucketInfo.bucketContainer && bucketInfo.bucketContainer.parentNode) {
        bucketInfo.bucketContainer.parentNode.removeChild(bucketInfo.bucketContainer);
      }
    }
  };
}
