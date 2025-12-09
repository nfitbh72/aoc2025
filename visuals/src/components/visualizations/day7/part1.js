import { ChristmasTree } from './christmas-tree.js';
import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 7 Part 1 visualization
 * Beams of light travel down the Christmas tree, splitting when they hit ornaments!
 */
export default function visualize(container, onComplete) {
  const instructionText = 'Count unique ornament positions hit by light beams! 🎄✨';
  
  // Test input - Christmas tree shaped!
  const grid = [
    '.......S.......'.split(''),
    '...............'.split(''),
    '.......^.......'.split(''),
    '...............'.split(''),
    '......^.^......'.split(''),
    '...............'.split(''),
    '.....^.^.^.....'.split(''),
    '...............'.split(''),
    '....^.^...^....'.split(''),
    '...............'.split(''),
    '...^.^...^.^...'.split(''),
    '...............'.split(''),
    '..^...^.....^..'.split(''),
    '...............'.split(''),
    '.^.^.^.^.^...^.'.split(''),
    '...............'.split('')
  ];
  
  // Create festive background
  container.style.background = 'radial-gradient(circle at 50% 50%, #0a0a1e 0%, #000000 100%)';
  
  // Add twinkling stars background
  const starsContainer = document.createElement('div');
  starsContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  `;
  container.appendChild(starsContainer);
  
  // Create twinkling stars
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: 2px;
      height: 2px;
      background: white;
      border-radius: 50%;
      animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      box-shadow: 0 0 ${2 + Math.random() * 3}px white;
    `;
    starsContainer.appendChild(star);
  }
  
  // Add twinkle animation
  if (!document.getElementById('twinkle-animation')) {
    const style = document.createElement('style');
    style.id = 'twinkle-animation';
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }
    `;
    document.head.appendChild(style);
  }
  
  const dayTitle = new DayTitle(container, 7, 1);
  const counter = new CounterBox(container, 'Ornaments Lit 🎄');
  const instructions = new InstructionPanel(container, instructionText);
  
  // Track unique positions
  const hitPositions = new Set();
  
  const tree = new ChristmasTree(
    container, 
    grid, 
    (x, y) => {
      // Part 1: Only count unique ornament positions
      const key = `${x},${y}`;
      if (!hitPositions.has(key)) {
        hitPositions.add(key);
        counter.increment(1);
        audioManager.play('ding', 0.4);
      }
    },
    null // Part 1 doesn't count beams reaching the bottom
  );
  
  let fireworks = null;
  
  // Load sounds
  audioManager.loadSound('ding', 'ding.mp3');
  
  // Start animation
  tree.start();
  
  // Start the beam from 'S' position (7, 0)
  setTimeout(async () => {
    await tree.animateBeam(7, 0);
    
    // Wait a moment then celebrate
    setTimeout(() => {
      counter.markComplete();
      
      // Create extra festive celebration
      fireworks = celebrate(container, 8000);
      
      // Wait 2 seconds before showing messages
      setTimeout(() => {
        // Add floating Christmas messages
        const messages = [
          '🎄 Merry Christmas! 🎄',
          `✨ ${counter.counterValue} Ornaments Lit! ✨`,
          '⭐ Tree Complete! ⭐',
          '🎁 Happy Holidays! 🎁'
        ];
        
        messages.forEach((msg, index) => {
          setTimeout(() => {
            const messageEl = document.createElement('div');
            messageEl.textContent = msg;
            messageEl.style.cssText = `
              position: absolute;
              left: 50%;
              top: ${30 + index * 15}%;
              transform: translateX(-50%);
              font-size: 36px;
              font-weight: bold;
              color: #ffd700;
              text-shadow: 
                0 0 20px rgba(255, 215, 0, 1),
                0 0 40px rgba(255, 215, 0, 0.6),
                3px 3px 6px rgba(0, 0, 0, 0.8);
              animation: floatIn 1s ease-out forwards;
              opacity: 0;
              z-index: 2000;
              pointer-events: none;
            `;
            container.appendChild(messageEl);
            
            // Add float animation
            if (!document.getElementById('float-in-animation')) {
              const style = document.createElement('style');
              style.id = 'float-in-animation';
              style.textContent = `
                @keyframes floatIn {
                  0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.8); }
                  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                }
              `;
              document.head.appendChild(style);
            }
          }, index * 500);
        });
        
        // Play celebration sound
        setTimeout(() => {
          audioManager.play('yay', 0.8);
        }, 500);
      }, 2000);
      
      if (onComplete) {
        setTimeout(onComplete, 4000);
      }
    }, 1000);
  }, 1000);
  
  return {
    cleanup: () => {
      dayTitle.cleanup();
      counter.cleanup();
      instructions.cleanup();
      tree.cleanup();
      if (starsContainer.parentNode) {
        starsContainer.parentNode.removeChild(starsContainer);
      }
      if (fireworks) {
        fireworks.cleanup();
      }
      // Clean up any message elements
      container.querySelectorAll('div').forEach(el => {
        if (el.textContent.includes('Merry Christmas') || 
            el.textContent.includes('All Ornaments') ||
            el.textContent.includes('Tree Complete') ||
            el.textContent.includes('Happy Holidays')) {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }
      });
    }
  };
}
