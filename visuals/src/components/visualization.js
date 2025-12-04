import { audioManager } from '../utils/audio.js';

let currentVisualization = null;
let currentBoxLid = null;

// Override setTimeout and setInterval to track all timers
const originalSetTimeout = window.setTimeout;
const originalSetInterval = window.setInterval;
const originalRequestAnimationFrame = window.requestAnimationFrame;
let allTimeouts = new Set();
let allIntervals = new Set();
let allAnimationFrames = new Set();

window.setTimeout = function(callback, delay, ...args) {
  const id = originalSetTimeout.call(window, function(...callbackArgs) {
    allTimeouts.delete(id);
    callback.apply(this, callbackArgs);
  }, delay, ...args);
  allTimeouts.add(id);
  return id;
};

window.setInterval = function(callback, delay, ...args) {
  const id = originalSetInterval.call(window, callback, delay, ...args);
  allIntervals.add(id);
  return id;
};

window.requestAnimationFrame = function(callback) {
  const id = originalRequestAnimationFrame.call(window, function(...args) {
    allAnimationFrames.delete(id);
    callback.apply(this, args);
  });
  allAnimationFrames.add(id);
  return id;
};

function clearAllTimers() {
  console.log(`Clearing ${allTimeouts.size} timeouts, ${allIntervals.size} intervals, ${allAnimationFrames.size} animation frames`);
  
  allTimeouts.forEach(id => clearTimeout(id));
  allTimeouts.clear();
  
  allIntervals.forEach(id => clearInterval(id));
  allIntervals.clear();
  
  allAnimationFrames.forEach(id => cancelAnimationFrame(id));
  allAnimationFrames.clear();
}

export function initializeVisualization() {
  const area = document.getElementById('visualization-area');
  area.innerHTML = '';
}

export async function loadVisualization(day, part, boxLid = null) {
  console.log(`\n=== LOADING Day ${day} Part ${part} ===`);
  
  // NUCLEAR OPTION: Clear ALL timers and animations
  clearAllTimers();
  
  // Stop all audio
  audioManager.stopAll();
  
  const area = document.getElementById('visualization-area');
  
  // Clear current visualization
  if (currentVisualization) {
    try {
      if (typeof currentVisualization.cleanup === 'function') {
        currentVisualization.cleanup();
      }
    } catch (error) {
      console.error('Error during visualization cleanup:', error);
    }
    currentVisualization = null;
  }
  
  // Clear DOM
  while (area.firstChild) {
    area.removeChild(area.firstChild);
  }
  
  // Store reference to box lid
  currentBoxLid = boxLid;
  
  try {
    // Dynamic import of day-specific visualization
    const module = await import(`./visualizations/day${day}/part${part}.js`);
    currentVisualization = module.default(area, onVisualizationComplete);
  } catch (error) {
    console.error(`Failed to load visualization for Day ${day} Part ${part}:`, error);
    
    // Fallback placeholder
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      color: white;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      flex-direction: column;
      gap: 20px;
    `;
    placeholder.innerHTML = `
      <div>Day ${day} - Part ${part}</div>
      <div style="font-size: 16px; color: #888;">Visualization not yet implemented</div>
    `;
    area.appendChild(placeholder);
  }
  
  console.log(`=== Day ${day} Part ${part} loaded ===\n`);
}

/**
 * Called when a visualization completes
 */
function onVisualizationComplete() {
  console.log('Visualization complete - closing box lid');
  
  // Close the box lid
  if (currentBoxLid) {
    currentBoxLid.classList.remove('opening');
    currentBoxLid = null;
  }
}
