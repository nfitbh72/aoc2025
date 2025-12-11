import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG } from './config.js';

/**
 * Shared utilities for Day 6 visualizations
 */

/**
 * Delay utility
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Animate counter from current value to target
 */
export function animateCounterTo(counter, target, duration) {
  return new Promise(resolve => {
    const start = parseInt(counter.counterValueElement.textContent.replace(/,/g, '')) || 0;
    const startTime = Date.now();
    
    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);
      counter.setValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    }
    
    update();
  });
}

/**
 * Load audio for day 6
 */
export async function loadDay6Audio() {
  try {
    await audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.SOUND_FILE_DING);
  } catch (e) {
    console.log('Failed to load ding sound:', e);
  }
}

/**
 * Create grid display element with animated lines
 */
export function createGridDisplay(container, gridLines, styles = {}) {
  const gridDisplay = document.createElement('div');
  const defaultStyles = {
    position: 'absolute',
    top: COMMON_CONFIG.GRID_TOP,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: COMMON_CONFIG.GRID_GAP,
    padding: COMMON_CONFIG.GRID_PADDING,
    background: 'linear-gradient(135deg, rgba(196, 30, 58, 0.8), rgba(15, 138, 95, 0.8))',
    borderRadius: COMMON_CONFIG.GRID_BORDER_RADIUS,
    border: '3px solid #ffd700',
    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2)',
    fontFamily: "'Courier New', monospace",
    fontSize: COMMON_CONFIG.GRID_FONT_SIZE,
    color: '#ffffff'
  };
  
  Object.assign(gridDisplay.style, defaultStyles, styles);
  
  // Add festive title
  const title = document.createElement('div');
  title.style.cssText = `
    font-size: 16px;
    font-weight: bold;
    color: #ffd700;
    text-align: center;
    margin-bottom: 10px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  `;
  title.textContent = '🎁 Calculator Grid 🎁';
  gridDisplay.appendChild(title);
  
  gridLines.forEach((line, index) => {
    const lineEl = document.createElement('div');
    lineEl.style.cssText = `
      white-space: pre;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    `;
    lineEl.textContent = line;
    gridDisplay.appendChild(lineEl);
    
    setTimeout(() => {
      lineEl.style.opacity = '1';
      lineEl.style.transform = 'translateY(0)';
    }, index * COMMON_CONFIG.GRID_LINE_DELAY_MS);
  });
  
  container.appendChild(gridDisplay);
  return gridDisplay;
}

/**
 * Calculate centered position for columns
 */
export function calculateColumnPositions(containerWidth, numColumns, columnWidth = 150, spacing = 200) {
  const totalWidth = numColumns * columnWidth + (numColumns - 1) * (spacing - columnWidth);
  const startX = (containerWidth - totalWidth) / 2;
  return { startX, spacing, columnWidth };
}

/**
 * Run calculation animation for columns
 */
export async function runCalculations(calculatorColumns, counterBox, onComplete) {
  await loadDay6Audio();
  
  let totalSum = 0;
  counterBox.setValue(0);
  
  await delay(COMMON_CONFIG.INITIAL_DELAY_MS);
  
  for (let i = 0; i < calculatorColumns.length; i++) {
    const result = await calculatorColumns[i].calculate();
    totalSum += result;
    
    await animateCounterTo(counterBox, totalSum, COMMON_CONFIG.COUNTER_ANIMATE_DURATION_MS);
    await delay(COMMON_CONFIG.COLUMN_DELAY_MS);
  }
  
  await delay(COMMON_CONFIG.COMPLETION_DELAY_MS);
  return totalSum;
}
