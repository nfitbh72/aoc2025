/**
 * Shared Wooden Ruler component for Day 5 visualizations
 * Creates an old-school wooden ruler with tick marks and numbers
 */

export function createWoodenRuler(container, minValue = 0, maxValue = 35) {
  const ruler = document.createElement('div');
  ruler.style.cssText = `
    position: absolute;
    bottom: 50px;
    left: 50px;
    right: 50px;
    height: 40px;
    background: 
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, #d4a574 0%, #c19a6b 50%, #a67c52 100%);
    background-size: 20px 20px, 20px 20px, 100% 100%;
    border: 2px solid #8b6f47;
    border-radius: 2px;
    box-shadow: 
      inset 0 2px 4px rgba(0,0,0,0.2),
      inset 0 -1px 2px rgba(255,255,255,0.3),
      0 2px 4px rgba(0,0,0,0.3);
  `;
  
  const scale = 800 / (maxValue - minValue);
  
  // Major tick marks at 0, 5, 10, 15, 20, 25, 30
  const majorTicks = [0, 5, 10, 15, 20, 25, 30];
  
  // Add all tick marks (major and minor)
  for (let val = minValue; val <= maxValue; val++) {
    const x = (val - minValue) * scale;
    const isMajor = majorTicks.includes(val);
    
    // Tick mark
    const tick = document.createElement('div');
    tick.style.cssText = `
      position: absolute;
      left: ${x}px;
      bottom: 0;
      width: ${isMajor ? '2px' : '1px'};
      height: ${isMajor ? '20px' : '10px'};
      background: ${isMajor ? '#2c1810' : '#4a3728'};
      box-shadow: 1px 0 0 rgba(0,0,0,0.3);
    `;
    ruler.appendChild(tick);
    
    // Label only for major ticks
    if (isMajor) {
      const label = document.createElement('div');
      label.textContent = val;
      label.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: 2px;
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: bold;
        color: #2c1810;
        font-family: 'Courier New', monospace;
        text-shadow: 1px 1px 0 rgba(255,255,255,0.5);
      `;
      ruler.appendChild(label);
    }
  }
  
  container.appendChild(ruler);
  return ruler;
}

/**
 * Shared eggplant creation function
 */
export function createEggplant(range, y, id, scale, minValue) {
  const startX = (range.lower - minValue) * scale;
  const width = (range.upper - range.lower) * scale;
  
  const eggplant = document.createElement('div');
  eggplant.dataset.id = id;
  eggplant.dataset.lower = range.lower;
  eggplant.dataset.upper = range.upper;
  eggplant.style.cssText = `
    position: absolute;
    left: ${50 + startX}px;
    bottom: ${y}px;
    width: ${width}px;
    height: 60px;
    background: linear-gradient(135deg, #663399 0%, #8B4789 50%, #663399 100%);
    border-radius: 30px;
    border: 3px solid #4a2566;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transition: all 0.8s ease;
    z-index: 10;
  `;
  
  // Add stem
  const stem = document.createElement('div');
  stem.style.cssText = `
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background: #2d5016;
    border-radius: 50% 50% 0 0;
  `;
  eggplant.appendChild(stem);
  
  // Add range label
  const label = document.createElement('div');
  label.textContent = `${range.lower}-${range.upper}`;
  eggplant.appendChild(label);
  
  return eggplant;
}
