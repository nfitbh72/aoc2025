/**
 * Safe visual component for Day 1
 * Shared between part 1 and part 2
 */

import { audioManager } from '../../../utils/audio.js';

export class Safe {
  constructor(container, instructionText = '') {
    this.container = container;
    // Start at position 50 (bottom of dial = 6 o'clock = π radians)
    this.dialRotation = Math.PI;
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.zeroCounter = 0;
    this.counterElement = null;
    this.instructionPanel = null;
    this.instructionText = instructionText;
    this.soundsLoaded = false;
    
    this.init();
    this.loadSounds();
  }
  
  async loadSounds() {
    await audioManager.loadSound('dial-click', 'click.mp3');
    await audioManager.loadSound('zero-hit', 'ding.mp3');
    this.soundsLoaded = true;
  }
  
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    
    // Create counter display
    this.counterElement = document.createElement('div');
    this.counterElement.style.cssText = `
      position: absolute;
      top: 50%;
      right: 50px;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #c41e3a 0%, #e74c3c 100%);
      border: 6px solid #ffd700;
      border-radius: 20px;
      padding: 30px 40px;
      box-shadow: 
        0 8px 16px rgba(0, 0, 0, 0.4),
        inset 0 2px 4px rgba(255, 215, 0, 0.3);
      text-align: center;
    `;
    
    const label = document.createElement('div');
    label.textContent = 'Zeros Hit';
    label.style.cssText = `
      color: #fff;
      font-size: 24px;
      font-weight: bold;
      font-family: 'Comic Sans MS', Arial, sans-serif;
      text-shadow: 
        0 0 10px rgba(255, 215, 0, 0.8),
        2px 2px 4px rgba(0, 0, 0, 0.8);
      margin-bottom: 10px;
      letter-spacing: 1px;
    `;
    
