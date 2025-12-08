import { audioManager } from '../../../utils/audio.js';
import { createWoodenRuler, createEggplant } from './wooden-ruler.js';

/**
 * Eggplant Ruler component for Day 5 Part 1
 * Shows ranges as eggplants on a ruler scale
 */
export class EggplantRuler {
  constructor(container, ranges, values, counterBox = null) {
    this.container = container;
    this.ranges = ranges; // Array of {lower, upper}
    this.values = values; // Array of values to check
    this.counterBox = counterBox; // Optional CounterBox component
    this.currentValueIndex = 0;
    this.matchCount = 0;
    
    // Calculate scale - fixed range from 0 to 35
    this.minValue = 0;
    this.maxValue = 35;
    this.scale = 800 / (this.maxValue - this.minValue);
    
    this.createElements();
  }
  
  createElements() {
    // Main container
    this.element = document.createElement('div');
    this.element.className = 'eggplant-ruler';
    this.element.style.cssText = `
      position: relative;
      width: 900px;
      margin: 40px auto;
      padding: 20px;
    `;
    
    // Title
    const title = document.createElement('div');
    title.textContent = '🍆 Eggplant Range Checker 🍆';
    title.style.cssText = `
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
      color: #663399;
    `;
    this.element.appendChild(title);
    
    // Ruler container
    this.rulerContainer = document.createElement('div');
    this.rulerContainer.style.cssText = `
      position: relative;
      height: 400px;
      margin: 20px 0;
    `;
    this.element.appendChild(this.rulerContainer);
    
    // Create ruler using shared function
    this.ruler = createWoodenRuler(this.rulerContainer, this.minValue, this.maxValue);
    
    // Create eggplants for ranges
    this.createEggplants();
    
    // Values to check display (only show if no counterBox)
    if (!this.counterBox) {
      this.counterDisplay = document.createElement('div');
      this.counterDisplay.style.cssText = `
        font-size: 20px;
        text-align: center;
        margin-top: 20px;
        font-weight: bold;
        color: #333;
      `;
      this.counterDisplay.textContent = `Values in ranges: ${this.matchCount}`;
      this.element.appendChild(this.counterDisplay);
    }
    
    // Values to check display
    this.valuesDisplay = document.createElement('div');
    this.valuesDisplay.style.cssText = `
      font-size: 16px;
      text-align: center;
      margin-top: 10px;
      color: #666;
    `;
    this.valuesDisplay.textContent = `Checking values: ${this.values.join(', ')}`;
    this.element.appendChild(this.valuesDisplay);
    
    this.container.appendChild(this.element);
  }
  
  createEggplants() {
    this.eggplantElements = [];
    
    this.ranges.forEach((range, index) => {
      const y = 120 + (index % 3) * 80; // Stack in 3 rows
      const eggplant = createEggplant(range, y, `range-${index}`, this.scale, this.minValue);
      
      this.rulerContainer.appendChild(eggplant);
      this.eggplantElements.push(eggplant);
    });
  }
  
  async checkValue(value, delay = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Create marker for the value
        const x = (value - this.minValue) * this.scale;
        const marker = document.createElement('div');
        marker.style.cssText = `
          position: absolute;
          left: ${50 + x}px;
          bottom: 30px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 15px solid #ff6b6b;
          animation: bounce 0.5s ease;
        `;
        
        // Add value label
        const valueLabel = document.createElement('div');
        valueLabel.textContent = value;
        valueLabel.style.cssText = `
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          font-weight: bold;
          color: #ff6b6b;
        `;
        marker.appendChild(valueLabel);
        
        this.rulerContainer.appendChild(marker);
        
        // Check if value is in any range
        let found = false;
        this.ranges.forEach((range, index) => {
          if (value >= range.lower && value <= range.upper) {
            found = true;
            // Highlight the eggplant
            this.eggplantElements[index].style.transform = 'scale(1.1)';
            this.eggplantElements[index].style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.8)';
            
            setTimeout(() => {
              this.eggplantElements[index].style.transform = 'scale(1)';
              this.eggplantElements[index].style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }, 800);
          }
        });
        
        if (found) {
          this.matchCount++;
          if (this.counterBox) {
            this.counterBox.increment(1);
          } else if (this.counterDisplay) {
            this.counterDisplay.textContent = `Values in ranges: ${this.matchCount}`;
          }
          marker.style.borderBottomColor = '#51cf66';
          
          // Play ding sound
          audioManager.play('ding', 0.4);
        }
        
        // Remove marker after animation
        setTimeout(() => {
          marker.remove();
          resolve(found);
        }, 1500);
      }, delay);
    });
  }
  
  async checkAllValues() {
    for (let i = 0; i < this.values.length; i++) {
      await this.checkValue(this.values[i], i === 0 ? 250 : 600);
    }
  }
  
  markComplete() {
    if (this.counterDisplay) {
      this.counterDisplay.style.cssText += `
        color: #51cf66;
        font-size: 28px;
        animation: pulse 0.5s ease;
      `;
    }
  }
  
  cleanup() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(style);
