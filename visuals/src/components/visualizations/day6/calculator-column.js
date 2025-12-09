import { audioManager } from '../../../utils/audio.js';

/**
 * Festive Calculator Column Component
 * Shows a column of numbers being calculated with an operator
 */
export class CalculatorColumn {
  constructor(container, numbers, operator, x, y, label = '') {
    this.container = container;
    this.numbers = numbers;
    this.operator = operator;
    this.x = x;
    this.y = y;
    this.label = label;
    this.element = null;
    this.isComplete = false;
    
    this.operatorSymbols = {
      0: '+',
      1: '-',
      2: '×',
      3: '÷'
    };
    
    this.operatorColors = {
      0: '#4ade80', // green for addition
      1: '#f87171', // red for subtraction
      2: '#60a5fa', // blue for multiplication
      3: '#fbbf24'  // yellow for division
    };
    
    this.create();
  }
  
  create() {
    this.element = document.createElement('div');
    this.element.className = 'calculator-column';
    this.element.style.cssText = `
      position: absolute;
      left: ${this.x}px;
      top: ${this.y}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 15px;
      background: linear-gradient(135deg, rgba(30, 30, 60, 0.9), rgba(50, 50, 80, 0.9));
      border-radius: 15px;
      border: 3px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      min-width: 120px;
      transform: scale(0.8);
      opacity: 0;
      transition: all 0.5s ease;
    `;
    
    // Label (e.g., "Column 1")
    if (this.label) {
      const labelEl = document.createElement('div');
      labelEl.style.cssText = `
        font-size: 14px;
        color: #94a3b8;
        font-weight: 600;
        margin-bottom: 5px;
      `;
      labelEl.textContent = this.label;
      this.element.appendChild(labelEl);
    }
    
    // Numbers container
    this.numbersContainer = document.createElement('div');
    this.numbersContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 100%;
    `;
    
    this.numbers.forEach((num, index) => {
      const numEl = document.createElement('div');
      numEl.className = 'calc-number';
      numEl.style.cssText = `
        font-size: 24px;
        font-weight: 700;
        color: #e2e8f0;
        text-align: center;
        padding: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        transform: translateY(-10px);
        opacity: 0;
        transition: all 0.3s ease;
        font-family: 'Courier New', monospace;
      `;
      numEl.textContent = num;
      this.numbersContainer.appendChild(numEl);
      
      // Animate in with delay
      setTimeout(() => {
        numEl.style.transform = 'translateY(0)';
        numEl.style.opacity = '1';
      }, index * 100);
    });
    
    this.element.appendChild(this.numbersContainer);
    
    // Operator display
    const operatorSymbol = this.operatorSymbols[this.operator];
    const operatorColor = this.operatorColors[this.operator];
    
    this.operatorEl = document.createElement('div');
    this.operatorEl.style.cssText = `
      font-size: 32px;
      font-weight: 900;
      color: ${operatorColor};
      text-shadow: 0 0 20px ${operatorColor}80;
      margin: 5px 0;
      transform: scale(0);
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    this.operatorEl.textContent = operatorSymbol;
    this.element.appendChild(this.operatorEl);
    
    // Result display (initially hidden)
    this.resultEl = document.createElement('div');
    this.resultEl.style.cssText = `
      font-size: 20px;
      font-weight: 900;
      color: #fbbf24;
      text-align: center;
      padding: 10px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
      border-radius: 10px;
      border: 2px solid #fbbf24;
      margin-top: 5px;
      transform: scale(0);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      font-family: 'Courier New', monospace;
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
    `;
    this.resultEl.textContent = '= ?';
    this.element.appendChild(this.resultEl);
    
    this.container.appendChild(this.element);
    
    // Animate in
    requestAnimationFrame(() => {
      this.element.style.transform = 'scale(1)';
      this.element.style.opacity = '1';
    });
  }
  
  /**
   * Animate the calculation process
   */
  async calculate() {
    // Show operator with bounce
    await this.delay(300);
    this.operatorEl.style.transform = 'scale(1)';
    
    // Highlight each number as we "calculate"
    const numberEls = this.numbersContainer.querySelectorAll('.calc-number');
    for (let i = 0; i < numberEls.length; i++) {
      numberEls[i].style.background = this.operatorColors[this.operator] + '40';
      numberEls[i].style.transform = 'scale(1.1)';
      await this.delay(200);
      numberEls[i].style.transform = 'scale(1)';
    }
    
    // Calculate result
    let result = 0;
    let first = true;
    
    switch (this.operator) {
      case 0: // Addition
        result = 0;
        break;
      case 1: // Subtraction
        result = this.numbers[0];
        break;
      case 2: // Multiplication
        result = 1;
        break;
      case 3: // Division
        result = this.numbers[0];
        break;
    }
    
    for (const num of this.numbers) {
      switch (this.operator) {
        case 0:
          result += num;
          break;
        case 1:
          if (!first) result -= num;
          break;
        case 2:
          result *= num;
          break;
        case 3:
          if (!first) result = Math.floor(result / num);
          break;
      }
      first = false;
    }
    
    // Show result with celebration
    await this.delay(300);
    this.resultEl.textContent = `= ${result}`;
    this.resultEl.style.transform = 'scale(1)';
    this.resultEl.style.opacity = '1';
    
    // Play ding sound (don't let it block if it fails)
    try {
      audioManager.play('ding', 0.5);
    } catch (e) {
      console.log('Audio play failed:', e);
    }
    
    // Sparkle effect
    this.createSparkles();
    
    this.isComplete = true;
    return result;
  }
  
  createSparkles() {
    const sparkleCount = 8;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.textContent = '✨';
      sparkle.style.cssText = `
        position: absolute;
        font-size: 20px;
        pointer-events: none;
        animation: sparkle-float 1s ease-out forwards;
      `;
      
      const angle = (Math.PI * 2 * i) / sparkleCount;
      const distance = 60;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      sparkle.style.setProperty('--tx', `${tx}px`);
      sparkle.style.setProperty('--ty', `${ty}px`);
      
      this.element.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }
    
    // Add sparkle animation if not already present
    if (!document.getElementById('sparkle-animation')) {
      const style = document.createElement('style');
      style.id = 'sparkle-animation';
      style.textContent = `
        @keyframes sparkle-float {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  cleanup() {
    if (this.element && this.element.parentNode) {
      this.element.style.opacity = '0';
      this.element.style.transform = 'scale(0.8)';
      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }, 300);
    }
  }
}
