import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { GridRenderer, parseInput, calculateArea, getGridBounds, COLORS, EMOJIS } from './common.js';
import { COMMON_CONFIG, PART1_CONFIG } from './config.js';

/**
 * Day 9 Part 1 visualization - Finding the largest rectangle between gift boxes
 */
export default function visualize(container, onComplete) {
  const instructionText = PART1_CONFIG.INSTRUCTION_TEXT;
  
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let gridRenderer = null;
  let animationFrame = null;
  
  // Test input
  const input = PART1_CONFIG.TEST_INPUT;
  
  const points = parseInput(input);
  const { maxX, maxY } = getGridBounds(points);
  
  // Create UI components with initial label
  counterBox = new CounterBox(container, 'Current Rectangle Area');
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create grid renderer with larger cell size
  const cellSize = Math.min(COMMON_CONFIG.MAX_CELL_SIZE, Math.floor(COMMON_CONFIG.BASE_CANVAS_SIZE / Math.max(maxX, maxY)));
  gridRenderer = new GridRenderer(container, maxX + COMMON_CONFIG.GRID_PADDING, maxY + COMMON_CONFIG.GRID_PADDING, cellSize);
  
  let currentPair = 0;
  let maxArea = 0;
  let bestPair = null;
  const totalPairs = points.length * (points.length - 1) / 2;
  
  // Animation state
  let phase = 'drawing'; // drawing, checking, celebrating, complete
  let checkIndex = 0;
  let frameCounter = 0;
  const framesPerCheck = COMMON_CONFIG.FRAMES_PER_CHECK;
  let celebrationFrame = 0;
  const pairs = [];
  
  // Generate all pairs
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      pairs.push([i, j]);
    }
  }
  
  function animate() {
    gridRenderer.clear();
    gridRenderer.drawSnowflakes();
    gridRenderer.drawGrid();
    
    // Draw all gift boxes
    points.forEach((p, idx) => {
      gridRenderer.drawPoint(p.x, p.y, PART1_CONFIG.GIFT_BOX_COLOR, PART1_CONFIG.GIFT_EMOJI);
    });
    
    if (phase === 'checking' && checkIndex < pairs.length) {
      const [i, j] = pairs[checkIndex];
      const p1 = points[i];
      const p2 = points[j];
      const area = calculateArea(p1, p2);
      
      // Draw current rectangle being checked
      gridRenderer.drawRectangle(
        p1.x, p1.y, p2.x, p2.y,
        PART1_CONFIG.CHECKING_RECT_COLOR,
        PART1_CONFIG.CHECKING_RECT_STROKE
      );
      
      // Highlight the two points
      gridRenderer.drawPoint(p1.x, p1.y, PART1_CONFIG.CHECKING_RECT_STROKE, PART1_CONFIG.CHECKING_EMOJI);
      gridRenderer.drawPoint(p2.x, p2.y, PART1_CONFIG.CHECKING_RECT_STROKE, PART1_CONFIG.CHECKING_EMOJI);
      
      // Update counter to show the current rectangle's area
      counterBox.setValue(area);
      
      if (area > maxArea) {
        maxArea = area;
        bestPair = [i, j];
      }
      
      // Only advance every N frames for slower animation
      frameCounter++;
      if (frameCounter >= framesPerCheck) {
        frameCounter = 0;
        checkIndex++;
      }
      
      if (checkIndex >= pairs.length) {
        phase = 'celebrating';
        celebrationFrame = 0;
        // Update label and value to show the final largest area
        counterBox.setLabel(PART1_CONFIG.COUNTER_LABEL);
        counterBox.setValue(maxArea);
      }
    } else if (phase === 'celebrating' && bestPair) {
      // Animate the winning rectangle with pulsing effect
      const [i, j] = bestPair;
      const p1 = points[i];
      const p2 = points[j];
      
      // Draw pulsing green rectangle using common method
      gridRenderer.drawPulsingRectangle(p1.x, p1.y, p2.x, p2.y, celebrationFrame, PART1_CONFIG.WINNING_RECT_STROKE);
      
      // Highlight winning points with trees
      gridRenderer.drawPoint(p1.x, p1.y, PART1_CONFIG.WINNING_RECT_STROKE, PART1_CONFIG.WINNING_EMOJI);
      gridRenderer.drawPoint(p2.x, p2.y, PART1_CONFIG.WINNING_RECT_STROKE, PART1_CONFIG.WINNING_EMOJI);
      
      celebrationFrame++;
      
      // After celebration frames, move to complete
      if (celebrationFrame >= COMMON_CONFIG.CELEBRATION_FRAMES) {
        phase = 'complete';
      }
    } else if (phase === 'complete' && bestPair) {
      // Draw final static winning rectangle
      const [i, j] = bestPair;
      const p1 = points[i];
      const p2 = points[j];
      
      gridRenderer.drawRectangle(
        p1.x, p1.y, p2.x, p2.y,
        PART1_CONFIG.WINNING_RECT_COLOR,
        PART1_CONFIG.WINNING_RECT_STROKE
      );
      
      // Highlight winning points with trees
      gridRenderer.drawPoint(p1.x, p1.y, PART1_CONFIG.WINNING_RECT_STROKE, PART1_CONFIG.WINNING_EMOJI);
      gridRenderer.drawPoint(p2.x, p2.y, PART1_CONFIG.WINNING_RECT_STROKE, PART1_CONFIG.WINNING_EMOJI);
    }
    
    if (phase !== 'complete') {
      animationFrame = requestAnimationFrame(animate);
    } else if (phase === 'complete' && !fireworks) {
      counterBox.markComplete();
      fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
      if (onComplete) {
        setTimeout(onComplete, COMMON_CONFIG.COMPLETION_CALLBACK_DELAY_MS);
      }
    }
  }
  
  // Start animation after a brief delay
  setTimeout(() => {
    phase = 'checking';
    animate();
  }, COMMON_CONFIG.INITIAL_DELAY_MS);
  
  return {
    cleanup: () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (fireworks) fireworks.cleanup();
      if (gridRenderer) gridRenderer.cleanup();
    }
  };
}
