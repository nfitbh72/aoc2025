import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { CalculatorColumn } from './calculator-column.js';
import { 
  createGridDisplay, 
  calculateColumnPositions, 
  runCalculations 
} from './shared.js';
import { COMMON_CONFIG, PART1_CONFIG } from './config.js';

/**
 * Day 6 Part 1 visualization
 * Parse columns of numbers with operators at the bottom
 */
export default function visualize(container, onComplete) {
  const instructionText = PART1_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = COMMON_CONFIG.COUNTER_LABEL;
  const columns = PART1_CONFIG.TEST_COLUMNS;
  
  let dayTitle = null;
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let calculatorColumns = [];
  
  // Create UI components
  dayTitle = new DayTitle(container, PART1_CONFIG.DAY_NUMBER, PART1_CONFIG.PART_NUMBER);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create visual grid display at the top
  const gridDisplay = createGridDisplay(container, COMMON_CONFIG.TEST_GRID_LINES);
  
  // Create calculator columns
  const containerWidth = container.clientWidth || 1920;
  const { startX, spacing } = calculateColumnPositions(containerWidth, columns.length, COMMON_CONFIG.COLUMN_WIDTH, COMMON_CONFIG.COLUMN_SPACING);
  const startY = COMMON_CONFIG.COLUMN_START_Y;
  
  columns.forEach((col, index) => {
    const column = new CalculatorColumn(
      container,
      col.numbers,
      col.operator,
      startX + index * spacing,
      startY,
      `Column ${index + 1}`
    );
    calculatorColumns.push(column);
  });
  
  // Animate calculations sequentially
  async function calculateColumns() {
    await runCalculations(calculatorColumns, counterBox);
    
    counterBox.markComplete();
    fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
    
    if (onComplete) {
      onComplete();
    }
  }
  
  calculateColumns();
  
  return {
    cleanup: () => {
      if (dayTitle) dayTitle.cleanup();
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (fireworks) fireworks.cleanup();
      
      calculatorColumns.forEach(col => col.cleanup());
      
      if (gridDisplay && gridDisplay.parentNode) {
        gridDisplay.parentNode.removeChild(gridDisplay);
      }
    }
  };
}
