import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';
import {
  createMachineDisplay,
  createMachineTitle,
  createButtonsDisplay,
  createPressCounter,
  animateButtonPress,
  updatePressCounter,
  createSnowfall,
  createStars,
  markMachineComplete
} from './common.js';
import {
  parseMachinePart2,
  createJoltageDisplay,
  incrementJoltage,
  checkJoltageMatch,
  checkJoltageOver,
  solveMachinePart2
} from './joltage-components.js';

/**
 * Day 10 Part 2 - Christmas Joltage Matching Puzzle
 * Press buttons to add joltage and match exact target values!
 */
export default function visualize(container, onComplete) {
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = PART2_CONFIG.COUNTER_LABEL;
  const testInput = COMMON_CONFIG.TEST_INPUT;

  // Set festive background
  container.style.background = COMMON_CONFIG.BACKGROUND_GRADIENT;

  // Create UI components
  const dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  const counter = new CounterBox(container, counterLabel);
  const instructions = new InstructionPanel(container, instructionText);

  // Create atmospheric effects
  const snowflakes = createSnowfall(container);
  const stars = createStars(container);

  // Load sounds
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.SOUND_FILE_DING);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_CLICK, COMMON_CONFIG.SOUND_FILE_CLICK);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_ENERGY, COMMON_CONFIG.SOUND_FILE_ENERGY);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_YAY, COMMON_CONFIG.SOUND_FILE_YAY);

  // Parse machines
  const machines = testInput.map(line => parseMachinePart2(line));
  const machineElements = [];
  let fireworks = null;
  let flexContainer = null;
  const timers = [];

  // Create machine displays
  machines.forEach((machine, index) => {
    const result = createMachineDisplay(container, index, machines.length, flexContainer);
    const machineDiv = result.machineDiv;
    flexContainer = result.flexContainer;

    createMachineTitle(machineDiv, index);

    const joltageMeters = createJoltageDisplay(machineDiv, machine.joltageNeeded);
    const buttons = createButtonsDisplay(machineDiv, machine.buttons);
    const pressCounter = createPressCounter(machineDiv);

    machineElements.push({
      div: machineDiv,
      machine,
      joltageMeters,
      buttons,
      pressCounter,
      solved: false
    });
  });

  /**
   * Solves a single machine by finding minimum button presses for joltage
   */
  async function solveMachine(machineElement) {
    const { machine, joltageMeters, buttons, pressCounter } = machineElement;

    // Find solution
    const solution = solveMachinePart2(machine);

    if (!solution) {
      return 0;
    }

    // Convert button press counts to animation sequence
    const pressSequence = [];
    for (let buttonIdx = 0; buttonIdx < solution.length; buttonIdx++) {
      for (let press = 0; press < solution[buttonIdx]; press++) {
        pressSequence.push(buttonIdx);
      }
    }

    // Limit animation length for very long solutions
    const maxPresses = PART2_CONFIG.MAX_BUTTON_PRESSES_TO_SHOW;
    const shouldAnimate = pressSequence.length <= maxPresses;

    if (shouldAnimate) {
      // Animate each button press
      for (const buttonIndex of pressSequence) {
        await new Promise(resolve => {
          const button = buttons[buttonIndex];
          const buttonIndices = machine.buttons[buttonIndex];

          // Press button
          animateButtonPress(button);

          // Increment joltage
          timers.push(setTimeout(() => {
            incrementJoltage(joltageMeters, buttonIndices);
            updatePressCounter(pressCounter);
            counter.increment(1);

            // Play sound
            audioManager.play(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.DING_VOLUME);

            resolve();
          }, COMMON_CONFIG.LIGHT_FLASH_DURATION * COMMON_CONFIG.SPEED_MULTIPLIER));
        });

        // Wait between button presses
        await new Promise(resolve => timers.push(setTimeout(resolve, COMMON_CONFIG.BUTTON_PRESS_DELAY * COMMON_CONFIG.SPEED_MULTIPLIER)));

        // Check if we went over (for visual feedback)
        if (checkJoltageOver(joltageMeters)) {
          // This shouldn't happen with a correct solution, but show it if it does
          await new Promise(resolve => timers.push(setTimeout(resolve, 500 * COMMON_CONFIG.SPEED_MULTIPLIER)));
        }
      }
    } else {
      // Skip animation for very long solutions, just update final state
      const totalPresses = pressSequence.length;

      // Update press counter
      for (let i = 0; i < totalPresses; i++) {
        updatePressCounter(pressCounter);
        counter.increment(1);
      }

      // Update joltage meters to final values
      const finalJoltage = new Array(machine.joltageNeeded.length).fill(0);
      for (const buttonIdx of pressSequence) {
        for (const joltageIdx of machine.buttons[buttonIdx]) {
          if (joltageIdx < finalJoltage.length) {
            finalJoltage[joltageIdx]++;
          }
        }
      }

      // Update meters
      joltageMeters.forEach((meter, idx) => {
        meter.currentValue = finalJoltage[idx];
        meter.valueDisplay.textContent = finalJoltage[idx].toString();
        const percentage = (finalJoltage[idx] / meter.targetValue) * 100;
        meter.fill.style.height = `${Math.min(percentage, 100)}%`;

        if (finalJoltage[idx] === meter.targetValue) {
          meter.fill.style.background = PART2_CONFIG.JOLTAGE_FILL_MATCH;
          meter.bar.style.boxShadow = PART2_CONFIG.JOLTAGE_MATCH_GLOW;
        }
      });
    }

    // Check if solved
    if (checkJoltageMatch(joltageMeters)) {
      machineElement.solved = true;
      markMachineComplete(machineElement.div);
    }

    return solution.reduce((a, b) => a + b, 0);
  }

  /**
   * Main animation sequence
   */
  async function animate() {
    // Wait for machines to appear
    await new Promise(resolve => timers.push(setTimeout(resolve, COMMON_CONFIG.START_DELAY_MS * COMMON_CONFIG.SPEED_MULTIPLIER)));

    // Solve each machine sequentially
    for (let i = 0; i < machineElements.length; i++) {
      await solveMachine(machineElements[i]);

      // Pause between machines
      if (i < machineElements.length - 1) {
        await new Promise(resolve => timers.push(setTimeout(resolve, COMMON_CONFIG.SOLVE_DELAY_BETWEEN_MACHINES * COMMON_CONFIG.SPEED_MULTIPLIER)));
      }
    }

    // Check if all solved and answer is correct
    timers.push(setTimeout(() => {
      const expectedAnswer = PART2_CONFIG.EXPECTED_ANSWER;
      const isCorrect = counter.counterValue === expectedAnswer;
      const allSolved = machineElements.every(m => m.solved);

      if (isCorrect && allSolved) {
        counter.markComplete();
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);

        setTimeout(() => {
          audioManager.play(COMMON_CONFIG.SOUND_NAME_YAY, COMMON_CONFIG.YAY_VOLUME);
        }, COMMON_CONFIG.CELEBRATION_SOUND_DELAY_MS * COMMON_CONFIG.SPEED_MULTIPLIER);

        // Show celebration overlay with electric/joltage theme
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay-part2';
        overlay.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg,
            rgba(78, 205, 196, 0.95) 0%,
            rgba(69, 183, 209, 0.95) 25%,
            rgba(255, 170, 0, 0.95) 50%,
            rgba(255, 215, 0, 0.95) 75%,
            rgba(0, 255, 0, 0.95) 100%);
          border: 5px solid #00ff00;
          border-radius: 30px;
          padding: 40px 60px;
          box-shadow:
            0 0 40px rgba(0, 255, 0, 0.8),
            0 0 80px rgba(255, 170, 0, 0.6),
            inset 0 0 60px rgba(255, 255, 255, 0.2);
          z-index: 2999;
          opacity: 0;
          animation: overlayFadeIn 0.8s ease-out forwards, electricPulse 2s ease-in-out infinite;
          pointer-events: none;
        `;
        container.appendChild(overlay);

        // Add electric bolt decorations
        const boltLeft = document.createElement('div');
        boltLeft.textContent = '⚡';
        boltLeft.style.cssText = `
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 40px;
          animation: boltFlicker 1.5s ease-in-out infinite;
        `;
        overlay.appendChild(boltLeft);

        const boltRight = document.createElement('div');
        boltRight.textContent = '⚡';
        boltRight.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 40px;
          animation: boltFlicker 1.5s ease-in-out infinite 0.75s;
        `;
        overlay.appendChild(boltRight);

        // Add energy wave effect to border
        const waveOverlay = document.createElement('div');
        waveOverlay.style.cssText = `
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 30px;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 15px,
            rgba(0, 255, 0, 0.4) 15px,
            rgba(0, 255, 0, 0.4) 30px
          );
          pointer-events: none;
          animation: energyWave 2s linear infinite;
        `;
        overlay.appendChild(waveOverlay);

        // Show celebration messages
        PART2_CONFIG.CELEBRATION_MESSAGES.forEach((msg, index) => {
          setTimeout(() => {
            const messageEl = document.createElement('div');
            messageEl.textContent = msg;
            messageEl.style.cssText = `
              font-size: ${PART2_CONFIG.MESSAGE_FONT_SIZE};
              font-weight: bold;
              color: #ffffff;
              text-shadow:
                0 0 10px rgba(0, 0, 0, 0.8),
                0 0 20px rgba(0, 255, 0, 0.8),
                2px 2px 4px rgba(0, 0, 0, 0.5);
              animation: messageFloat 1s ease-out forwards;
              opacity: 0;
              margin: 10px 0;
              text-align: center;
              pointer-events: none;
            `;
            messageEl.style.animationDelay = `${index * 0.2}s`;
            overlay.appendChild(messageEl);
          }, PART2_CONFIG.MESSAGE_SHOW_DELAY_MS * COMMON_CONFIG.SPEED_MULTIPLIER);
        });

        // Add animations
        if (!document.getElementById('celebration-animations-part2')) {
          const style = document.createElement('style');
          style.id = 'celebration-animations-part2';
          style.textContent = `
            @keyframes overlayFadeIn {
              0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
              100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes messageFloat {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes electricPulse {
              0%, 100% { box-shadow:
                0 0 40px rgba(0, 255, 0, 0.8),
                0 0 80px rgba(255, 170, 0, 0.6),
                inset 0 0 60px rgba(255, 255, 255, 0.2);
              }
              50% { box-shadow:
                0 0 60px rgba(0, 255, 0, 1),
                0 0 120px rgba(255, 170, 0, 0.8),
                inset 0 0 80px rgba(255, 255, 255, 0.3);
              }
            }
            @keyframes energyWave {
              0% { background-position: 0 0; }
              100% { background-position: 30px 0; }
            }
            @keyframes boltFlicker {
              0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
              25% { opacity: 0.7; transform: scale(1.1) rotate(5deg); }
              50% { opacity: 1; transform: scale(0.9) rotate(-5deg); }
              75% { opacity: 0.8; transform: scale(1.05) rotate(3deg); }
            }
          `;
          document.head.appendChild(style);
        }
      }

      if (onComplete) {
        setTimeout(onComplete, COMMON_CONFIG.COMPLETION_CALLBACK_DELAY_MS * COMMON_CONFIG.SPEED_MULTIPLIER);
      }
    }, COMMON_CONFIG.COMPLETION_CHECK_DELAY_MS * COMMON_CONFIG.SPEED_MULTIPLIER));
  }

  // Start animation
  animate();

  return {
    cleanup: () => {
      // Clear all timers
      timers.forEach(timer => clearTimeout(timer));

      // Remove snowflakes
      snowflakes.forEach(snowflake => {
        if (snowflake.parentNode) {
          snowflake.parentNode.removeChild(snowflake);
        }
      });

      // Remove stars
      stars.forEach(star => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      });

      // Remove flex container (which contains all machine displays)
      if (flexContainer && flexContainer.parentNode) {
        flexContainer.parentNode.removeChild(flexContainer);
      }

      // Cleanup components
      if (dayTitle) dayTitle.cleanup();
      if (counter) counter.cleanup();
      if (instructions) instructions.cleanup();
      if (fireworks) fireworks.cleanup();

      // Clean up celebration overlay
      const overlay = container.querySelector('.celebration-overlay-part2');
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  };
}
