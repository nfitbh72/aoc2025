/**
 * Safe visual component for Day 1
 * Shared between part 1 and part 2
 */

import { audioManager } from '../../../utils/audio.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';

export class Safe {
  constructor(container, instructionText = '', directions = []) {
    this.container = container;
    // Start at position 50 (bottom of dial = 6 o'clock = π radians)
    this.dialRotation = Math.PI;
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.zeroCounter = 0;
    this.counterBox = null;
    this.instructionPanel = null;
    this.notepad = null;
    this.directions = directions;
    this.currentDirectionIndex = -1;
    this.soundsLoaded = false;
    this.isOpen = false;
    this.doorAngle = 0;
    this.isCleanedUp = false; // Flag to stop all animations
    
    this.init(instructionText);
    this.loadSounds();
  }
  
  async loadSounds() {
    await audioManager.loadSound('dial-click', 'click.mp3');
    await audioManager.loadSound('zero-hit', 'ding.mp3');
    this.soundsLoaded = true;
  }
  
  init(instructionText) {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    
    // Create counter box
    this.counterBox = new CounterBox(this.container, 'Safe Password');
    
    // Create instruction panel if text provided
    if (instructionText) {
      this.instructionPanel = new InstructionPanel(this.container, instructionText);
    }
    
    // Create notepad if directions provided
    if (this.directions.length > 0) {
      this.createNotepad();
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
  
  createNotepad() {
    this.notepad = document.createElement('div');
    this.notepad.style.cssText = `
      position: absolute;
      top: 50%;
      left: calc(50% - 50px);
      transform: translate(-200%, -50%) rotate(-3deg);
      width: 90px;
      padding: 10px;
      background: #fffef0;
      border: 1px solid #d4c5a9;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      font-family: 'Comic Sans MS', 'Brush Script MT', cursive;
      font-size: 11px;
      line-height: 1.5;
      color: #2c3e50;
      z-index: 150;
      transform-origin: left center;
      transition: transform 0.5s ease-out;
    `;
    
    const noteTitle = document.createElement('div');
    noteTitle.textContent = 'Combo:';
    noteTitle.style.cssText = `
      font-weight: bold;
      margin-bottom: 5px;
      text-decoration: underline;
      font-size: 10px;
    `;
    this.notepad.appendChild(noteTitle);
    
    this.directions.forEach((dir, index) => {
      const line = document.createElement('div');
      line.textContent = `${index + 1}. ${dir}`;
      line.style.cssText = `
        margin: 1px 0;
        opacity: 0.7;
        transition: all 0.3s ease;
        font-size: 10px;
      `;
      line.dataset.index = index;
      this.notepad.appendChild(line);
    });
    
    this.container.appendChild(this.notepad);
  }
  
  highlightDirection(index) {
    if (!this.notepad) return;
    
    this.currentDirectionIndex = index;
    
    // Reset all lines
    this.notepad.querySelectorAll('[data-index]').forEach(line => {
      line.style.opacity = '0.7';
      line.style.fontWeight = 'normal';
      line.style.color = '#2c3e50';
    });
    
    // Highlight current
    const currentLine = this.notepad.querySelector(`[data-index="${index}"]`);
    if (currentLine) {
      currentLine.style.opacity = '1';
      currentLine.style.fontWeight = 'bold';
      currentLine.style.color = '#e74c3c';
    }
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
    
    // If safe is open, draw presents inside
    if (this.isOpen) {
      this.drawPresents(ctx, safeX, safeY, safeWidth, safeHeight);
    }
    
    // Draw door (if opening or open)
    if (this.isOpen) {
      this.drawDoor(ctx, safeX, safeY, safeWidth, safeHeight);
    }
    
    // Draw dial (centered on safe) - only if not open
    if (!this.isOpen) {
      const dialCenterX = width / 2;
      const dialCenterY = height / 2;
      const dialRadius = Math.min(safeWidth, safeHeight) * 0.25;
      
      this.drawDial(ctx, dialCenterX, dialCenterY, dialRadius);
    }
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
      // Stop animation if cleaned up
      if (this.isCleanedUp) {
        return;
      }
      
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
  incrementCounter() {
    this.zeroCounter++;
    this.counterBox.setValue(this.zeroCounter);
  }
  
  /**
   * Mark visualization as complete (change counter to green)
   */
  markComplete() {
    // Change counter box to green
    this.counterBox.markComplete();
    
    // Open the safe to reveal presents
    this.openSafe();
  }
  
  /**
   * Open the safe door and reveal presents inside
   */
  openSafe() {
    const duration = 2000;
    const startTime = Date.now();
    
    const animateDoor = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth opening
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      this.doorAngle = eased * Math.PI / 2;
      this.draw();
      
      // Update notepad rotation to match door
      if (this.notepad) {
        const angleInDegrees = -(this.doorAngle * 180 / Math.PI);
        this.notepad.style.transform = `translate(-200%, -50%) rotate(${angleInDegrees - 3}deg)`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateDoor);
      }
    };
    
    this.doorAngle = 0;
    this.isOpen = true;
    animateDoor();
  }
  
  /**
   * Draw presents inside the safe with candy cane shelf
   */
  drawPresents(ctx, safeX, safeY, safeWidth, safeHeight) {
    // Draw candy cane shelf
    const shelfY = safeY + safeHeight * 0.6;
    const shelfHeight = 15;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(safeX + 20, shelfY, safeWidth - 40, shelfHeight);
    
    // Add candy cane stripes to shelf
    ctx.save();
    ctx.fillStyle = '#c41e3a';
    for (let i = 0; i < safeWidth - 40; i += 20) {
      ctx.fillRect(safeX + 20 + i, shelfY, 10, shelfHeight);
    }
    ctx.restore();
    
    // Draw presents - various sizes and colors
    const presents = [
      { x: 0.2, y: 0.65, w: 60, h: 70, color: '#27ae60', ribbon: '#ffd700' },
      { x: 0.4, y: 0.7, w: 50, h: 50, color: '#3498db', ribbon: '#e74c3c' },
      { x: 0.6, y: 0.68, w: 55, h: 65, color: '#9b59b6', ribbon: '#fff' },
      { x: 0.75, y: 0.72, w: 45, h: 55, color: '#e67e22', ribbon: '#27ae60' },
      { x: 0.25, y: 0.4, w: 50, h: 60, color: '#e74c3c', ribbon: '#ffd700' },
      { x: 0.5, y: 0.35, w: 65, h: 75, color: '#ffd700', ribbon: '#c41e3a' },
      { x: 0.7, y: 0.42, w: 48, h: 58, color: '#1abc9c', ribbon: '#fff' },
    ];
    
    presents.forEach(present => {
      const px = safeX + safeWidth * present.x;
      const py = safeY + safeHeight * present.y;
      
      // Present box
      ctx.fillStyle = present.color;
      ctx.fillRect(px, py, present.w, present.h);
      
      // Box shadow for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(px + 2, py + 2, present.w, present.h);
      ctx.fillStyle = present.color;
      ctx.fillRect(px, py, present.w, present.h);
      
      // Ribbon vertical
      ctx.fillStyle = present.ribbon;
      ctx.fillRect(px + present.w / 2 - 3, py, 6, present.h);
      
      // Ribbon horizontal
      ctx.fillRect(px, py + present.h / 3, present.w, 6);
      
      // Bow
      ctx.beginPath();
      ctx.arc(px + present.w / 2, py + present.h / 3, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  /**
   * Draw the safe door swinging open
   */
  drawDoor(ctx, safeX, safeY, safeWidth, safeHeight) {
    ctx.save();
    
    // Door pivot point (left edge)
    const pivotX = safeX;
    const pivotY = safeY + safeHeight / 2;
    
    ctx.translate(pivotX, pivotY);
    ctx.rotate(-this.doorAngle);
    ctx.translate(-pivotX, -pivotY);
    
    // Door - same festive red as safe
    const gradient = ctx.createLinearGradient(safeX, safeY, safeX + safeWidth, safeY + safeHeight);
    gradient.addColorStop(0, '#c41e3a');
    gradient.addColorStop(0.5, '#e74c3c');
    gradient.addColorStop(1, '#c41e3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(safeX, safeY, safeWidth, safeHeight);
    
    // Golden border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 10;
    ctx.strokeRect(safeX, safeY, safeWidth, safeHeight);
    
    // Draw dial on door
    const dialCenterX = safeX + safeWidth / 2;
    const dialCenterY = safeY + safeHeight / 2;
    const dialRadius = Math.min(safeWidth, safeHeight) * 0.25;
    this.drawDial(ctx, dialCenterX, dialCenterY, dialRadius);
    
    ctx.restore();
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
    // Set cleanup flag to stop all animations
    this.isCleanedUp = true;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.counterBox) {
      this.counterBox.cleanup();
    }
    if (this.instructionPanel) {
      this.instructionPanel.cleanup();
    }
    if (this.notepad && this.notepad.parentNode) {
      this.notepad.parentNode.removeChild(this.notepad);
    }
  }
}
