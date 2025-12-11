/**
 * Shared 3D Christmas Ornament Visualization Module
 * Reusable components for Day 8 visualizations
 */

import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG } from './config.js';

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
    width: ${COMMON_CONFIG.SPACE_WIDTH}px;
    height: ${COMMON_CONFIG.SPACE_HEIGHT}px;
    perspective: ${COMMON_CONFIG.PERSPECTIVE}px;
    transform-style: preserve-3d;
  `;
  container.appendChild(space3D);
  
  const scene = document.createElement('div');
  scene.style.cssText = `
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: rotate3d ${COMMON_CONFIG.ROTATION_DURATION_S}s linear infinite;
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
      0% { transform: rotateX(${COMMON_CONFIG.ROTATION_X_DEG}deg) rotateY(0deg); }
      100% { transform: rotateX(${COMMON_CONFIG.ROTATION_X_DEG}deg) rotateY(360deg); }
    }
    @keyframes ornamentGlow {
      0%, 100% { filter: brightness(${COMMON_CONFIG.GLOW_BRIGHTNESS_MIN}) drop-shadow(0 0 ${COMMON_CONFIG.GLOW_DROP_SHADOW_SMALL}px currentColor); }
      50% { filter: brightness(${COMMON_CONFIG.GLOW_BRIGHTNESS_MAX}) drop-shadow(0 0 ${COMMON_CONFIG.GLOW_DROP_SHADOW_LARGE}px currentColor); }
    }
    @keyframes lightPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes twinkle {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(${COMMON_CONFIG.SPARKLE_SCALE_MAX}) rotate(${COMMON_CONFIG.SPARKLE_ROTATION_DEG}deg); }
    }
    @keyframes specialGlow {
      0%, 100% { 
        filter: brightness(${COMMON_CONFIG.SPECIAL_BRIGHTNESS}) drop-shadow(0 0 ${COMMON_CONFIG.SPECIAL_GLOW_SMALL}px ${COMMON_CONFIG.SPECIAL_COLOR}) drop-shadow(0 0 ${COMMON_CONFIG.SPECIAL_GLOW_LARGE}px ${COMMON_CONFIG.SPECIAL_COLOR});
        transform: scale(1);
      }
      50% { 
        filter: brightness(${COMMON_CONFIG.SPECIAL_BRIGHTNESS_PEAK}) drop-shadow(0 0 30px ${COMMON_CONFIG.SPECIAL_COLOR}) drop-shadow(0 0 ${COMMON_CONFIG.SPECIAL_GLOW_EXTRA}px ${COMMON_CONFIG.SPECIAL_COLOR});
        transform: scale(${COMMON_CONFIG.SPECIAL_SCALE});
      }
    }
  `;
  document.head.appendChild(style);
  return style;
}

/**
 * Normalize 3D coordinates to fit in display space
 */
export function normalize(coords, maxVal = COMMON_CONFIG.NORMALIZE_MAX_VAL, scale = COMMON_CONFIG.NORMALIZE_SCALE) {
  return coords.map(c => ((c / maxVal) - 0.5) * scale);
}

/**
 * Create a Christmas ornament at 3D position
 */
export function createOrnament(scene, coords, index, options = {}) {
  const {
    emoji = COMMON_CONFIG.ORNAMENT_EMOJI,
    colors = COMMON_CONFIG.ORNAMENT_COLORS,
    size = COMMON_CONFIG.ORNAMENT_SIZE,
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
    animation: ${special ? 'specialGlow' : 'ornamentGlow'} ${COMMON_CONFIG.ORNAMENT_GLOW_DURATION_S}s ease-in-out infinite;
    animation-delay: ${index * COMMON_CONFIG.ORNAMENT_ANIMATION_DELAY_S}s;
    color: ${special ? COMMON_CONFIG.SPECIAL_COLOR : color};
    cursor: ${interactive ? 'pointer' : 'default'};
    filter: drop-shadow(0 0 ${COMMON_CONFIG.CONNECTION_GLOW_SMALL}px ${special ? COMMON_CONFIG.SPECIAL_COLOR : color});
    transition: all ${COMMON_CONFIG.ORNAMENT_TRANSITION_DURATION_S}s ease;
    z-index: ${special ? COMMON_CONFIG.SPECIAL_Z_INDEX : 1};
  `;
  ornament.textContent = emoji;
  ornament.dataset.index = index;
  ornament.dataset.x = x;
  ornament.dataset.y = y;
  ornament.dataset.z = z;
  
  if (interactive) {
    ornament.addEventListener('mouseenter', () => {
      ornament.style.transform = `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%) scale(${COMMON_CONFIG.ORNAMENT_HOVER_SCALE})`;
      audioManager.play(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.DING_VOLUME);
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
    colors = COMMON_CONFIG.CONNECTION_COLORS,
    colorIndex = 0,
    width = COMMON_CONFIG.CONNECTION_WIDTH,
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
  
  const color = special ? COMMON_CONFIG.SPECIAL_COLOR : colors[colorIndex % colors.length];
  
  line.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${special ? width * COMMON_CONFIG.SPECIAL_CONNECTION_WIDTH_MULTIPLIER : width}px;
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
    box-shadow: 0 0 ${special ? COMMON_CONFIG.SPECIAL_GLOW_SMALL : COMMON_CONFIG.CONNECTION_GLOW_SMALL}px ${color}, 0 0 ${special ? COMMON_CONFIG.SPECIAL_GLOW_LARGE : COMMON_CONFIG.CONNECTION_GLOW_LARGE}px ${color};
    animation: lightPulse ${COMMON_CONFIG.CONNECTION_PULSE_DURATION_S}s ease-in-out infinite;
    animation-delay: ${colorIndex * COMMON_CONFIG.CONNECTION_ANIMATION_DELAY_S}s;
    opacity: 0;
    transition: opacity ${COMMON_CONFIG.CONNECTION_FADE_IN_TRANSITION_S}s ease-in;
    z-index: ${special ? 50 : 1};
  `;
  
  scene.appendChild(line);
  
  // Fade in
  setTimeout(() => {
    line.style.opacity = special ? COMMON_CONFIG.SPECIAL_CONNECTION_OPACITY : COMMON_CONFIG.CONNECTION_OPACITY;
    if (playSound) {
      audioManager.play(COMMON_CONFIG.SOUND_NAME_ENERGY, COMMON_CONFIG.ENERGY_VOLUME);
    }
  }, COMMON_CONFIG.CONNECTION_FADE_IN_DURATION_MS);
  
  return line;
}

/**
 * Create sparkle effect at 3D position
 */
export function createSparkle(scene, x, y, z, emoji = COMMON_CONFIG.SPARKLE_EMOJI) {
  const sparkle = document.createElement('div');
  sparkle.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%);
    font-size: ${COMMON_CONFIG.SPARKLE_SIZE}px;
    animation: twinkle ${COMMON_CONFIG.SPARKLE_DURATION_MS / 1000}s ease-in-out;
    pointer-events: none;
  `;
  sparkle.textContent = emoji;
  scene.appendChild(sparkle);
  
  setTimeout(() => {
    if (sparkle.parentNode) {
      sparkle.parentNode.removeChild(sparkle);
    }
  }, COMMON_CONFIG.SPARKLE_DURATION_MS);
  
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
        audioManager.play(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.DING_VOLUME);
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
