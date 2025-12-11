/**
 * Reusable counter box component for visualizations
 */
export class CounterBox {
  constructor(container, label = 'Counter') {
    this.container = container;
    this.label = label;
    this.counterValue = 0;
    this.element = null;
    this.counterValueElement = null;
    
    this.init();
  }
  
  init() {
    // Create animated candy cane border wrapper
    this.borderWrapper = document.createElement('div');
    this.borderWrapper.className = 'candy-cane-border';
    this.borderWrapper.style.cssText = `
      position: absolute;
      top: 50%;
      right: 50px;
      transform: translateY(-50%);
      padding: 8px;
      border-radius: 20px;
      background: repeating-linear-gradient(
        45deg,
        #c41e3a,
        #c41e3a 10px,
        #fff 10px,
        #fff 20px
      );
      animation: candyCaneSlide 2s linear infinite;
      z-index: 100;
    `;
    
    // Create counter element
    this.element = document.createElement('div');
    this.element.style.cssText = `
      position: relative;
      background: linear-gradient(135deg, #c41e3a 0%, #e74c3c 100%);
      border-radius: 15px;
      padding: 20px 30px;
      box-shadow: 
        0 8px 16px rgba(0, 0, 0, 0.4),
        inset 0 2px 4px rgba(255, 215, 0, 0.3),
        0 0 20px rgba(255, 215, 0, 0.3);
      text-align: center;
    `;
    
    // Add CSS animation if not already added
    if (!document.getElementById('candy-cane-animation')) {
      const style = document.createElement('style');
      style.id = 'candy-cane-animation';
      style.textContent = `
        @keyframes candyCaneSlide {
          0% { background-position: 0 0; }
          100% { background-position: -28.28px 28.28px; }
        }
      `;
      document.head.appendChild(style);
    }
    
    const labelElement = document.createElement('div');
    labelElement.textContent = `🎄 ${this.label} 🎄`;
    labelElement.style.cssText = `
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
    
    this.counterValueElement = document.createElement('div');
    this.counterValueElement.className = 'counter-value';
    this.counterValueElement.textContent = '0';
    this.counterValueElement.style.cssText = `
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
    
    this.element.appendChild(labelElement);
    this.element.appendChild(this.counterValueElement);
    
    // Append element inside border wrapper
    this.borderWrapper.appendChild(this.element);
    this.container.appendChild(this.borderWrapper);
  }
  
  /**
   * Set the counter value
   */
  setValue(value) {
    this.counterValue = value;
    this.counterValueElement.textContent = this.counterValue.toLocaleString();
  }
  
  /**
   * Increment the counter by an amount
   */
  increment(amount) {
    this.counterValue += amount;
    this.counterValueElement.textContent = this.counterValue.toLocaleString();
  }
  
  /**
   * Update the label text
   */
  setLabel(newLabel) {
    this.label = newLabel;
    const labelElement = this.element.querySelector('div:first-child');
    if (labelElement) {
      labelElement.textContent = `🎄 ${this.label} 🎄`;
    }
  }
  
  /**
   * Mark as complete by changing to green
   */
  markComplete() {
    this.element.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    if (this.borderWrapper) {
      this.borderWrapper.style.background = `repeating-linear-gradient(
        45deg,
        #27ae60,
        #27ae60 10px,
        #fff 10px,
        #fff 20px
      )`;
    }
  }
  
  /**
   * Clean up
   */
  cleanup() {
    if (this.borderWrapper && this.borderWrapper.parentNode) {
      this.borderWrapper.parentNode.removeChild(this.borderWrapper);
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