    const counterValue = document.createElement('div');
    counterValue.className = 'counter-value';
    counterValue.textContent = '0';
    counterValue.style.cssText = `
      color: #ffd700;
      font-size: 72px;
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
    
    // Add CSS animation for pulse effect
    if (!document.getElementById('counter-animation')) {
      const style = document.createElement('style');
      style.id = 'counter-animation';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes counterPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Initial draw
    this.draw();
    
    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  handleResize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.draw();
  }
  
  draw() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate safe dimensions (centered)
    const safeWidth = Math.min(width * 0.6, 600);
    const safeHeight = Math.min(height * 0.8, 700);
    const safeX = (width - safeWidth) / 2;
    const safeY = (height - safeHeight) / 2;
    
    // Draw safe body
    this.drawSafeBody(ctx, safeX, safeY, safeWidth, safeHeight);
    
    // Draw dial (centered on safe)
    const dialCenterX = width / 2;
    const dialCenterY = height / 2;
    const dialRadius = Math.min(safeWidth, safeHeight) * 0.25;
    
    this.drawDial(ctx, dialCenterX, dialCenterY, dialRadius);
  }
  
  drawSafeBody(ctx, x, y, width, height) {
    // Main safe body - festive red with gradient
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#c41e3a');
    gradient.addColorStop(0.5, '#e74c3c');
    gradient.addColorStop(1, '#c41e3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    // Golden border effect
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 10;
    ctx.strokeRect(x, y, width, height);
    
    // Inner golden border
    ctx.strokeStyle = '#ffed4e';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 12, y + 12, width - 24, height - 24);
    
    // Decorative snowflakes on safe body
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 40px Arial';
    const snowflakes = ['❄', '✨', '⭐'];
    for (let i = 0; i < 8; i++) {
      const sx = x + 50 + (i % 3) * (width / 4);
      const sy = y + 80 + Math.floor(i / 3) * (height / 4);
      ctx.fillText(snowflakes[i % 3], sx, sy);
    }
    
    // Golden rivets in corners
    const rivetRadius = 10;
    const rivetOffset = 35;
    
    // Corner rivets with glow
    const corners = [
      [x + rivetOffset, y + rivetOffset],
      [x + width - rivetOffset, y + rivetOffset],
      [x + rivetOffset, y + height - rivetOffset],
      [x + width - rivetOffset, y + height - rivetOffset]
    ];
    
    corners.forEach(([cx, cy]) => {
      // Glow effect
      const glowGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rivetRadius * 2);
      glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
      glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, rivetRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Rivet
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(cx, cy, rivetRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffed4e';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Safe door handle (festive green with gold)
    const handleX = x + width - 90;
    const handleY = y + height / 2;
    
    // Handle gradient
    const handleGradient = ctx.createLinearGradient(handleX, handleY - 50, handleX + 50, handleY + 50);
    handleGradient.addColorStop(0, '#27ae60');
    handleGradient.addColorStop(0.5, '#2ecc71');
    handleGradient.addColorStop(1, '#27ae60');
    ctx.fillStyle = handleGradient;
    ctx.fillRect(handleX, handleY - 50, 50, 100);
    
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.strokeRect(handleX, handleY - 50, 50, 100);
  }
  
  drawDial(ctx, centerX, centerY, radius) {
    // Dial background with festive gradient (green to darker green)
    const dialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    dialGradient.addColorStop(0, '#2ecc71');
    dialGradient.addColorStop(1, '#27ae60');
    ctx.fillStyle = dialGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Outer ring - golden
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // Inner ring - lighter gold
    ctx.strokeStyle = '#ffed4e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw 100 tick marks
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < 100; i++) {
      // Canvas 0° is at 3 o'clock, so subtract π/2 to make 0 at 12 o'clock
      const angle = (i / 100) * Math.PI * 2 - Math.PI / 2;
      
      ctx.save();
      ctx.rotate(angle);
      
      // Every 10th mark is longer
      const isMajor = i % 10 === 0;
      const tickLength = isMajor ? 22 : 12;
      const tickWidth = isMajor ? 4 : 2;
      
      // Festive colors - alternate between gold and white
      ctx.strokeStyle = isMajor ? '#ffd700' : '#fff';
      ctx.lineWidth = tickWidth;
      ctx.beginPath();
      ctx.moveTo(radius - 18, 0);
      ctx.lineTo(radius - 18 - tickLength, 0);
      ctx.stroke();
      
      ctx.restore();
    }
    
    ctx.restore();
    
    // Draw only 0, 25, 50, 75 indicators
    const indicators = [0, 25, 50, 75];
    
    indicators.forEach(value => {
      // Canvas 0° is at 3 o'clock, so subtract π/2 to make 0 at 12 o'clock
      const angle = (value / 100) * Math.PI * 2 - Math.PI / 2;
      
      // Calculate position around the dial
      const textRadius = radius - 55;
      const x = centerX + textRadius * Math.cos(angle);
      const y = centerY + textRadius * Math.sin(angle);
      
      // Draw number
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(value.toString(), x, y);
      ctx.shadowBlur = 0;
    });
    
    // Draw dial pointer (indicator showing current direction)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.dialRotation);
    
    // Pointer shape (triangle pointing up) - bright red with glow
    ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(0, -radius + 28);
    ctx.lineTo(-15, -radius + 52);
    ctx.lineTo(15, -radius + 52);
    ctx.closePath();
    ctx.fill();
    
    // Pointer outline - golden
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
    
    // Center knob - festive red with golden border
    const knobGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 18);
    knobGradient.addColorStop(0, '#ff4444');
    knobGradient.addColorStop(1, '#cc0000');
    ctx.fillStyle = knobGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Center dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  /**
   * Rotate dial by a specific number of clicks in a direction
   * @param {number} clicks - Number of positions to move
   * @param {string} direction - 'L' for left (counter-clockwise) or 'R' for right (clockwise)
   * @param {number} duration - Animation duration in ms
   * @param {function} onComplete - Optional callback when rotation completes
   * @param {function} onPassZero - Optional callback when dial passes through zero (called once with count)
   */
  rotateBy(clicks, direction, duration = 1000, onComplete = null, onPassZero = null) {
    const startRotation = this.dialRotation;
    const startTime = Date.now();
    const startPosition = this.getCurrentPosition();
    
    // Calculate rotation amount (positive = clockwise, negative = counter-clockwise)
    const rotationAmount = direction === 'L' 
      ? -(clicks / 100) * Math.PI * 2  // Counter-clockwise
      : (clicks / 100) * Math.PI * 2;   // Clockwise
    
    const targetRotation = startRotation + rotationAmount;
    
    // Calculate final position
    const finalPosition = direction === 'L'
      ? (startPosition - clicks) % 100
      : (startPosition + clicks) % 100;
    const normalizedFinalPosition = finalPosition < 0 ? finalPosition + 100 : finalPosition;
    
    // Calculate how many times we land on or pass through zero during this rotation
    // Count when ARRIVING at zero, not when LEAVING zero
    let zeroCrossings = 0;
    if (onPassZero) {
      if (direction === 'L') {
        // Moving counter-clockwise (left)
        // Count: how many times do we land on position 0?
        if (startPosition === 0) {
          // Starting at 0: only count if we loop back around (100+ clicks)
          if (clicks >= 100) {
            zeroCrossings = Math.floor(clicks / 100);
          }
        } else {
          // Not starting at 0: count if we reach 0 and any subsequent loops
          if (clicks >= startPosition) {
            // First time reaching 0: after 'startPosition' clicks
            // Then every 100 clicks after that
            zeroCrossings = 1 + Math.floor((clicks - startPosition) / 100);
          }
        }
      } else {
        // Moving clockwise (right)
        // Count: how many times do we land on position 0?
        if (startPosition === 0) {
          // Starting at 0: only count if we loop back (100+ clicks)
          if (clicks >= 100) {
            zeroCrossings = Math.floor(clicks / 100);
          }
        } else {
          // Not starting at 0: count if we reach 0 and any subsequent loops
          const clicksToZero = 100 - startPosition;
          if (clicks >= clicksToZero) {
            // First time reaching 0: after 'clicksToZero' clicks
            // Then every 100 clicks after that
            zeroCrossings = 1 + Math.floor((clicks - clicksToZero) / 100);
          }
        }
      }
    }
    
    let lastClickPosition = startPosition;
    let zerosCrossedSoFar = 0;
    let hasLeftStartPosition = false; // Track if we've moved away from start
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      this.dialRotation = startRotation + (targetRotation - startRotation) * eased;
      this.draw();
      
      // Play click sound for each position passed
      const currentPosition = this.getCurrentPosition();
      if (currentPosition !== lastClickPosition) {
        audioManager.play('dial-click', 0.2);
        
        // Check if we just arrived at zero (not leaving it)
        if (onPassZero && zeroCrossings > 0 && currentPosition === 0) {
          // We just arrived at position 0
          // Only count if we haven't exceeded our expected crossings
          if (zerosCrossedSoFar < zeroCrossings) {
            zerosCrossedSoFar++;
            onPassZero(1); // Call with 1 to indicate we arrived at zero
          }
        }
        
        lastClickPosition = currentPosition;
      }
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        // Animation complete
        // If we somehow missed any zero crossings (shouldn't happen), call them now
        if (onPassZero && zerosCrossedSoFar < zeroCrossings) {
          const missedCrossings = zeroCrossings - zerosCrossedSoFar;
          onPassZero(missedCrossings);
        }
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete(normalizedFinalPosition);
        }
      }
    };
    
    animate();
  }
  
  /**
   * Rotate dial to a specific position (legacy method for backwards compatibility)
   * @param {number} position - Target position (0-99)
   * @param {number} duration - Animation duration in ms
   * @param {function} onComplete - Optional callback when rotation completes
   * @param {function} onPassZero - Optional callback when dial passes through zero
   */
  rotateTo(position, duration = 1000, onComplete = null, onPassZero = null) {
    const currentPosition = this.getCurrentPosition();
    const diff = position - currentPosition;
    
    // Determine shortest direction
    let clicks, direction;
    if (Math.abs(diff) <= 50) {
      clicks = Math.abs(diff);
      direction = diff >= 0 ? 'R' : 'L';
    } else {
      clicks = 100 - Math.abs(diff);
      direction = diff >= 0 ? 'L' : 'R';
    }
    
    this.rotateBy(clicks, direction, duration, onComplete, onPassZero);
  }
  
  /**
   * Increment the zero counter with animation
   */
  incrementZeroCounter() {
    this.zeroCounter++;
    const counterValue = this.counterElement.querySelector('.counter-value');
    counterValue.textContent = this.zeroCounter;
    
    // Trigger pop animation
    counterValue.style.animation = 'none';
    setTimeout(() => {
      counterValue.style.animation = 'counterPop 0.5s ease-out';
    }, 10);
  }
  
  /**
   * Reset the zero counter
   */
  resetZeroCounter() {
    this.zeroCounter = 0;
    const counterValue = this.counterElement.querySelector('.counter-value');
    counterValue.textContent = '0';
  }
  
  /**
   * Get current dial position (0-99)
   */
  getCurrentPosition() {
    const normalized = this.dialRotation % (Math.PI * 2);
    const position = Math.round((normalized / (Math.PI * 2)) * 100) % 100;
    return position < 0 ? position + 100 : position;
  }
  
  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.counterElement && this.counterElement.parentNode) {
      this.counterElement.parentNode.removeChild(this.counterElement);
    }
    if (this.instructionPanel && this.instructionPanel.parentNode) {
      this.instructionPanel.parentNode.removeChild(this.instructionPanel);
    }
  }
}
