/**
 * Day Title component - displays "Day X, Part Y" at the top of visualizations
 */
export class DayTitle {
  constructor(container, day, part) {
    this.container = container;
    this.day = day;
    this.part = part;
    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'day-title';
    this.element.style.cssText = `
      position: absolute;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(45deg, #ff0000, #00ff00, #ffd700, #ff0000);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.3));
      z-index: 1000;
      pointer-events: none;
      font-family: 'Arial', sans-serif;
      letter-spacing: 2px;
      animation: festiveGlow 3s ease-in-out infinite;
    `;
    this.element.innerHTML = `🎄 Day ${this.day}, Part ${this.part} 🎄`;
    this.container.appendChild(this.element);
    
    // Add festive animation
    if (!document.getElementById('day-title-animation')) {
      const style = document.createElement('style');
      style.id = 'day-title-animation';
      style.textContent = `
        @keyframes festiveGlow {
          0%, 100% { 
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 15px rgba(255, 0, 0, 0.5));
          }
          33% { 
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 15px rgba(0, 255, 0, 0.5));
          }
          66% { 
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  cleanup() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
