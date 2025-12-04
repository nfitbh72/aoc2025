/**
 * Battery component - displays a horizontal battery with a number display
 */
export class Battery {
  constructor(container, number, color = '#ff0000', highlightRange = null) {
    this.container = container;
    this.number = number;
    this.color = color;
    this.highlightRange = highlightRange; // { start: index, end: index }
    this.element = null;
    this.numberDisplay = null;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'battery';
    this.element.style.cssText = `
      display: flex;
      align-items: center;
      margin: 20px auto;
      max-width: 900px;
      gap: 20px;
    `;

    // Battery body
    const body = document.createElement('div');
    body.className = 'battery-body';
    body.style.cssText = `
      flex: 1;
      height: 80px;
      background: linear-gradient(180deg, ${this.color}dd 0%, ${this.color} 50%, ${this.color}aa 100%);
      border: 4px solid ${this.color};
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
    `;

    // Shine effect
    const shine = document.createElement('div');
    shine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 30%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%);
      border-radius: 8px 8px 0 0;
    `;
    body.appendChild(shine);

    // Number display
    this.numberDisplay = document.createElement('div');
    this.numberDisplay.className = 'battery-number';
    this.numberDisplay.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
      letter-spacing: 2px;
      z-index: 1;
      display: flex;
    `;
    
    // Render each digit individually to support highlighting
    for (let i = 0; i < this.number.length; i++) {
      const digitSpan = document.createElement('span');
      digitSpan.textContent = this.number[i];
      digitSpan.style.cssText = `
        display: inline-block;
        transition: color 0.3s ease;
      `;
      
      // Check if this digit should be highlighted
      if (this.highlightRange && i >= this.highlightRange.start && i <= this.highlightRange.end) {
        digitSpan.style.color = '#ffd700';
        digitSpan.style.animation = 'wobble 0.5s ease-in-out infinite';
        digitSpan.classList.add('highlighted');
      }
      
      this.numberDisplay.appendChild(digitSpan);
    }
    
    body.appendChild(this.numberDisplay);
    
    // Add wobble animation keyframes if not already added
    if (!document.getElementById('battery-wobble-animation')) {
      const style = document.createElement('style');
      style.id = 'battery-wobble-animation';
      style.textContent = `
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-5deg) scale(1.1); }
          75% { transform: rotate(5deg) scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }

    // Battery terminal (positive end)
    const terminal = document.createElement('div');
    terminal.className = 'battery-terminal';
    terminal.style.cssText = `
      width: 28px;
      height: 50px;
      background: linear-gradient(180deg, ${this.color}dd 0%, ${this.color} 50%, ${this.color}aa 100%);
      border: 4px solid ${this.color};
      border-left: none;
      border-radius: 0 8px 8px 0;
      margin-left: -20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    this.element.appendChild(body);
    this.element.appendChild(terminal);
    
    // Max value display (to the right of battery)
    this.maxValueDisplay = document.createElement('div');
    this.maxValueDisplay.className = 'battery-max-value';
    this.maxValueDisplay.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 36px;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
      min-width: 60px;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    this.maxValueDisplay.textContent = '--';
    this.element.appendChild(this.maxValueDisplay);
    
    this.container.appendChild(this.element);
  }

  setHighlight(start, end) {
    // Update highlight range
    this.highlightRange = { start, end };
    
    // Update all digit spans
    const digitSpans = this.numberDisplay.querySelectorAll('span');
    digitSpans.forEach((span, i) => {
      if (i >= start && i <= end) {
        span.style.color = '#ffd700';
        span.style.animation = 'wobble 0.5s ease-in-out infinite';
        span.classList.add('highlighted');
      } else {
        span.style.color = '#ffffff';
        span.style.animation = '';
        span.classList.remove('highlighted');
      }
    });
  }
  
  setHighlightPositions(positions) {
    // Highlight specific positions (not a range)
    // positions is an array of indices, e.g., [0, 5] to highlight just those two digits
    const digitSpans = this.numberDisplay.querySelectorAll('span');
    digitSpans.forEach((span, i) => {
      if (positions.includes(i)) {
        span.style.color = '#ffd700';
        span.style.animation = 'wobble 0.5s ease-in-out infinite';
        span.classList.add('highlighted');
      } else {
        span.style.color = '#ffffff';
        span.style.animation = '';
        span.classList.remove('highlighted');
      }
    });
  }
  
  clearHighlight() {
    this.highlightRange = null;
    const digitSpans = this.numberDisplay.querySelectorAll('span');
    digitSpans.forEach(span => {
      span.style.color = '#ffffff';
      span.style.animation = '';
      span.classList.remove('highlighted');
    });
  }
  
  updateMaxValue(value) {
    // Update the max value display
    this.maxValueDisplay.textContent = value;
    this.maxValueDisplay.style.opacity = '1';
  }
  
  hideMaxValue() {
    this.maxValueDisplay.style.opacity = '0';
  }

  cleanup() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
