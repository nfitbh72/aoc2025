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
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 4 Part 2 visualization - Santa Collecting Trees in Rounds
 */
export default function visualize(container, onComplete) {
  loadDay4Audio();
  
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = COMMON_CONFIG.COUNTER_LABEL;
  const gridData = COMMON_CONFIG.TEST_GRID_DATA;
  
  let counterBox = null;
  let instructionPanel = null;
  let dayTitle = null;
  let fireworks = null;
  let gridContainer = null;
  let santaElement = null;
  let roundLabel = null;
  let bucketInfo = null;
  
  // Create title, counter and instruction panel
  dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create round label
  roundLabel = document.createElement('div');
  roundLabel.style.cssText = `
    position: absolute;
    top: ${PART2_CONFIG.ROUND_LABEL_TOP};
    left: 50%;
    transform: translateX(-50%);
    font-size: ${PART2_CONFIG.ROUND_LABEL_FONT_SIZE};
    color: ${PART2_CONFIG.ROUND_LABEL_COLOR};
    font-weight: bold;
    text-shadow: ${PART2_CONFIG.ROUND_LABEL_TEXT_SHADOW};
  `;
  roundLabel.textContent = `${PART2_CONFIG.ROUND_LABEL_PREFIX} 0`;
  container.appendChild(roundLabel);
  
  // Create grid, Santa, and bucket
  const { gridContainer: gc, grid, cellElements } = createTreeGrid(container, gridData);
  gridContainer = gc;
  santaElement = createSanta(container);
  bucketInfo = createBucket(container);
  
  // Find accessible trees in current grid state
  function findAccessibleTrees(grid) {
    const accessible = [];
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === COMMON_CONFIG.TREE_SYMBOL && getAdjacentCount(grid, x, y, COMMON_CONFIG.TREE_SYMBOL) < COMMON_CONFIG.MAX_ADJACENT_TREES) {
          accessible.push({ x, y });
        }
      });
    });
    return accessible;
  }
  
  // Start at top-left
  positionSanta(santaElement, COMMON_CONFIG.SANTA_START_X, COMMON_CONFIG.SANTA_START_Y, container.clientWidth);
  counterBox.setValue(0);
  
  let totalCollected = 0;
  let currentRound = 0;
  
  function processRound() {
    currentRound++;
    roundLabel.textContent = `${PART2_CONFIG.ROUND_LABEL_PREFIX} ${currentRound}`;
    
    const accessibleTrees = findAccessibleTrees(grid);
    
    if (accessibleTrees.length === 0) {
      // No more trees to collect!
      setTimeout(() => {
        roundLabel.textContent = `${PART2_CONFIG.ROUND_COMPLETE_TEXT} ${currentRound - 1} ${PART2_CONFIG.ROUND_COMPLETE_SUFFIX}`;
        santaElement.style.opacity = '0';
        counterBox.markComplete();
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
        
        if (onComplete) {
          onComplete();
        }
      }, COMMON_CONFIG.COMPLETION_DELAY_MS);
      return;
    }
    
    // Highlight accessible trees
    accessibleTrees.forEach(({ x, y }) => {
      cellElements[y][x].style.boxShadow = PART2_CONFIG.HIGHLIGHTED_TREE_BOX_SHADOW;
    });
    
    let treeIndex = 0;
    
    function collectNextTree() {
      if (treeIndex >= accessibleTrees.length) {
        // Round complete, start next round
        setTimeout(() => processRound(), PART2_CONFIG.ROUND_COMPLETE_DELAY_MS);
        return;
      }
      
      const { x, y } = accessibleTrees[treeIndex];
      const tree = { x, y, element: cellElements[y][x] };
      
      // Move Santa to tree
      positionSanta(santaElement, x, y, container.clientWidth);
      
      setTimeout(() => {
        // Update grid state
        cellElements[y][x].textContent = COMMON_CONFIG.EMPTY_DISPLAY;
        grid[y][x] = COMMON_CONFIG.EMPTY_SYMBOL;
        
        // Santa throws tree to bucket (async - doesn't block Santa)
        throwTreeToBucket(container, tree, bucketInfo, () => {
          // Counter increments when tree lands in bucket
          totalCollected++;
          counterBox.setValue(totalCollected);
        });
        
        // Santa moves on immediately to next tree
        treeIndex++;
        setTimeout(collectNextTree, PART2_CONFIG.TREE_COLLECT_DELAY_MS);
      }, PART2_CONFIG.TREE_COLLECT_DELAY_MS);
    }
    
    setTimeout(collectNextTree, PART2_CONFIG.ROUND_START_DELAY_MS);
  }
  
  // Start first round after a short delay
  setTimeout(() => processRound(), COMMON_CONFIG.START_DELAY_MS);
  
  return {
    cleanup: () => {
      if (dayTitle) dayTitle.cleanup();
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
      if (bucketInfo && bucketInfo.bucketContainer && bucketInfo.bucketContainer.parentNode) {
        bucketInfo.bucketContainer.parentNode.removeChild(bucketInfo.bucketContainer);
      }
    }
  };
}
