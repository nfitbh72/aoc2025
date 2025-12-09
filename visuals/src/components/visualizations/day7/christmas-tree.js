/**
 * Christmas Tree component for Day 7
 * Displays the beam-splitting tree with festive decorations
 */

export class ChristmasTree {
  constructor(container, grid, onBeamHit, onBeamReachBottom) {
    this.container = container;
    this.grid = grid;
    this.onBeamHit = onBeamHit;
    this.onBeamReachBottom = onBeamReachBottom;
    this.canvas = null;
    this.ctx = null;
    this.beams = [];
    this.ornaments = new Map(); // Track ornaments at blocker positions
    this.sparkles = [];
    this.animationFrame = null;
    this.cellSize = 30;
    this.offsetX = 0;
    this.offsetY = 80;
    
    this.init();
  }
  
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 10;
    `;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // Center the tree
    this.offsetX = (this.canvas.width - this.grid[0].length * this.cellSize) / 2;
    
    // Draw initial tree
    this.drawTree();
  }
  
  drawTree() {
    // Draw Christmas tree background shape
    this.drawTreeBackground();
    
    // Draw the tree structure
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const char = this.grid[y][x];
        const px = this.offsetX + x * this.cellSize;
        const py = this.offsetY + y * this.cellSize;
        
        if (char === 'S') {
          // Draw star at top
          this.drawStar(px + this.cellSize / 2, py + this.cellSize / 2, 15, '#ffd700');
        } else if (char === '^') {
          // Draw ornament (blocker)
          this.drawOrnament(px + this.cellSize / 2, py + this.cellSize / 2, false);
        }
      }
    }
  }
  
  drawTreeBackground() {
    const centerX = this.canvas.width / 2;
    const treeTop = this.offsetY;
    const treeHeight = this.grid.length * this.cellSize;
    const treeWidth = this.grid[0].length * this.cellSize * 0.9;
    
    this.ctx.save();
    
    // Draw tree foliage (triangular shape)
    const gradient = this.ctx.createLinearGradient(
      centerX - treeWidth / 2, treeTop,
      centerX + treeWidth / 2, treeTop + treeHeight
    );
    gradient.addColorStop(0, '#0d5c0d');
    gradient.addColorStop(0.5, '#0f7d0f');
    gradient.addColorStop(1, '#0a4a0a');
    
    this.ctx.fillStyle = gradient;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = 'rgba(15, 125, 15, 0.5)';
    
    // Draw triangular tree shape
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, treeTop + 20); // Top point
    this.ctx.lineTo(centerX - treeWidth / 2, treeTop + treeHeight - 40); // Bottom left
    this.ctx.lineTo(centerX + treeWidth / 2, treeTop + treeHeight - 40); // Bottom right
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add some texture with darker triangles
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'rgba(10, 60, 10, 0.3)';
    
    // Left side shading
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, treeTop + 20);
    this.ctx.lineTo(centerX - treeWidth / 2, treeTop + treeHeight - 40);
    this.ctx.lineTo(centerX, treeTop + treeHeight / 2);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Draw tree trunk
    const trunkWidth = 40;
    const trunkHeight = 60;
    const trunkGradient = this.ctx.createLinearGradient(
      centerX - trunkWidth / 2, treeTop + treeHeight - 40,
      centerX + trunkWidth / 2, treeTop + treeHeight - 40
    );
    trunkGradient.addColorStop(0, '#4a2511');
    trunkGradient.addColorStop(0.5, '#6b3a1e');
    trunkGradient.addColorStop(1, '#4a2511');
    
    this.ctx.fillStyle = trunkGradient;
    this.ctx.fillRect(
      centerX - trunkWidth / 2,
      treeTop + treeHeight - 40,
      trunkWidth,
      trunkHeight
    );
    
    // Add trunk texture
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(
      centerX - trunkWidth / 2,
      treeTop + treeHeight - 40,
      trunkWidth / 3,
      trunkHeight
    );
    
    // Draw Christmas presents under the tree
    this.drawPresents(centerX, treeTop + treeHeight + 20);
    
    this.ctx.restore();
  }
  
  drawPresents(centerX, baseY) {
    // Present 1 - Red with gold ribbon
    this.drawPresent(centerX - 60, baseY, 40, 35, '#c41e3a', '#ffd700');
    
    // Present 2 - Green with red ribbon
    this.drawPresent(centerX - 10, baseY, 35, 40, '#27ae60', '#ff0000');
    
    // Present 3 - Blue with silver ribbon
    this.drawPresent(centerX + 35, baseY, 45, 30, '#3498db', '#c0c0c0');
    
    // Present 4 - Purple with gold ribbon (smaller, in front)
    this.drawPresent(centerX - 35, baseY + 15, 30, 25, '#9b59b6', '#ffd700');
    
    // Present 5 - Orange with white ribbon (smaller, in front)
    this.drawPresent(centerX + 10, baseY + 15, 28, 28, '#e67e22', '#ffffff');
  }
  
  drawPresent(x, y, width, height, boxColor, ribbonColor) {
    this.ctx.save();
    
    // Draw box
    const gradient = this.ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, boxColor);
    gradient.addColorStop(1, this.darkenColor(boxColor));
    
    this.ctx.fillStyle = gradient;
    this.ctx.shadowBlur = 5;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(x, y, width, height);
    
    // Draw vertical ribbon
    this.ctx.fillStyle = ribbonColor;
    this.ctx.fillRect(x + width / 2 - 3, y, 6, height);
    
    // Draw horizontal ribbon
    this.ctx.fillRect(x, y + height / 2 - 3, width, 6);
    
    // Draw bow
    this.ctx.fillStyle = ribbonColor;
    this.ctx.shadowBlur = 3;
    this.ctx.shadowColor = ribbonColor;
    
    // Left bow loop
    this.ctx.beginPath();
    this.ctx.arc(x + width / 2 - 8, y + height / 2, 6, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Right bow loop
    this.ctx.beginPath();
    this.ctx.arc(x + width / 2 + 8, y + height / 2, 6, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Center knot
    this.ctx.beginPath();
    this.ctx.arc(x + width / 2, y + height / 2, 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  darkenColor(color) {
    // Simple color darkening
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  drawStar(x, y, size, color) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = color;
    
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const outerX = x + Math.cos(angle) * size;
      const outerY = y + Math.sin(angle) * size;
      const innerAngle = angle + Math.PI / 5;
      const innerX = x + Math.cos(innerAngle) * (size * 0.4);
      const innerY = y + Math.sin(innerAngle) * (size * 0.4);
      
      if (i === 0) {
        this.ctx.moveTo(outerX, outerY);
      } else {
        this.ctx.lineTo(outerX, outerY);
      }
      this.ctx.lineTo(innerX, innerY);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }
  
  drawOrnament(x, y, lit) {
    const colors = lit 
      ? ['#ff0000', '#ffd700', '#00ff00', '#ff69b4', '#00ffff']
      : ['#8b0000', '#b8860b', '#006400', '#8b008b', '#008b8b'];
    
    const color = colors[Math.floor((x + y) * 7) % colors.length];
    
    this.ctx.save();
    
    // Ornament ball
    const gradient = this.ctx.createRadialGradient(x - 3, y - 3, 2, x, y, 10);
    gradient.addColorStop(0, lit ? '#ffffff' : color);
    gradient.addColorStop(1, color);
    
    this.ctx.fillStyle = gradient;
    if (lit) {
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = color;
    }
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Ornament cap
    this.ctx.fillStyle = '#ffd700';
    this.ctx.fillRect(x - 3, y - 12, 6, 4);
    
    this.ctx.restore();
  }
  
  addSparkle(x, y) {
    const sparkleEmojis = ['✨', '⭐', '💫', '🌟'];
    this.sparkles.push({
      x,
      y,
      emoji: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)],
      life: 1.0,
      vx: (Math.random() - 0.5) * 2,
      vy: -2 - Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    });
  }
  
  /**
   * Animate a beam traveling from start position
   */
  async animateBeam(startX, startY) {
    const beam = {
      gridX: startX,
      gridY: startY,
      x: this.offsetX + startX * this.cellSize + this.cellSize / 2,
      y: this.offsetY + startY * this.cellSize + this.cellSize / 2,
      targetY: this.offsetY + (startY + 1) * this.cellSize + this.cellSize / 2,
      progress: 0,
      speed: 0.1,
      trail: [],
      active: true
    };
    
    this.beams.push(beam);
    
    return new Promise((resolve) => {
      const checkBeam = () => {
        if (!beam.active) {
          resolve();
          return;
        }
        
        // Check if beam reached next row
        if (beam.gridY + 1 < this.grid.length) {
          const nextChar = this.grid[beam.gridY + 1][beam.gridX];
          
          if (nextChar === '^') {
            // Hit blocker - light it up and split
            const hitX = this.offsetX + beam.gridX * this.cellSize + this.cellSize / 2;
            const hitY = this.offsetY + (beam.gridY + 1) * this.cellSize + this.cellSize / 2;
            
            // Light up the ornament
            this.drawOrnament(hitX, hitY, true);
            this.ornaments.set(`${beam.gridX},${beam.gridY + 1}`, true);
            
            // Add sparkles
            for (let i = 0; i < 5; i++) {
              this.addSparkle(hitX, hitY);
            }
            
            // Notify hit
            if (this.onBeamHit) {
              this.onBeamHit(beam.gridX, beam.gridY + 1);
            }
            
            // Split into two beams
            beam.active = false;
            
            if (beam.gridX - 1 >= 0 && beam.gridY + 2 < this.grid.length) {
              setTimeout(() => this.animateBeam(beam.gridX - 1, beam.gridY + 1), 100);
            }
            if (beam.gridX + 1 < this.grid[0].length && beam.gridY + 2 < this.grid.length) {
              setTimeout(() => this.animateBeam(beam.gridX + 1, beam.gridY + 1), 100);
            }
            
            resolve();
          } else {
            // Continue moving down
            beam.gridY++;
            beam.targetY = this.offsetY + (beam.gridY + 1) * this.cellSize + this.cellSize / 2;
            setTimeout(checkBeam, 150);
          }
        } else {
          // Reached bottom
          beam.active = false;
          
          // Add sparkles at bottom
          for (let i = 0; i < 3; i++) {
            this.addSparkle(beam.x, beam.y);
          }
          
          // Notify that beam reached bottom
          if (this.onBeamReachBottom) {
            this.onBeamReachBottom(beam.gridX, beam.gridY);
          }
          
          resolve();
        }
      };
      
      setTimeout(checkBeam, 150);
    });
  }
  
  animate() {
    // Clear canvas with slight fade for trail effect
    this.ctx.fillStyle = 'rgba(10, 10, 30, 0.3)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Redraw tree
    this.drawTree();
    
    // Redraw lit ornaments
    this.ornaments.forEach((lit, key) => {
      const [x, y] = key.split(',').map(Number);
      const px = this.offsetX + x * this.cellSize + this.cellSize / 2;
      const py = this.offsetY + y * this.cellSize + this.cellSize / 2;
      this.drawOrnament(px, py, true);
    });
    
    // Update and draw beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const beam = this.beams[i];
      
      if (!beam.active) {
        this.beams.splice(i, 1);
        continue;
      }
      
      // Update position
      beam.progress += beam.speed;
      if (beam.progress > 1) beam.progress = 1;
      
      beam.y = beam.y + (beam.targetY - beam.y) * beam.speed;
      
      // Add to trail
      beam.trail.push({ x: beam.x, y: beam.y, alpha: 1.0 });
      if (beam.trail.length > 10) {
        beam.trail.shift();
      }
      
      // Draw trail
      beam.trail.forEach((point, index) => {
        const alpha = (index / beam.trail.length) * point.alpha;
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#00ffff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      });
      
      // Draw beam head
      this.ctx.save();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#00ffff';
      this.ctx.beginPath();
      this.ctx.arc(beam.x, beam.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    
    // Update and draw sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.2; // gravity
      s.rotation += s.rotationSpeed;
      s.life -= 0.02;
      
      if (s.life <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }
      
      this.ctx.save();
      this.ctx.globalAlpha = s.life;
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.translate(s.x, s.y);
      this.ctx.rotate(s.rotation);
      this.ctx.fillText(s.emoji, 0, 0);
      this.ctx.restore();
    }
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  start() {
    this.animate();
  }
  
  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
