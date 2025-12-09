import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { CalculatorColumn } from './calculator-column.js';
import { 
  GRID_LINES, 
  createGridDisplay, 
  calculateColumnPositions, 
  runCalculations 
} from './shared.js';

/**
 * Day 6 Part 1 visualization
 * Parse columns of numbers with operators at the bottom
 */
export default function visualize(container, onComplete) {
  const instructionText = '🎄 Calculate each column using the operator at the bottom!';
  const counterLabel = 'Total Sum';
  
  // Test input data - reading columns from top to bottom
  const columns = [
    { numbers: [123, 45, 6], operator: 2 },    // * (multiply)
    { numbers: [328, 64, 98], operator: 0 },   // + (add)
    { numbers: [51, 387, 215], operator: 2 },  // * (multiply)
    { numbers: [64, 23, 314], operator: 0 }    // + (add)
  ];
  
  let dayTitle = null;
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let calculatorColumns = [];
  
  // Create UI components
  dayTitle = new DayTitle(container, 6, 1);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create visual grid display at the top
  const gridDisplay = createGridDisplay(container, GRID_LINES);
  
  // Create calculator columns
  const containerWidth = container.clientWidth || 1920;
  const { startX, spacing } = calculateColumnPositions(containerWidth, columns.length);
  const startY = 280;
  
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
    fireworks = celebrate(container, 5000);
    
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
