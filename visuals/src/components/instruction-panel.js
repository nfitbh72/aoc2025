/**
 * Reusable instruction panel component for visualizations
 */
export class InstructionPanel {
  constructor(container, instructionText = '') {
    this.container = container;
    this.instructionText = instructionText;
    this.element = null;
    
    if (instructionText) {
      this.init();
    }
  }
  
  init() {
    // Create animated candy cane border wrapper
    this.borderWrapper = document.createElement('div');
    this.borderWrapper.className = 'candy-cane-border';
    this.borderWrapper.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50px;
      transform: translateY(-50%);
      width: 300px;
      padding: 8px;
      border-radius: 20px;
      background: repeating-linear-gradient(
        45deg,
        #27ae60,
        #27ae60 10px,
        #fff 10px,
        #fff 20px
      );
      animation: candyCaneSlide 2s linear infinite;
      z-index: 100;
    `;
    
    this.element = document.createElement('div');
    this.element.style.cssText = `
      position: relative;
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
      border-radius: 15px;
      padding: 25px 30px;
      box-shadow: 
        0 8px 16px rgba(0, 0, 0, 0.4),
        inset 0 2px 4px rgba(255, 215, 0, 0.3),
        0 0 20px rgba(46, 204, 113, 0.3);
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
    
    this.element.appendChild(instructionLabel);
    this.element.appendChild(instructionContent);
    this.borderWrapper.appendChild(this.element);
    this.container.appendChild(this.borderWrapper);
  }
  
  /**
   * Clean up
   */
  cleanup() {
    if (this.borderWrapper && this.borderWrapper.parentNode) {
      this.borderWrapper.parentNode.removeChild(this.borderWrapper);
    }
  }
}
