/**
 * Shared utilities for Day 4 visualizations
 */

import { audioManager } from '../../../utils/audio.js';

/**
 * Create and position Santa element
 */
export function createSanta(container) {
  const santaElement = document.createElement('div');
  santaElement.textContent = '🎅';
  santaElement.style.cssText = `
    position: absolute;
    font-size: 30px;
    transition: all 0.3s ease;
    z-index: 100;
    pointer-events: none;
    transform: translate(-50%, -50%);
  `;
  container.appendChild(santaElement);
  return santaElement;
}

/**
 * Position Santa at a grid location (right next to the tree)
 */
export function positionSanta(santaElement, x, y, containerWidth) {
  const cellSize = 40;
  const gridPadding = 20;
  // Grid is moved 150px left from center: left: 50%, transform: translateX(calc(-50% - 150px))
  const gridLeft = (containerWidth / 2) - 150 - (400 / 2) + gridPadding;
  const gridTop = 150 + gridPadding; // top: 150px + padding
  
  // Position Santa's center right next to the tree (to the right of the cell)
  // Move Santa left by 1.5 grid item widths
  santaElement.style.left = `${gridLeft + x * cellSize + cellSize + 15 - (cellSize * 1.5)}px`;
  santaElement.style.top = `${gridTop + y * cellSize + cellSize / 2}px`;
}

/**
 * Create particle effect at the tree's position
 */
export function createParticles(container, x, y, containerWidth) {
  const cellSize = 40;
  const gridLeft = (containerWidth - 400) / 2;
  const gridTop = 200;
  const centerX = gridLeft + x * cellSize + cellSize / 2;
  const centerY = gridTop + y * cellSize + cellSize / 2;
  
  const particleEmojis = ['✨', '⭐', '🎁', '🔔', '❄️', '💫'];
  
  // Create 12 particles
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: 20px;
      pointer-events: none;
      z-index: 1000;
      transition: all 0.6s ease-out;
      filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
    `;
    container.appendChild(particle);
    
    // Animate particle outward
    setTimeout(() => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      
      particle.style.left = `${centerX + offsetX}px`;
      particle.style.top = `${centerY + offsetY}px`;
      particle.style.opacity = '0';
      particle.style.transform = 'scale(0.3)';
    }, 10);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 650);
  }
}

/**
 * Create the grid of trees
 */
export function createTreeGrid(container, gridData) {
  // Add CSS animations if not already added
  if (!document.getElementById('day4-animations')) {
    const style = document.createElement('style');
    style.id = 'day4-animations';
    style.textContent = `
      @keyframes treeGlow {
        0%, 100% { filter: drop-shadow(0 0 12px rgba(0, 255, 0, 0.8)); }
        50% { filter: drop-shadow(0 0 20px rgba(0, 255, 0, 1)); }
      }
      @keyframes ornamentTwinkle {
        0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 215, 0, 1)); }
        50% { opacity: 0.7; transform: scale(1.3); filter: drop-shadow(0 0 10px rgba(255, 215, 0, 1)); }
      }
      @keyframes gridPulse {
        0%, 100% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.15); }
        50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), inset 0 0 50px rgba(255, 255, 255, 0.25); }
      }
    `;
    document.head.appendChild(style);
  }
  
  const gridContainer = document.createElement('div');
  gridContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(10, 40px);
    grid-gap: 0;
    position: absolute;
    left: 50%;
    top: 150px;
    transform: translateX(calc(-50% - 150px));
    padding: 20px;
    background: linear-gradient(135deg, rgba(255, 50, 80, 0.08) 0%, rgba(20, 200, 120, 0.08) 100%);
    border-radius: 15px;
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.15);
    border: 3px solid rgba(255, 215, 0, 0.8);
    animation: gridPulse 3s ease-in-out infinite;
  `;
  container.appendChild(gridContainer);
  
  const grid = gridData.map(row => row.split(''));
  const cellElements = [];
  
  grid.forEach((row, y) => {
    const rowElements = [];
    row.forEach((cell, x) => {
      const cellElement = document.createElement('div');
      cellElement.style.cssText = `
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        transition: all 0.3s ease;
        position: relative;
      `;
      
      if (cell === '@') {
        cellElement.textContent = '🎄';
        // Add festive glow to trees
        cellElement.style.filter = 'drop-shadow(0 0 12px rgba(0, 255, 0, 0.8)) brightness(1.2)';
        cellElement.style.animation = `treeGlow ${2 + Math.random()}s ease-in-out infinite`;
        
        // Random ornaments on some trees
        if (Math.random() > 0.7) {
          const ornament = document.createElement('div');
          ornament.textContent = ['🔴', '🟡', '⭐'][Math.floor(Math.random() * 3)];
          ornament.style.cssText = `
            position: absolute;
            font-size: 12px;
            top: ${5 + Math.random() * 15}px;
            left: ${10 + Math.random() * 15}px;
            animation: ornamentTwinkle ${1 + Math.random()}s ease-in-out infinite;
          `;
          cellElement.appendChild(ornament);
        }
      } else {
        cellElement.textContent = '❄️';
        cellElement.style.opacity = '0.4';
        cellElement.style.fontSize = '16px';
        cellElement.style.filter = 'drop-shadow(0 0 3px rgba(150, 200, 255, 0.6))';
      }
      
      gridContainer.appendChild(cellElement);
      rowElements.push(cellElement);
    });
    cellElements.push(rowElements);
  });
  
  return { gridContainer, grid, cellElements };
}

