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
    this.animationFrame = null;
    this.isActive = false;
    
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
    const launchInterval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(launchInterval);
        this.isActive = false;
        return;
      }
      
      // Launch 2-3 fireworks at random positions
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        this.launchFirework();
      }
    }, 400);
    
    this.animate();
    
    // Auto cleanup after duration
    setTimeout(() => {
      this.stop();
    }, duration + 2000);
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
    if (!this.isActive && this.particles.length === 0) {
      return;
    }
    
    // Clear canvas completely (transparent)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
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
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  stop() {
    this.isActive = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  
  cleanup() {
    this.stop();
    this.particles = [];
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
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
