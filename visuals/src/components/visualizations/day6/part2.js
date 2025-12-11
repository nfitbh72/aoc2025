import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { CalculatorColumn } from './calculator-column.js';
import { 
  createGridDisplay, 
  calculateColumnPositions, 
  runCalculations,
  delay
} from './shared.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 6 Part 2 visualization
 * Read numbers vertically from columns with operators between them
 */
export default function visualize(container, onComplete) {
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = COMMON_CONFIG.COUNTER_LABEL;
  const fields = PART2_CONFIG.TEST_FIELDS;
  
  let dayTitle = null;
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let calculatorColumns = [];
  let originalGrid = null;
  let transformedGrid = null;
  
  // Create UI components
  dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create original grid display
  originalGrid = createGridDisplay(container, COMMON_CONFIG.TEST_GRID_LINES, {
    top: PART2_CONFIG.TRANSFORMED_GRID_TOP,
    left: PART2_CONFIG.ORIGINAL_GRID_LEFT,
    transform: 'none'
  });
  
  // Create transformed view (showing vertical reading)
  transformedGrid = document.createElement('div');
  transformedGrid.style.cssText = `
    position: absolute;
    top: ${PART2_CONFIG.TRANSFORMED_GRID_TOP};
    left: ${PART2_CONFIG.TRANSFORMED_GRID_LEFT};
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: ${PART2_CONFIG.TRANSFORMED_PADDING};
    background: linear-gradient(135deg, rgba(196, 30, 58, 0.9), rgba(15, 138, 95, 0.9));
    border-radius: ${PART2_CONFIG.TRANSFORMED_BORDER_RADIUS};
    border: 3px solid #ffd700;
    box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2);
    font-family: 'Courier New', monospace;
    font-size: ${PART2_CONFIG.TRANSFORMED_FONT_SIZE};
    color: #ffffff;
    opacity: 0;
    pointer-events: none;
  `;
  
  const transformTitle = document.createElement('div');
  transformTitle.style.cssText = `
    font-size: ${PART2_CONFIG.TRANSFORMED_TITLE_SIZE};
    color: #ffd700;
    font-weight: 600;
    text-align: center;
    margin-bottom: 5px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  `;
  transformTitle.textContent = '🎄 Reading Vertically 🎄';
  transformedGrid.appendChild(transformTitle);
  
  // Show the vertical reading interpretation (right-to-left within field)
  const verticalLines = PART2_CONFIG.VERTICAL_LINES;
  
  verticalLines.forEach(line => {
    const lineEl = document.createElement('div');
    lineEl.style.cssText = `
      white-space: pre;
      padding: 5px;
    `;
    lineEl.textContent = line;
    transformedGrid.appendChild(lineEl);
  });
  
  container.appendChild(transformedGrid);
  
  // Animate transformation
  async function showTransformation() {
    await delay(PART2_CONFIG.TRANSFORMATION_DELAY_MS);
    
    // Fade in transformed grid (keep original visible)
    transformedGrid.style.opacity = '1';
    
    await delay(PART2_CONFIG.TRANSFORMATION_SHOW_MS);
  }
  
  // Create calculator columns (after transformation)
  async function createCalculators() {
    await showTransformation();
    
    const containerWidth = container.clientWidth || 1920;
    const { startX, spacing } = calculateColumnPositions(containerWidth, fields.length, COMMON_CONFIG.COLUMN_WIDTH, COMMON_CONFIG.COLUMN_SPACING);
    const startY = PART2_CONFIG.COLUMN_START_Y;
    
    fields.forEach((field, index) => {
      const column = new CalculatorColumn(
        container,
        field.numbers,
        field.operator,
        startX + index * spacing,
        startY,
        `Field ${index + 1}`
      );
      calculatorColumns.push(column);
    });
    
    // Run calculations
    await runCalculations(calculatorColumns, counterBox);
    
    counterBox.markComplete();
    fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
    
    if (onComplete) {
      onComplete();
    }
  }
  
  createCalculators();
  
  return {
    cleanup: () => {
      if (dayTitle) dayTitle.cleanup();
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (fireworks) fireworks.cleanup();
      
      calculatorColumns.forEach(col => col.cleanup());
      
      if (originalGrid && originalGrid.parentNode) {
        originalGrid.parentNode.removeChild(originalGrid);
      }
      if (transformedGrid && transformedGrid.parentNode) {
        transformedGrid.parentNode.removeChild(transformedGrid);
      }
    }
  };
}
