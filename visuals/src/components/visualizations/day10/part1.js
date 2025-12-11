import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG, PART1_CONFIG } from './config.js';
import {
  parseMachine,
  createMachineDisplay,
  createMachineTitle,
  createLightsDisplay,
  createButtonsDisplay,
  createPressCounter,
  toggleLights,
  updateLightVisual,
  checkLightsMatch,
  animateButtonPress,
  updatePressCounter,
  createSnowfall,
  createStars,
  markMachineComplete
} from './common.js';

/**
 * Day 10 Part 1 - Christmas Light Display Puzzle
 * Press festive buttons to light up the Christmas display with minimum presses!
 */
export default function visualize(container, onComplete) {
  const instructionText = PART1_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = PART1_CONFIG.COUNTER_LABEL;
  const testInput = COMMON_CONFIG.TEST_INPUT;

  // Set festive background
  container.style.background = COMMON_CONFIG.BACKGROUND_GRADIENT;

  // Create UI components
  const dayTitle = new DayTitle(container, PART1_CONFIG.DAY_NUMBER, PART1_CONFIG.PART_NUMBER);
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
  const machines = testInput.map(line => parseMachine(line));
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

    const lights = createLightsDisplay(machineDiv, machine.lightsNeeded);
    const buttons = createButtonsDisplay(machineDiv, machine.buttons);
    const pressCounter = createPressCounter(machineDiv);

    machineElements.push({
      div: machineDiv,
      machine,
      lights,
      buttons,
      pressCounter,
      solved: false
    });
  });

  /**
   * Solves a single machine by finding minimum button presses
   */
  async function solveMachine(machineElement) {
    const { machine, lights, buttons, pressCounter } = machineElement;

    // Find solution (brute force approach like the Go code)
    const solution = findSolution(machine);

    if (!solution) {
      return 0;
    }

    // Animate the button presses
    for (const buttonIndex of solution) {
      await new Promise(resolve => {
        const button = buttons[buttonIndex];
        const buttonIndices = machine.buttons[buttonIndex];

        // Press button
        animateButtonPress(button);

        // Toggle lights
        const toggledLights = toggleLights(lights, buttonIndices);

        // Update visuals
        timers.push(setTimeout(() => {
          toggledLights.forEach(light => updateLightVisual(light));
          updatePressCounter(pressCounter);
          counter.increment(1);
          resolve();
        }, COMMON_CONFIG.LIGHT_FLASH_DURATION * COMMON_CONFIG.SPEED_MULTIPLIER));
      });

      // Wait between button presses
      await new Promise(resolve => timers.push(setTimeout(resolve, COMMON_CONFIG.BUTTON_PRESS_DELAY * COMMON_CONFIG.SPEED_MULTIPLIER)));
    }

    // Check if solved
    if (checkLightsMatch(lights)) {
      machineElement.solved = true;
      markMachineComplete(machineElement.div);
    }

    return solution.length;
  }

  /**
   * Finds minimum button presses (Part 1 logic from Go code)
   */
  function findSolution(machine) {
    const numButtons = machine.buttons.length;
    const maxPresses = 10;

    // Try 0 presses, 1 press, 2 presses, etc.
    for (let totalPresses = 0; totalPresses <= maxPresses; totalPresses++) {
      if (totalPresses === 0) {
        if (checkSolution(machine, [])) {
          return [];
        }
        continue;
      }

      // Try all combinations with totalPresses buttons
      const result = tryAllCombinations(machine, totalPresses, numButtons);
      if (result) {
        return result;
      }
    }

    return null;
  }

  /**
   * Tries all button press combinations for a given number of presses
   */
  function tryAllCombinations(machine, totalPresses, numButtons) {
    const digits = new Array(totalPresses).fill(0);

    while (true) {
      if (checkSolution(machine, digits)) {
        return [...digits];
      }

      if (incrementBase(digits, numButtons)) {
        break;
      }
    }

    return null;
  }

  /**
   * Increments a base-N number (mimics the Go IncrementBase function)
   */
  function incrementBase(digits, base) {
    for (let i = digits.length - 1; i >= 0; i--) {
      digits[i]++;
      if (digits[i] < base) {
        return false; // No overflow
      }
      digits[i] = 0; // Wrap to 0 and carry
    }
    return true; // Overflow
  }

  /**
   * Checks if a button press sequence produces the correct lights
   */
  function checkSolution(machine, buttonPresses) {
    const lights = new Array(machine.lightsNeeded.length).fill(false);

    // Apply button presses
    for (const buttonIdx of buttonPresses) {
      for (const lightIdx of machine.buttons[buttonIdx]) {
        lights[lightIdx] = !lights[lightIdx];
      }
    }

    // Check if matches target
    for (let i = 0; i < lights.length; i++) {
      if (lights[i] !== machine.lightsNeeded[i]) {
        return false;
      }
    }

    return true;
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
      const expectedAnswer = PART1_CONFIG.EXPECTED_ANSWER;
      const isCorrect = counter.counterValue === expectedAnswer;
      const allSolved = machineElements.every(m => m.solved);

      if (isCorrect && allSolved) {
        counter.markComplete();
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);

        setTimeout(() => {
          audioManager.play(COMMON_CONFIG.SOUND_NAME_YAY, COMMON_CONFIG.YAY_VOLUME);
        }, COMMON_CONFIG.CELEBRATION_SOUND_DELAY_MS * COMMON_CONFIG.SPEED_MULTIPLIER);

        // Show celebration overlay
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg,
            rgba(255, 0, 0, 0.9) 0%,
            rgba(0, 128, 0, 0.9) 50%,
            rgba(255, 215, 0, 0.9) 100%);
          border: 5px solid #ffd700;
          border-radius: 30px;
          padding: 40px 60px;
          box-shadow:
            0 0 40px rgba(255, 215, 0, 0.8),
            0 0 80px rgba(255, 0, 0, 0.6),
            inset 0 0 60px rgba(255, 255, 255, 0.2);
          z-index: 2999;
          opacity: 0;
          animation: overlayFadeIn 0.8s ease-out forwards;
          pointer-events: none;
        `;
        container.appendChild(overlay);

        // Add candy cane stripes to border
        const stripeOverlay = document.createElement('div');
        stripeOverlay.style.cssText = `
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 30px;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.3) 10px,
            rgba(255, 255, 255, 0.3) 20px
          );
          pointer-events: none;
          animation: candyCaneRotate 3s linear infinite;
        `;
        overlay.appendChild(stripeOverlay);

        // Show celebration messages
        PART1_CONFIG.CELEBRATION_MESSAGES.forEach((msg, index) => {
          setTimeout(() => {
            const messageEl = document.createElement('div');
            messageEl.textContent = msg;
            messageEl.style.cssText = `
              font-size: ${PART1_CONFIG.MESSAGE_FONT_SIZE};
              font-weight: bold;
              color: #ffffff;
              text-shadow:
                0 0 10px rgba(0, 0, 0, 0.8),
                0 0 20px rgba(255, 215, 0, 0.6),
                2px 2px 4px rgba(0, 0, 0, 0.5);
              animation: messageFloat 1s ease-out forwards;
              opacity: 0;
              margin: 10px 0;
              text-align: center;
              pointer-events: none;
            `;
            messageEl.style.animationDelay = `${index * 0.2}s`;
            overlay.appendChild(messageEl);
          }, PART1_CONFIG.MESSAGE_SHOW_DELAY_MS * COMMON_CONFIG.SPEED_MULTIPLIER);
        });

        // Add animations
        if (!document.getElementById('celebration-animations')) {
          const style = document.createElement('style');
          style.id = 'celebration-animations';
          style.textContent = `
            @keyframes overlayFadeIn {
              0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
              100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes messageFloat {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes candyCaneRotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
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
      const overlay = container.querySelector('.celebration-overlay');
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  };
}
