/**
 * Shared 3D Christmas Ornament Visualization Module
 * Reusable components for Day 8 visualizations
 */

import { audioManager } from '../../../utils/audio.js';

/**
 * Create 3D space container with perspective
 */
export function create3DSpace(container) {
  const space3D = document.createElement('div');
  space3D.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    perspective: 1200px;
    transform-style: preserve-3d;
  `;
  container.appendChild(space3D);
  
  const scene = document.createElement('div');
  scene.style.cssText = `
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: rotate3d 30s linear infinite;
  `;
  space3D.appendChild(scene);
  
  return { space3D, scene };
}

/**
 * Add CSS animations for 3D ornaments
 */
export function addOrnamentStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rotate3d {
      0% { transform: rotateX(20deg) rotateY(0deg); }
      100% { transform: rotateX(20deg) rotateY(360deg); }
    }
    @keyframes ornamentGlow {
      0%, 100% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
      50% { filter: brightness(1.5) drop-shadow(0 0 15px currentColor); }
    }
    @keyframes lightPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes twinkle {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.2) rotate(180deg); }
    }
    @keyframes specialGlow {
      0%, 100% { 
        filter: brightness(1.5) drop-shadow(0 0 20px gold) drop-shadow(0 0 40px gold);
        transform: scale(1);
      }
      50% { 
        filter: brightness(2) drop-shadow(0 0 30px gold) drop-shadow(0 0 60px gold);
        transform: scale(1.3);
      }
    }
  `;
  document.head.appendChild(style);
  return style;
}

/**
 * Normalize 3D coordinates to fit in display space
 */
export function normalize(coords, maxVal = 1000, scale = 500) {
  return coords.map(c => ((c / maxVal) - 0.5) * scale);
}

/**
 * Create a Christmas ornament at 3D position
 */
export function createOrnament(scene, coords, index, options = {}) {
  const {
    emoji = '🎄',
    colors = ['#ff0000', '#00ff00', '#0088ff', '#ffaa00', '#ff00ff', '#00ffff'],
    size = 30,
    interactive = true,
    special = false
  } = options;
  
  const [x, y, z] = normalize(coords);
  
  const ornament = document.createElement('div');
  const color = colors[index % colors.length];
  
  ornament.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${size}px;
    height: ${size}px;
    transform: translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%);
    font-size: ${size}px;
    animation: ${special ? 'specialGlow' : 'ornamentGlow'} 2s ease-in-out infinite;
    animation-delay: ${index * 0.1}s;
    color: ${special ? 'gold' : color};
    cursor: ${interactive ? 'pointer' : 'default'};
    filter: drop-shadow(0 0 10px ${special ? 'gold' : color});
    transition: all 0.3s ease;
    z-index: ${special ? 100 : 1};
  `;
  ornament.textContent = emoji;
  ornament.dataset.index = index;
  ornament.dataset.x = x;
  ornament.dataset.y = y;
  ornament.dataset.z = z;
  
  if (interactive) {
    ornament.addEventListener('mouseenter', () => {
      ornament.style.transform = `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%) scale(1.5)`;
      audioManager.play('ding', 0.3);
    });
    ornament.addEventListener('mouseleave', () => {
      ornament.style.transform = `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%) scale(1)`;
    });
  }
  
  scene.appendChild(ornament);
  return ornament;
}

/**
 * Create glowing light string connection between two ornaments
 */
export function createConnection(scene, from, to, options = {}) {
  const {
    colors = ['#ffff00', '#ff00ff', '#00ffff', '#ff8800'],
    colorIndex = 0,
    width = 3,
    playSound = true,
    special = false
  } = options;
  
  const line = document.createElement('div');
  const x1 = parseFloat(from.dataset.x);
  const y1 = parseFloat(from.dataset.y);
  const z1 = parseFloat(from.dataset.z);
  const x2 = parseFloat(to.dataset.x);
  const y2 = parseFloat(to.dataset.y);
  const z2 = parseFloat(to.dataset.z);
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
  
  // Calculate rotation angles
  const angleY = Math.atan2(dx, dz) * 180 / Math.PI;
  const angleX = Math.atan2(dy, Math.sqrt(dx*dx + dz*dz)) * 180 / Math.PI;
  
  const color = special ? 'gold' : colors[colorIndex % colors.length];
  
  line.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${special ? width * 2 : width}px;
    height: ${length}px;
    background: linear-gradient(to bottom, 
      ${color} 0%, 
      transparent 50%, 
      ${color} 100%);
    transform-origin: top center;
    transform: translate3d(${x1}px, ${y1}px, ${z1}px) 
               rotateY(${angleY}deg) 
               rotateX(${-angleX}deg) 
               translateX(-50%);
    box-shadow: 0 0 ${special ? 20 : 10}px ${color}, 0 0 ${special ? 40 : 20}px ${color};
    animation: lightPulse 1.5s ease-in-out infinite;
    animation-delay: ${colorIndex * 0.1}s;
    opacity: 0;
    transition: opacity 0.5s ease-in;
    z-index: ${special ? 50 : 1};
  `;
  
  scene.appendChild(line);
  
  // Fade in
  setTimeout(() => {
    line.style.opacity = special ? '1' : '0.8';
    if (playSound) {
      audioManager.play('energy', 0.4);
    }
  }, 50);
  
  return line;
}

/**
 * Create sparkle effect at 3D position
 */
export function createSparkle(scene, x, y, z, emoji = '✨') {
  const sparkle = document.createElement('div');
  sparkle.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%);
    font-size: 20px;
    animation: twinkle 1s ease-in-out;
    pointer-events: none;
  `;
  sparkle.textContent = emoji;
  scene.appendChild(sparkle);
  
  setTimeout(() => {
    if (sparkle.parentNode) {
      sparkle.parentNode.removeChild(sparkle);
    }
  }, 1000);
  
  return sparkle;
}

/**
 * Create ornaments from coordinate array
 */
export async function createOrnaments(scene, boxes, timers, options = {}) {
  const {
    delay = 100,
    playSound = true,
    sparkles = true,
    onOrnamentCreated = null
  } = options;
  
  const ornaments = [];
  
  boxes.forEach((coords, index) => {
    timers.push(setTimeout(() => {
      const ornament = createOrnament(scene, coords, index, options);
      ornaments.push(ornament);
      
      if (playSound) {
        audioManager.play('ding', 0.3);
      }
      
      if (sparkles) {
        const [x, y, z] = normalize(coords);
        createSparkle(scene, x, y, z);
      }
      
      if (onOrnamentCreated) {
        onOrnamentCreated(ornament, index);
      }
    }, index * delay));
  });
  
  // Wait for all ornaments to appear
  await new Promise(resolve => {
    timers.push(setTimeout(resolve, boxes.length * delay + 500));
  });
  
  return ornaments;
}

/**
 * Create connections between ornaments
 */
export async function createConnections(scene, ornaments, connectionPairs, timers, options = {}) {
  const {
    delay = 400,
    onConnectionCreated = null
  } = options;
  
  const connections = [];
  
  for (let i = 0; i < connectionPairs.length; i++) {
    const [from_idx, to_idx] = connectionPairs[i];
    const line = createConnection(
      scene, 
      ornaments[from_idx], 
      ornaments[to_idx],
      { ...options, colorIndex: i }
    );
    connections.push(line);
    
    if (onConnectionCreated) {
      await onConnectionCreated(line, i, from_idx, to_idx);
    }
    
    await new Promise(resolve => timers.push(setTimeout(resolve, delay)));
  }
  
  return connections;
}