/**
 * Count adjacent matching characters in grid
 */
export function getAdjacentCount(grid, x, y, char) {
  let count = 0;
  const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
  ];
  
  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;
    if (newY >= 0 && newY < grid.length && newX >= 0 && newX < grid[0].length) {
      if (grid[newY][newX] === char) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Load audio assets for Day 4
 */
export async function loadDay4Audio() {
  await audioManager.loadSound('land', 'ding.mp3');
  await audioManager.loadSound('collect', 'log-split.mp3');
}

/**
 * Create a bucket element for collecting trees
 */
export function createBucket(container) {
  const bucketContainer = document.createElement('div');
  bucketContainer.style.cssText = `
    position: absolute;
    right: 25%;
    top: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  `;
  
  // Bucket label
  const label = document.createElement('div');
  label.textContent = 'Tree Collection';
  label.style.cssText = `
    font-size: 18px;
    color: #ffd700;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  `;
  bucketContainer.appendChild(label);
  
  // Bucket body
  const bucket = document.createElement('div');
  bucket.style.cssText = `
    width: 200px;
    height: 220px;
    background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
    border: 4px solid #5D3A1A;
    border-radius: 0 0 15px 15px;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 -20px 30px rgba(0, 0, 0, 0.3);
    clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
  `;
  
  // Bucket rim
  const rim = document.createElement('div');
  rim.style.cssText = `
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 110%;
    height: 12px;
    background: linear-gradient(180deg, #A0522D 0%, #8B4513 100%);
    border-radius: 8px;
    border: 2px solid #5D3A1A;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  `;
  bucket.appendChild(rim);
  
  // Tree stack container (inside bucket) - grid for stacking trees
  const treeStack = document.createElement('div');
  treeStack.style.cssText = `
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: 20px;
    gap: 2px;
    justify-items: center;
    align-items: center;
  `;
  treeStack.dataset.treeCount = '0';
  bucket.appendChild(treeStack);
  
  bucketContainer.appendChild(bucket);
  container.appendChild(bucketContainer);
  
  return { bucketContainer, bucket, treeStack };
}

/**
 * Throw a tree from its position to the bucket with spinning animation
 */
export function throwTreeToBucket(container, tree, bucketInfo, onLand) {
  const { x, y, element } = tree;
  const { bucket, treeStack } = bucketInfo;
  
  // Get the grid container to calculate positions from
  const gridContainer = element.parentElement;
  const gridRect = gridContainer.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const bucketRect = bucket.getBoundingClientRect();
  
  // Calculate start position based on x,y coordinates in the grid
  // Grid has 20px padding, cells are 40px each
  const cellSize = 40;
  const gridPadding = 20;
  const startX = (gridRect.left - containerRect.left) + gridPadding + (x * cellSize) + (cellSize / 2);
  const startY = (gridRect.top - containerRect.top) + gridPadding + (y * cellSize) + (cellSize / 2);
  
  // Calculate position in the tree stack grid (at bottom)
  const treeCount = parseInt(treeStack.dataset.treeCount || '0');
  const row = Math.floor(treeCount / 5);
  const col = treeCount % 5;
  
  // First fly to top of bucket (center)
  const topX = bucketRect.left - containerRect.left + bucketRect.width / 2;
  const topY = bucketRect.top - containerRect.top + 10;
  
  // Then drop to position in grid at bottom (stacking upward)
  const cellWidth = (bucketRect.width * 0.9) / 5;
  const treeSize = 20; // Size of each tree in stack
  const finalX = bucketRect.left - containerRect.left + (bucketRect.width * 0.05) + (col * cellWidth) + (cellWidth / 2);
  const finalY = bucketRect.bottom - containerRect.top - 25 - (row * treeSize);
  
  // Hide original tree BEFORE creating flying tree
  element.style.opacity = '0';
  element.style.transform = 'scale(0)';
  
  // Create flying tree element with captured position
  const flyingTree = document.createElement('div');
  flyingTree.textContent = '🎄';
  flyingTree.style.position = 'absolute';
  flyingTree.style.left = `${startX}px`;
  flyingTree.style.top = `${startY}px`;
  flyingTree.style.fontSize = '24px';
  flyingTree.style.zIndex = '200';
  flyingTree.style.pointerEvents = 'none';
  flyingTree.style.filter = 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))';
  container.appendChild(flyingTree);
  
  // Force a reflow to ensure initial position is applied
  flyingTree.offsetHeight;
  
  // Play collect sound when Santa gets the tree
  audioManager.play('collect', 0.8);
  
  // Stage 1: Animate tree flying to top of bucket with arc and spin
  requestAnimationFrame(() => {
    // Use different easing for horizontal (linear) and vertical (ease-out for upward arc)
    flyingTree.style.transition = 'left 0.8s linear, top 0.8s cubic-bezier(0.33, 0, 0.67, 0.33), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyingTree.style.left = `${topX}px`;
    // Trees starting lower (higher Y) need to fly higher to clear the bucket
    // Base arc height + extra height based on starting Y position
    const baseArcHeight = 120;
    const extraHeight = Math.max(0, (startY - 200) * 1.2); // Trees lower in grid fly much higher
    const arcHeight = startY - baseArcHeight - extraHeight;
    flyingTree.style.top = `${arcHeight}px`;
    flyingTree.style.transform = `rotate(${360 + Math.random() * 180}deg) scale(0.9)`;
  });
  
  // Stage 2: After reaching arc peak, drop down with gravity
  setTimeout(() => {
    flyingTree.style.animation = 'none';
    // Gravity-like fall: ease-in for vertical (accelerating down), linear for horizontal
    flyingTree.style.transition = 'left 0.5s linear, top 0.5s cubic-bezier(0.5, 0, 1, 0.5), transform 0.5s ease-in';
    flyingTree.style.left = `${finalX}px`;
    flyingTree.style.top = `${finalY}px`;
    flyingTree.style.transform = `rotate(${720 + Math.random() * 360}deg) scale(0.75)`;
  }, 820);
  
  // After drop animation completes, add tree to bucket stack
  setTimeout(() => {
    // Play ding sound when tree lands
    audioManager.play('land', 0.6);
    
    // Remove flying tree
    if (flyingTree.parentNode) {
      flyingTree.parentNode.removeChild(flyingTree);
    }
    
    // Add tree to stack in bucket using CSS Grid
    const treeCount = parseInt(treeStack.dataset.treeCount || '0');
    
    // Calculate grid position (max 45 trees = 9 rows of 5)
    if (treeCount >= 45) {
      console.warn('Bucket is full!');
      return;
    }
    
    const col = treeCount % 5; // Column 0-4
    const row = Math.floor(treeCount / 5); // Row 0-8 (bottom to top)
    
    const stackedTree = document.createElement('div');
    stackedTree.textContent = '🎄';
    stackedTree.style.cssText = `
      font-size: 18px;
      filter: drop-shadow(0 0 5px rgba(0, 255, 0, 0.6));
      animation: treeLand 0.3s ease-out;
      grid-column: ${col + 1};
      grid-row: ${9 - row};
    `;
    
    treeStack.appendChild(stackedTree);
    
    // Increment tree count
    treeStack.dataset.treeCount = (treeCount + 1).toString();
    
    // Add land animation if not exists
    if (!document.getElementById('tree-land-animation')) {
      const style = document.createElement('style');
      style.id = 'tree-land-animation';
      style.textContent = `
        @keyframes treeLand {
          0% { transform: scale(1.3); opacity: 0.5; }
          50% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    treeStack.appendChild(stackedTree);
    
    // Callback when tree lands (this is when we increment counter)
    if (onLand) {
      onLand();
    }
  }, 1350); // 820ms (arc) + 500ms (drop) + 30ms buffer
}
