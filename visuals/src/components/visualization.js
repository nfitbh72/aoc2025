let currentVisualization = null;
let currentBoxLid = null;

export function initializeVisualization() {
  const area = document.getElementById('visualization-area');
  // Initial state - empty black screen
  area.innerHTML = '';
}

export async function loadVisualization(day, part, boxLid = null) {
  console.log(`Loading visualization for Day ${day}, Part ${part}`);
  
  const area = document.getElementById('visualization-area');
  
  // Store reference to box lid for closing later
  currentBoxLid = boxLid;
  
  // Clear current visualization
  if (currentVisualization) {
    currentVisualization.cleanup?.();
    currentVisualization = null;
  }
  
  area.innerHTML = '';
  
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
