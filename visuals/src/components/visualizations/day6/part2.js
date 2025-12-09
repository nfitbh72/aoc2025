import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { CalculatorColumn } from './calculator-column.js';
import { 
  GRID_LINES, 
  createGridDisplay, 
  calculateColumnPositions, 
  runCalculations,
  delay
} from './shared.js';

/**
 * Day 6 Part 2 visualization
 * Read numbers vertically from columns with operators between them
 */
export default function visualize(container, onComplete) {
  const instructionText = '🎁 Now read the numbers VERTICALLY and calculate!';
  const counterLabel = 'Total Sum';
  
  // Part 2: Read vertically (right-to-left within each field, top-to-bottom across rows)
  // Fields are separated by operators in the last row
  const fields = [
    { numbers: [356, 24, 1], operator: 2 },      // * (multiply) = 8544
    { numbers: [8, 248, 369], operator: 0 },     // + (add) = 625
    { numbers: [175, 581, 32], operator: 2 },    // * (multiply) = 3253600
    { numbers: [4, 431, 623], operator: 0 }      // + (add) = 1058
  ];
  // Total: 3,263,827
  
  let dayTitle = null;
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let calculatorColumns = [];
  let originalGrid = null;
  let transformedGrid = null;
  
  // Create UI components
  dayTitle = new DayTitle(container, 6, 2);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create original grid display
  originalGrid = createGridDisplay(container, GRID_LINES, {
    top: '100px',
    left: '30%',
    transform: 'none'
  });
  
  // Create transformed view (showing vertical reading)
  transformedGrid = document.createElement('div');
  transformedGrid.style.cssText = `
    position: absolute;
    top: 100px;
    left: 52%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 15px 20px;
    background: rgba(30, 50, 70, 0.9);
    border-radius: 15px;
    border: 2px solid rgba(100, 200, 255, 0.5);
    font-family: 'Courier New', monospace;
    font-size: 15px;
    color: #94a3b8;
    opacity: 0;
    pointer-events: none;
  `;
  
  const transformTitle = document.createElement('div');
  transformTitle.style.cssText = `
    font-size: 14px;
    color: #60a5fa;
    font-weight: 600;
    text-align: center;
    margin-bottom: 5px;
  `;
  transformTitle.textContent = '📖 Reading Vertically:';
  transformedGrid.appendChild(transformTitle);
  
  // Show the vertical reading interpretation (right-to-left within field)
  const verticalLines = [
    'Field 1: 3→5→6, 2→4, 1  (×) = 8,544',
    'Field 2: 8, 2→4→8, 3→6→9  (+) = 625',
    'Field 3: 1→7→5, 5→8→1, 3→2  (×) = 3,253,600',
    'Field 4: 4, 4→3→1, 6→2→3  (+) = 1,058'
  ];
  
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
    await delay(1000);
    
    // Fade in transformed grid (keep original visible)
    transformedGrid.style.opacity = '1';
    
    await delay(2000);
  }
  
  // Create calculator columns (after transformation)
  async function createCalculators() {
    await showTransformation();
    
    const containerWidth = container.clientWidth || 1920;
    const { startX, spacing } = calculateColumnPositions(containerWidth, fields.length);
    const startY = 320;
    
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
    fireworks = celebrate(container, 5000);
    
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
