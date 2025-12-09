import { audioManager } from '../../../utils/audio.js';

/**
 * Shared utilities for Day 6 visualizations
 */

// Test input grid lines
export const GRID_LINES = [
  '123 328  51 64 ',
  ' 45 64  387 23 ',
  '  6 98  215 314',
  '*   +   *   +  '
];

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
    await audioManager.loadSound('ding', 'ding.mp3');
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
    top: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '20px',
    background: 'rgba(20, 20, 40, 0.8)',
    borderRadius: '15px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontFamily: "'Courier New', monospace",
    fontSize: '18px',
    color: '#94a3b8'
  };
  
  Object.assign(gridDisplay.style, defaultStyles, styles);
  
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
    }, index * 150);
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
  
  await delay(1500);
  
  for (let i = 0; i < calculatorColumns.length; i++) {
    const result = await calculatorColumns[i].calculate();
    totalSum += result;
    
    await animateCounterTo(counterBox, totalSum, 500);
    await delay(300);
  }
  
  await delay(500);
  return totalSum;
}
