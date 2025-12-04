/**
 * Celebration utilities - fireworks and sounds
 * Shared across all day visualizations
 */

import { audioManager } from './audio.js';

class Fireworks {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.snowflakes = [];
    this.groundSnow = []; // Track accumulated snow at bottom
    this.flyingEmojis = []; // Flying Christmas emojis
    this.animationFrame = null;
    this.launchInterval = null;
    this.emojiInterval = null;
    this.isActive = false;
    
    this.christmasEmojis = ['🎄', '🎅', '🤶', '🎁', '🎀', '⭐', '✨', '❄️', '☃️', '⛄', '🔔', '🕯️', '🦌', '🧦', '🍪', '🥛', '🎶', '🌟', '💫', '🎊', '🎉', '👼', '🌠'];
    
    this.init();
  }
  
  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1000;
    `;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }
  
  start(duration = 5000) {
    this.isActive = true;
    const startTime = Date.now();
    
    // Launch fireworks at intervals
    this.launchInterval = setInterval(() => {
      if (!this.isActive) {
        clearInterval(this.launchInterval);
        return;
      }
      
      // Launch 2-3 fireworks at random positions
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        this.launchFirework();
      }
      
      // Add snowflakes continuously
      for (let i = 0; i < 3; i++) {
        this.addSnowflake();
      }
    }, 400);
    
    // Launch flying emoji every 2 seconds
    this.emojiInterval = setInterval(() => {
      if (!this.isActive) {
        clearInterval(this.emojiInterval);
        return;
      }
      this.launchFlyingEmoji();
    }, 2000);
    
    // Launch first emoji immediately
    this.launchFlyingEmoji();
    
    this.animate();
    
    // Don't auto cleanup - let it run until manually stopped
  }
  
  launchFlyingEmoji() {
    const emoji = this.christmasEmojis[Math.floor(Math.random() * this.christmasEmojis.length)];
    const startY = Math.random() * this.canvas.height * 0.6 + this.canvas.height * 0.2;
    const direction = Math.random() > 0.5 ? 1 : -1; // Left to right or right to left
    
    this.flyingEmojis.push({
      emoji,
      x: direction > 0 ? -50 : this.canvas.width + 50,
      y: startY,
      baseY: startY,
      vx: direction * (2 + Math.random() * 2), // Speed
      time: 0,
      amplitude: 30 + Math.random() * 40, // Sine wave height
      frequency: 0.02 + Math.random() * 0.02, // Sine wave frequency
      noiseOffset: Math.random() * 100, // For smooth randomness
      size: 30 + Math.random() * 20
    });
  }
  
  addSnowflake() {
    this.snowflakes.push({
      x: Math.random() * this.canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 0.5, // Slight horizontal drift
      vy: 0.5 + Math.random() * 1, // Fall speed
      size: 2 + Math.random() * 3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05
    });
  }
  
  launchFirework() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height * 0.5 + this.canvas.height * 0.2;
    
    const colors = [
      '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
      '#ff00ff', '#00ffff', '#ffd700', '#ff6600'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create explosion particles
    const particleCount = 50 + Math.floor(Math.random() * 30);
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1.0,
        decay: 0.01 + Math.random() * 0.01,
        size: 2 + Math.random() * 3,
        color,
        gravity: 0.05
      });
    }
  }
  
  animate() {
    if (!this.isActive && this.particles.length === 0 && this.snowflakes.length === 0 && this.flyingEmojis.length === 0) {
      return;
    }
    
    // Clear canvas completely (transparent)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw accumulated snow at bottom
    this.drawGroundSnow();
    
    // Update and draw flying emojis
    for (let i = this.flyingEmojis.length - 1; i >= 0; i--) {
      const e = this.flyingEmojis[i];
      
      // Update position
      e.x += e.vx;
      e.time += 1;
      
      // Sine wave motion with smooth randomness
      const sineWave = Math.sin(e.time * e.frequency) * e.amplitude;
      const smoothNoise = Math.sin((e.time + e.noiseOffset) * 0.01) * 15;
      e.y = e.baseY + sineWave + smoothNoise;
      
      // Remove if off screen
      if ((e.vx > 0 && e.x > this.canvas.width + 100) || 
          (e.vx < 0 && e.x < -100)) {
        this.flyingEmojis.splice(i, 1);
        continue;
      }
      
      // Draw emoji
      this.ctx.save();
      this.ctx.font = `${e.size}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fillText(e.emoji, e.x, e.y);
      this.ctx.restore();
    }
    
    // Update and draw firework particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
      
      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Draw particle
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    
    // Update and draw snowflakes
    for (let i = this.snowflakes.length - 1; i >= 0; i--) {
      const s = this.snowflakes[i];
      
      // Update position
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotationSpeed;
      
      // Check if snowflake reached the ground
      if (s.y >= this.canvas.height - 20) {
        // Add to ground snow
        this.groundSnow.push({
          x: s.x,
          size: s.size
        });
        this.snowflakes.splice(i, 1);
        continue;
      }
      
      // Draw snowflake
      this.drawSnowflake(s);
    }
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  drawSnowflake(s) {
    this.ctx.save();
    this.ctx.translate(s.x, s.y);
    this.ctx.rotate(s.rotation);
    this.ctx.fillStyle = 'white';
    this.ctx.shadowBlur = 5;
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    
    // Draw simple snowflake shape
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const x = Math.cos(angle) * s.size;
      const y = Math.sin(angle) * s.size;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  drawGroundSnow() {
    if (this.groundSnow.length === 0) return;
    
    // Draw accumulated snow as a gradient at the bottom
    const maxHeight = Math.min(this.groundSnow.length * 0.5, this.canvas.height * 0.3);
    
    const gradient = this.ctx.createLinearGradient(
      0, this.canvas.height - maxHeight,
      0, this.canvas.height
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, this.canvas.height - maxHeight, this.canvas.width, maxHeight);
    
    // Draw individual snow particles on top
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = Math.max(0, this.groundSnow.length - 100); i < this.groundSnow.length; i++) {
      const snow = this.groundSnow[i];
      const y = this.canvas.height - (this.groundSnow.length - i) * 0.3;
      this.ctx.beginPath();
      this.ctx.arc(snow.x, y, snow.size * 0.8, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  stop() {
    this.isActive = false;
    if (this.launchInterval) {
      clearInterval(this.launchInterval);
    }
    if (this.emojiInterval) {
      clearInterval(this.emojiInterval);
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  
  cleanup() {
    this.stop();
    
    // Give particles a moment to finish their animation before removing
    setTimeout(() => {
      this.particles = [];
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }, 1500);
  }
}

/**
 * Celebrate with fireworks and sound
 * @param {HTMLElement} container - Container element for fireworks
 * @param {number} duration - Duration of celebration in ms (default 5000)
 * @returns {Fireworks} Fireworks instance for cleanup
 */
export function celebrate(container, duration = 5000) {
  // Play celebration sound
  audioManager.play('celebration', 0.8);
  
  // Start fireworks
  const fireworks = new Fireworks(container);
  fireworks.start(duration);
  
  return fireworks;
}

/**
 * Load celebration assets (call once at app startup)
 */
export async function loadCelebrationAssets() {
  await audioManager.loadSound('celebration', 'yay.mp3');
}
