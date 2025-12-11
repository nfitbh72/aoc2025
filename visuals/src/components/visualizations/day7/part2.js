import { ChristmasTree } from './christmas-tree.js';
import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 7 Part 2 visualization
 * Count ALL beams that reach the bottom (not just unique positions)!
 */
export default function visualize(container, onComplete) {
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  const grid = COMMON_CONFIG.TEST_GRID;
  
  // Create festive background
  container.style.background = COMMON_CONFIG.BACKGROUND_GRADIENT;
  
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
  for (let i = 0; i < COMMON_CONFIG.STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${COMMON_CONFIG.STAR_SIZE}px;
      height: ${COMMON_CONFIG.STAR_SIZE}px;
      background: ${COMMON_CONFIG.STAR_COLOR};
      border-radius: 50%;
      animation: twinkle ${COMMON_CONFIG.STAR_MIN_ANIMATION_DURATION + Math.random() * COMMON_CONFIG.STAR_MAX_ANIMATION_DURATION}s ease-in-out infinite;
      animation-delay: ${Math.random() * COMMON_CONFIG.STAR_MAX_ANIMATION_DELAY}s;
      box-shadow: 0 0 ${COMMON_CONFIG.STAR_MIN_GLOW + Math.random() * COMMON_CONFIG.STAR_MAX_GLOW}px ${COMMON_CONFIG.STAR_COLOR};
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
  
  const dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  const counter = new CounterBox(container, PART2_CONFIG.COUNTER_LABEL);
  const instructions = new InstructionPanel(container, instructionText);
  
  // Track ALL beams (not just unique positions)
  let totalBeams = 0;
  const expectedAnswer = PART2_CONFIG.EXPECTED_ANSWER;
  let hasCompleted = false;
  
  const tree = new ChristmasTree(
    container, 
    grid, 
    (x, y) => {
      // Part 2: Don't count ornament hits, only beams reaching bottom
      // Just light up the ornament for visual effect
    },
    (x, y) => {
      // Part 2: ONLY count beams reaching the bottom
      totalBeams++;
      counter.increment(1);
      audioManager.play(COMMON_CONFIG.SOUND_NAME_DING, PART2_CONFIG.DING_VOLUME);
      
      // Check if we just reached the expected answer
      if (!hasCompleted && counter.counterValue === expectedAnswer) {
        hasCompleted = true;
        counter.markComplete();
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
        setTimeout(() => {
          audioManager.play(COMMON_CONFIG.SOUND_NAME_YAY, COMMON_CONFIG.YAY_VOLUME);
        }, COMMON_CONFIG.CELEBRATION_SOUND_DELAY_MS);
      }
    }
  );
  
  let fireworks = null;
  
  // Load sounds
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.SOUND_FILE_DING);
  
  // Start animation
  tree.start();
  
  // Start the beam from 'S' position
  setTimeout(async () => {
    await tree.animateBeam(COMMON_CONFIG.BEAM_START_X, COMMON_CONFIG.BEAM_START_Y);
    
    // Wait for animations to complete, then show messages
    setTimeout(() => {
      // Wait before showing messages
      setTimeout(() => {
        
        // Add floating Christmas messages
        const messages = PART2_CONFIG.COMPLETION_MESSAGES.map(msg => 
          msg.replace('{count}', counter.counterValue)
        );
        
        messages.forEach((msg, index) => {
          setTimeout(() => {
            const messageEl = document.createElement('div');
            messageEl.textContent = msg;
            messageEl.style.cssText = `
              position: absolute;
              left: 50%;
              top: ${PART2_CONFIG.MESSAGE_TOP_START + index * PART2_CONFIG.MESSAGE_TOP_SPACING}%;
              transform: translateX(-50%);
              font-size: ${COMMON_CONFIG.MESSAGE_FONT_SIZE};
              font-weight: bold;
              color: ${COMMON_CONFIG.MESSAGE_COLOR};
              text-shadow: ${COMMON_CONFIG.MESSAGE_TEXT_SHADOW};
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
          }, index * COMMON_CONFIG.MESSAGE_STAGGER_DELAY_MS);
        });
      }, COMMON_CONFIG.MESSAGE_SHOW_DELAY_MS);
      
      if (onComplete) {
        setTimeout(onComplete, COMMON_CONFIG.COMPLETION_CALLBACK_DELAY_MS);
      }
    }, COMMON_CONFIG.ANIMATION_COMPLETE_WAIT_MS);
  }, COMMON_CONFIG.BEAM_START_DELAY_MS);
  
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
            el.textContent.includes('Total Beams') ||
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
