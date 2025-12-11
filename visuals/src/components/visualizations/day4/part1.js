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
import { COMMON_CONFIG, PART1_CONFIG } from './config.js';

/**
 * Day 4 Part 1 visualization - Santa Collecting Christmas Trees
 */
export default function visualize(container, onComplete) {
  loadDay4Audio();
  
  const instructionText = PART1_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = COMMON_CONFIG.COUNTER_LABEL;
  const gridData = COMMON_CONFIG.TEST_GRID_DATA;
  
  let counterBox = null;
  let instructionPanel = null;
  let dayTitle = null;
  let fireworks = null;
  let gridContainer = null;
  let santaElement = null;
  let bucketInfo = null;
  
  // Create title, counter and instruction panel
  dayTitle = new DayTitle(container, PART1_CONFIG.DAY_NUMBER, PART1_CONFIG.PART_NUMBER);
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
      if (cell === COMMON_CONFIG.TREE_SYMBOL && getAdjacentCount(grid, x, y, COMMON_CONFIG.TREE_SYMBOL) < COMMON_CONFIG.MAX_ADJACENT_TREES) {
        accessibleTrees.push({ x, y, element: cellElements[y][x] });
        cellElements[y][x].style.boxShadow = COMMON_CONFIG.ACCESSIBLE_TREE_BOX_SHADOW;
        cellElements[y][x].style.transform = `scale(${COMMON_CONFIG.ACCESSIBLE_TREE_SCALE})`;
        cellElements[y][x].style.filter = `brightness(${COMMON_CONFIG.ACCESSIBLE_TREE_BRIGHTNESS})`;
      }
    });
  });
  
  // Start at top-left
  positionSanta(santaElement, COMMON_CONFIG.SANTA_START_X, COMMON_CONFIG.SANTA_START_Y, container.clientWidth);
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
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
        
        if (onComplete) {
          onComplete();
        }
      }, COMMON_CONFIG.COMPLETION_DELAY_MS);
      return;
    }
    
    const tree = accessibleTrees[currentTreeIndex];
    
    // Move Santa to tree
    positionSanta(santaElement, tree.x, tree.y, container.clientWidth);
    
    setTimeout(() => {
      // Santa throws tree to bucket (async - doesn't block Santa)
      throwTreeToBucket(container, tree, bucketInfo, () => {
        // Counter increments when tree lands in bucket
        collectedCount++;
        counterBox.setValue(collectedCount);
      });
      
      // Santa moves on immediately to next tree
      currentTreeIndex++;
      setTimeout(collectNextTree, COMMON_CONFIG.SANTA_MOVE_DELAY_MS);
    }, COMMON_CONFIG.SANTA_MOVE_DELAY_MS);
  }
  
  // Start collecting after a short delay
  setTimeout(collectNextTree, COMMON_CONFIG.START_DELAY_MS);
  
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
