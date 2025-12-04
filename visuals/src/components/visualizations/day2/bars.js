import { audioManager } from '../../../utils/audio.js';

/**
 * Animated progress bars for Day 2
 */
export class ProgressBars {
  constructor(container, totalBars = 11, ranges = [], specialNumbers = [], onAllComplete = null, instructionText = '') {
    this.container = container;
    this.totalBars = totalBars;
    this.currentBar = 0;
    this.bars = [];
    this.animationFrames = [];
    this.ranges = ranges;
    this.specialNumbers = specialNumbers;
    this.onAllComplete = onAllComplete;
    this.instructionText = instructionText;
    
    this.init();
  }
  
  init() {
    // Create container that holds bars in the center
    this.barsContainer = document.createElement('div');
    this.barsContainer.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 40px;
      box-sizing: border-box;
      overflow: hidden;
    `;
    
    this.container.appendChild(this.barsContainer);
    
    // Create counter element (like Safe Password from Day 1)
    this.counterElement = document.createElement('div');
    this.counterElement.style.cssText = `
      position: absolute;
      top: 50%;
      right: 50px;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #c41e3a 0%, #e74c3c 100%);
      border: 5px solid #ffd700;
      border-radius: 15px;
      padding: 20px 30px;
      box-shadow: 
        0 8px 16px rgba(0, 0, 0, 0.4),
        inset 0 2px 4px rgba(255, 215, 0, 0.3);
      text-align: center;
    `;
    
    const label = document.createElement('div');
    label.textContent = 'Invalid Product IDs';
    label.style.cssText = `
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-shadow: 
        0 0 10px rgba(255, 215, 0, 0.8),
        2px 2px 4px rgba(0, 0, 0, 0.8);
      margin-bottom: 8px;
      letter-spacing: 1px;
    `;
    
    const counterValue = document.createElement('div');
    counterValue.className = 'counter-value';
    counterValue.textContent = '0';
    counterValue.style.cssText = `
      color: #ffd700;
      font-size: 48px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-shadow: 
        0 0 20px rgba(255, 215, 0, 1),
        0 0 40px rgba(255, 215, 0, 0.6),
        3px 3px 6px rgba(0, 0, 0, 0.8);
      animation: pulse 2s ease-in-out infinite;
    `;
    
    this.counterElement.appendChild(label);
    this.counterElement.appendChild(counterValue);
    this.container.appendChild(this.counterElement);
    
    // Store counter value for incrementing
    this.counterValue = 0;
    
    // Create instruction panel if text provided
    if (this.instructionText) {
      this.instructionPanel = document.createElement('div');
      this.instructionPanel.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50px;
        transform: translateY(-50%);
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        border: 6px solid #ffd700;
        border-radius: 20px;
        padding: 25px 30px;
        max-width: 300px;
        box-shadow: 
          0 8px 16px rgba(0, 0, 0, 0.4),
          inset 0 2px 4px rgba(255, 215, 0, 0.3);
      `;
      
      const instructionLabel = document.createElement('div');
      instructionLabel.textContent = '🎄 Instructions 🎄';
      instructionLabel.style.cssText = `
        color: #fff;
        font-size: 22px;
        font-weight: bold;
        font-family: 'Comic Sans MS', Arial, sans-serif;
        text-shadow: 
          0 0 10px rgba(255, 215, 0, 0.8),
          2px 2px 4px rgba(0, 0, 0, 0.8);
        margin-bottom: 15px;
        text-align: center;
        letter-spacing: 1px;
      `;
      
      const instructionContent = document.createElement('div');
      instructionContent.textContent = this.instructionText;
      instructionContent.style.cssText = `
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        font-family: 'Comic Sans MS', Arial, sans-serif;
        text-shadow: 
          1px 1px 3px rgba(0, 0, 0, 0.8);
        line-height: 1.5;
        text-align: center;
      `;
      
      this.instructionPanel.appendChild(instructionLabel);
      this.instructionPanel.appendChild(instructionContent);
      this.container.appendChild(this.instructionPanel);
    }
  }
  
  /**
   * Start the sequence of bars
   */
  start() {
    this.showNextBar();
  }
  
  /**
   * Show and animate the next bar
   */
  showNextBar() {
    if (this.currentBar >= this.totalBars) {
      // All bars complete
      return;
    }
    
    const barElement = this.createBar(this.currentBar);
    this.bars.push(barElement);
    this.barsContainer.appendChild(barElement);
    
    const barIndex = this.currentBar;
    
    // Animate this bar
    this.animateBar(barElement, barIndex, () => {
      // Bar complete
      this.currentBar++;
      
      // Check if this is the last bar
      const isLastBar = this.currentBar >= this.totalBars;
      
      if (isLastBar) {
        // Last bar - keep it visible and trigger completion
        this.markComplete();
        if (this.onAllComplete) {
          setTimeout(() => {
            this.onAllComplete();
          }, 500);
        }
      } else {
        // Not the last bar - fade out and remove
        barElement.style.transition = 'opacity 0.5s ease-out';
        barElement.style.opacity = '0';
        
        setTimeout(() => {
          // Remove from DOM
          if (barElement.parentNode) {
            barElement.parentNode.removeChild(barElement);
          }
          
          // Show next bar
          this.showNextBar();
        }, 500);
      }
    });
  }
  
  /**
   * Create a single bar element
   */
  createBar(index) {
    const barContainer = document.createElement('div');
    barContainer.style.cssText = `
      width: 100%;
      max-width: 900px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    
    // Bar label
    const label = document.createElement('div');
    label.textContent = `Range ${index + 1}`;
    label.style.cssText = `
      color: #ffd700;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    `;
    
    // Get range numbers for this bar
    const range = this.ranges[index] || { start: 0, end: 0 };
    
    // Container for bar with numbers
    const barRow = document.createElement('div');
    barRow.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
    `;
    
    // Left number
    const leftNumber = document.createElement('div');
    leftNumber.textContent = range.start.toLocaleString();
    leftNumber.style.cssText = `
      color: #ecf0f1;
      font-size: 16px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      min-width: 100px;
      text-align: right;
    `;
    
    // Bar track
    const track = document.createElement('div');
    track.style.cssText = `
      flex: 1;
      height: 40px;
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      border: 4px solid #27ae60;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.4),
        inset 0 2px 4px rgba(0, 0, 0, 0.3);
    `;
    
    // Right number
    const rightNumber = document.createElement('div');
    rightNumber.textContent = range.end.toLocaleString();
    rightNumber.style.cssText = `
      color: #ecf0f1;
      font-size: 16px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      min-width: 100px;
      text-align: left;
    `;
    
    // Progress fill
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #27ae60 0%, #2ecc71 50%, #27ae60 100%);
      transition: width 0.1s linear;
      box-shadow: 0 0 10px rgba(46, 204, 113, 0.6);
    `;
    
    // Indicator (Christmas tree)
    const indicator = document.createElement('div');
    indicator.className = 'progress-indicator';
    indicator.textContent = '🎄';
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      line-height: 1;
      filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
      z-index: 2;
    `;
    
    track.appendChild(fill);
    track.appendChild(indicator);
    
    barRow.appendChild(leftNumber);
    barRow.appendChild(track);
    barRow.appendChild(rightNumber);
    
    barContainer.appendChild(label);
    barContainer.appendChild(barRow);
    
    return barContainer;
  }
  
  /**
   * Animate a bar from 0% to 100% over duration
   */
  animateBar(barElement, index, onComplete) {
    const duration = 2000; // 5 seconds (twice as fast)
    const startTime = Date.now();
    
    const fill = barElement.querySelector('.progress-fill');
    const indicator = barElement.querySelector('.progress-indicator');
    const range = this.ranges[index];
    
    // Track which special numbers we've shown for this bar
    const shownNumbers = new Set();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const percentage = progress * 100;
      
      // Calculate current value in the range
      const currentValue = Math.floor(range.start + (range.end - range.start) * progress);
      
      // Check if we've hit any special numbers
      this.specialNumbers.forEach(specialNum => {
        if (!shownNumbers.has(specialNum) && 
            currentValue >= specialNum && 
            specialNum >= range.start && 
            specialNum <= range.end) {
          shownNumbers.add(specialNum);
          this.showSpecialNumber(specialNum, barElement);
          this.incrementCounter(specialNum);
        }
      });
      
      // Update fill width
      fill.style.width = `${percentage}%`;
      
      // Update indicator position
      indicator.style.left = `${percentage}%`;
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        this.animationFrames.push(frameId);
      } else {
        // Animation complete
        if (onComplete) {
          onComplete();
        }
      }
    };
    
    animate();
  }
  
  /**
   * Increment the counter by the special number value
   */
  incrementCounter(amount) {
    this.counterValue += amount;
    const counterValueElement = this.counterElement.querySelector('.counter-value');
    counterValueElement.textContent = this.counterValue.toLocaleString();
  }
  
  /**
   * Mark visualization as complete by changing counter to green
   */
  markComplete() {
    this.counterElement.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
  }
  
  /**
   * Show a special number briefly above the bar
   */
  showSpecialNumber(number, barElement) {
    const numberDisplay = document.createElement('div');
    numberDisplay.textContent = number.toLocaleString();
    numberDisplay.style.cssText = `
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      color: #ffd700;
      font-size: 36px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-shadow: 
        0 0 20px rgba(255, 215, 0, 1),
        0 0 40px rgba(255, 215, 0, 0.6),
        3px 3px 6px rgba(0, 0, 0, 0.8);
      animation: fadeInOut 1.5s ease-in-out;
      pointer-events: none;
      z-index: 100;
    `;
    
    // Add CSS animation if not already added
    if (!document.getElementById('special-number-animation')) {
      const style = document.createElement('style');
      style.id = 'special-number-animation';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    barElement.style.position = 'relative';
    barElement.appendChild(numberDisplay);
    
    // Remove after animation
    setTimeout(() => {
      if (numberDisplay.parentNode) {
        numberDisplay.parentNode.removeChild(numberDisplay);
      }
    }, 1500);
  }
  
  /**
   * Clean up
   */
  cleanup() {
    // Cancel all animation frames
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
    this.animationFrames = [];
    
    // Remove container
    if (this.barsContainer && this.barsContainer.parentNode) {
      this.barsContainer.parentNode.removeChild(this.barsContainer);
    }
  }
}
