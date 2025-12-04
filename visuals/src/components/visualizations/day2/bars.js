import { audioManager } from '../../../utils/audio.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';

/**
 * Animated progress bars for Day 2
 */
export class ProgressBars {
  constructor(container, totalBars = 11, ranges = [], specialNumbers = [], onAllComplete = null, instructionText = '', counterLabel = 'Counter') {
    this.container = container;
    this.totalBars = totalBars;
    this.currentBar = 0;
    this.bars = [];
    this.animationFrames = [];
    this.ranges = ranges;
    this.specialNumbers = specialNumbers;
    this.onAllComplete = onAllComplete;
    this.counterBox = null;
    this.instructionPanel = null;
    
    this.init(instructionText, counterLabel);
  }
  
  init(instructionText, counterLabel) {
    // Load ding sound
    audioManager.loadSound('bar-complete', 'ding.mp3');
    
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
    
    // Create counter box
    this.counterBox = new CounterBox(this.container, counterLabel);
    
    // Create instruction panel if text provided
    if (instructionText) {
      this.instructionPanel = new InstructionPanel(this.container, instructionText);
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
    
    // Label for the bar with festive emojis
    const label = document.createElement('div');
    label.textContent = `🎄 Range ${index + 1} 🎁`;
    label.style.cssText = `
      color: #ffd700;
      font-size: 20px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-align: center;
      text-shadow: 
        0 0 10px rgba(255, 215, 0, 0.8),
        2px 2px 4px rgba(0, 0, 0, 0.8),
        0 0 20px rgba(255, 0, 0, 0.5);
      animation: sparkle 2s ease-in-out infinite;
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
    
    // Left number with festive styling
    const leftNumber = document.createElement('div');
    leftNumber.textContent = '🎅 ' + range.start.toLocaleString();
    leftNumber.style.cssText = `
      color: #ffd700;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-shadow: 
        0 0 10px rgba(255, 215, 0, 0.8),
        2px 2px 4px rgba(0, 0, 0, 0.8);
      min-width: 140px;
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
      width: 100%;
      height: 35px;
      background: repeating-linear-gradient(
        45deg,
        #c41e3a,
        #c41e3a 10px,
        #fff 10px,
        #fff 20px
      );
      border-radius: 18px;
      overflow: visible;
      box-shadow: 
        inset 0 3px 6px rgba(0, 0, 0, 0.4),
        0 0 15px rgba(255, 215, 0, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.3);
      border: 3px solid #ffd700;
    `;
    
    // Progress fill with festive gradient
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0%;
      background: linear-gradient(
        90deg,
        #c41e3a 0%,
        #e74c3c 15%,
        #27ae60 30%,
        #2ecc71 45%,
        #f39c12 60%,
        #e67e22 75%,
        #c41e3a 100%
      );
      background-size: 200% 100%;
      animation: shimmer 3s linear infinite;
      transition: width 0.1s linear;
      box-shadow: 
        0 0 20px rgba(255, 215, 0, 0.8),
        inset 0 2px 4px rgba(255, 255, 255, 0.3);
      border-radius: 15px;
    `;
    
    // Indicator (Christmas tree with extra sparkle)
    const indicator = document.createElement('div');
    indicator.className = 'progress-indicator';
    indicator.textContent = '🎄';
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 40px;
      line-height: 1;
      filter: 
        drop-shadow(0 0 12px rgba(255, 215, 0, 1))
        drop-shadow(0 0 20px rgba(255, 0, 0, 0.6))
        drop-shadow(0 0 30px rgba(0, 255, 0, 0.4));
      animation: bounce 1s ease-in-out infinite;
      z-index: 2;
    `;
    
    // Right number with festive styling
    const rightNumber = document.createElement('div');
    rightNumber.textContent = range.end.toLocaleString() + ' 🎄';
    rightNumber.style.cssText = `
      color: #ffd700;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-shadow: 
        0 0 10px rgba(255, 215, 0, 0.8),
        2px 2px 4px rgba(0, 0, 0, 0.8);
      min-width: 140px;
      text-align: left;
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
    const duration = 1500; // 1.5 seconds
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
          // Play ding sound when special number is found
          audioManager.play('bar-complete', 0.6);
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
    this.counterBox.increment(amount);
  }
  
  /**
   * Mark visualization as complete by changing counter to green
   */
  markComplete() {
    this.counterBox.markComplete();
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
    
    // Add CSS animations if not already added
    if (!document.getElementById('special-number-animation')) {
      const style = document.createElement('style');
      style.id = 'special-number-animation';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.5); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1.2); }
          40% { transform: translateX(-50%) translateY(0) scale(1); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.5); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes sparkle {
          0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 215, 0, 1), 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 0, 0, 0.8); }
        }
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -60%) scale(1.1); }
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
    
    // Clean up counter and instruction panel
    if (this.counterBox) {
      this.counterBox.cleanup();
    }
    if (this.instructionPanel) {
      this.instructionPanel.cleanup();
    }
  }
}
