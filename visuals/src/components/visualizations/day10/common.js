import { COMMON_CONFIG } from './config.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Parses a machine input line into a machine object
 * Format: [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
 */
export function parseMachine(line) {
  const machine = {
    lightsNeeded: [],
    buttons: [],
    joltageNeeded: []
  };

  // Parse lights pattern
  const lightsMatch = line.match(/\[(.*?)\]/);
  if (lightsMatch) {
    const lightsStr = lightsMatch[1];
    for (let i = 0; i < lightsStr.length; i++) {
      machine.lightsNeeded.push(lightsStr[i] === '#');
    }
  }

  // Parse buttons
  const buttonsMatch = line.match(/\](.*?)\{/);
  if (buttonsMatch) {
    const buttonsStr = buttonsMatch[1];
    const buttonMatches = buttonsStr.matchAll(/\(([^)]+)\)/g);
    for (const match of buttonMatches) {
      const indices = match[1].split(',').map(s => parseInt(s.trim()));
      machine.buttons.push(indices);
    }
  }

  // Parse joltage (if present)
  const joltageMatch = line.match(/\{([^}]+)\}/);
  if (joltageMatch) {
    machine.joltageNeeded = joltageMatch[1].split(',').map(s => parseInt(s.trim()));
  }

  return machine;
}

/**
 * Creates a festive machine display container with flexbox layout
 */
export function createMachineDisplay(container, machineIndex, totalMachines, machinesContainer) {
  // Create or get the machines container
  let flexContainer = machinesContainer;
  if (!flexContainer) {
    flexContainer = document.createElement('div');
    flexContainer.style.cssText = `
      position: absolute;
      top: ${COMMON_CONFIG.MACHINE_TOP_OFFSET}px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: ${COMMON_CONFIG.MACHINE_CONTAINER_SPACING}px;
      justify-content: center;
      align-items: flex-start;
      z-index: 10;
    `;
    container.appendChild(flexContainer);
  }

  const machineDiv = document.createElement('div');
  machineDiv.style.cssText = `
    background: ${COMMON_CONFIG.MACHINE_BACKGROUND};
    border: ${COMMON_CONFIG.MACHINE_BORDER};
    border-radius: ${COMMON_CONFIG.MACHINE_BORDER_RADIUS};
    padding: ${COMMON_CONFIG.MACHINE_PADDING};
    box-shadow: ${COMMON_CONFIG.MACHINE_BOX_SHADOW};
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(-30px);
    transition: all 0.8s ease-out;
    min-width: 240px;
  `;

  flexContainer.appendChild(machineDiv);

  // Animate in
  setTimeout(() => {
    machineDiv.style.opacity = '1';
    machineDiv.style.transform = 'translateY(0)';
  }, machineIndex * 200);

  return { machineDiv, flexContainer };
}

/**
 * Creates the machine title
 */
export function createMachineTitle(machineDiv, machineNumber) {
  const title = document.createElement('div');
  title.textContent = `🎄 Display ${machineNumber + 1} 🎄`;
  title.style.cssText = `
    font-size: ${COMMON_CONFIG.MACHINE_TITLE_FONT_SIZE};
    font-weight: bold;
    color: ${COMMON_CONFIG.MACHINE_TITLE_COLOR};
    text-shadow: ${COMMON_CONFIG.MACHINE_TITLE_TEXT_SHADOW};
    text-align: center;
    margin: ${COMMON_CONFIG.MACHINE_TITLE_MARGIN};
  `;
  machineDiv.appendChild(title);
  return title;
}

/**
 * Creates the lights display for a machine
 */
export function createLightsDisplay(machineDiv, lightsNeeded) {
  const lightsContainer = document.createElement('div');
  lightsContainer.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${COMMON_CONFIG.LIGHT_SPACING}px;
    margin: 15px 0;
    flex-wrap: wrap;
  `;

  const lights = [];
  for (let i = 0; i < lightsNeeded.length; i++) {
    const light = document.createElement('div');
    light.textContent = '💡';
    light.style.cssText = `
      font-size: ${COMMON_CONFIG.LIGHT_SIZE}px;
      filter: grayscale(1) brightness(${COMMON_CONFIG.LIGHT_OFF_OPACITY});
      transition: all ${COMMON_CONFIG.LIGHT_PULSE_DURATION * COMMON_CONFIG.SPEED_MULTIPLIER}s ease;
      cursor: default;
    `;
    light.dataset.index = i;
    light.dataset.isOn = 'false';
    light.dataset.targetState = lightsNeeded[i] ? 'true' : 'false';

    lightsContainer.appendChild(light);
    lights.push(light);
  }

  machineDiv.appendChild(lightsContainer);
  return lights;
}

/**
 * Creates the buttons display for a machine
 */
export function createButtonsDisplay(machineDiv, buttons) {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${COMMON_CONFIG.BUTTON_MARGIN}px;
    margin: 15px 0;
    flex-wrap: wrap;
  `;

  const buttonElements = [];
  for (let i = 0; i < buttons.length; i++) {
    const button = document.createElement('div');
    button.textContent = '🔘';
    button.style.cssText = `
      width: ${COMMON_CONFIG.BUTTON_WIDTH}px;
      height: ${COMMON_CONFIG.BUTTON_HEIGHT}px;
      border-radius: ${COMMON_CONFIG.BUTTON_BORDER_RADIUS};
      background: ${COMMON_CONFIG.BUTTON_COLORS[i % COMMON_CONFIG.BUTTON_COLORS.length]};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      cursor: pointer;
      box-shadow: ${COMMON_CONFIG.BUTTON_BOX_SHADOW};
      transition: ${COMMON_CONFIG.BUTTON_TRANSITION};
      user-select: none;
      border: 3px solid rgba(255, 255, 255, 0.3);
    `;
    button.dataset.index = i;

    buttonsContainer.appendChild(button);
    buttonElements.push(button);
  }

  machineDiv.appendChild(buttonsContainer);
  return buttonElements;
}

/**
 * Creates a press counter display
 */
export function createPressCounter(machineDiv) {
  const counter = document.createElement('div');
  counter.textContent = '✨ Presses: 0 ✨';
  counter.style.cssText = `
    font-size: ${COMMON_CONFIG.PRESSES_FONT_SIZE};
    font-weight: bold;
    color: ${COMMON_CONFIG.PRESSES_COLOR};
    text-shadow: ${COMMON_CONFIG.PRESSES_TEXT_SHADOW};
    text-align: center;
    margin: ${COMMON_CONFIG.PRESSES_MARGIN};
  `;
  counter.dataset.presses = '0';
  machineDiv.appendChild(counter);
  return counter;
}

/**
 * Toggles lights based on button press
 */
export function toggleLights(lights, buttonIndices) {
  const toggledLights = [];

  for (const idx of buttonIndices) {
    if (idx < lights.length) {
      const light = lights[idx];
      const isOn = light.dataset.isOn === 'true';
      light.dataset.isOn = isOn ? 'false' : 'true';
      toggledLights.push(light);
    }
  }

  return toggledLights;
}

/**
 * Updates the visual state of a light
 */
export function updateLightVisual(light, playSound = true) {
  const isOn = light.dataset.isOn === 'true';
  const colorIndex = parseInt(light.dataset.index) % COMMON_CONFIG.LIGHT_ON_COLORS.length;
  const color = COMMON_CONFIG.LIGHT_ON_COLORS[colorIndex];

  if (isOn) {
    light.style.filter = 'grayscale(0) brightness(1.2)';
    light.style.textShadow = `0 0 ${COMMON_CONFIG.LIGHT_GLOW_SIZE}px ${color}`;
    light.style.transform = 'scale(1.2)';

    if (playSound) {
      audioManager.play(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.DING_VOLUME);
    }
  } else {
    light.style.filter = `grayscale(1) brightness(${COMMON_CONFIG.LIGHT_OFF_OPACITY})`;
    light.style.textShadow = 'none';
    light.style.transform = 'scale(1)';
  }

  // Reset after animation
  setTimeout(() => {
    if (isOn) {
      light.style.transform = 'scale(1.1)';
    }
  }, COMMON_CONFIG.LIGHT_FLASH_DURATION * COMMON_CONFIG.SPEED_MULTIPLIER);
}

/**
 * Checks if all lights match their target state
 */
export function checkLightsMatch(lights) {
  return lights.every(light => light.dataset.isOn === light.dataset.targetState);
}

/**
 * Animates a button press
 */
export function animateButtonPress(button) {
  button.style.transform = `scale(${COMMON_CONFIG.BUTTON_ACTIVE_SCALE})`;
  button.style.background = COMMON_CONFIG.BUTTON_PRESSED_COLOR;
  button.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';

  audioManager.play(COMMON_CONFIG.SOUND_NAME_CLICK, COMMON_CONFIG.CLICK_VOLUME);

  setTimeout(() => {
    const index = parseInt(button.dataset.index);
    button.style.transform = 'scale(1)';
    button.style.background = COMMON_CONFIG.BUTTON_COLORS[index % COMMON_CONFIG.BUTTON_COLORS.length];
    button.style.boxShadow = COMMON_CONFIG.BUTTON_BOX_SHADOW;
  }, COMMON_CONFIG.LIGHT_FLASH_DURATION * COMMON_CONFIG.SPEED_MULTIPLIER);
}

/**
 * Updates the press counter
 */
export function updatePressCounter(counter) {
  const presses = parseInt(counter.dataset.presses) + 1;
  counter.dataset.presses = presses.toString();
  counter.textContent = `✨ Presses: ${presses} ✨`;

  // Pulse animation
  counter.style.transition = `transform ${0.2 * COMMON_CONFIG.SPEED_MULTIPLIER}s ease`;
  counter.style.transform = 'scale(1.3)';
  setTimeout(() => {
    counter.style.transform = 'scale(1)';
  }, 200 * COMMON_CONFIG.SPEED_MULTIPLIER);
}

/**
 * Creates falling snowflakes
 */
export function createSnowfall(container) {
  const snowflakes = [];

  for (let i = 0; i < COMMON_CONFIG.SNOWFLAKE_COUNT; i++) {
    const snowflake = document.createElement('div');
    const emoji = COMMON_CONFIG.SNOWFLAKE_EMOJIS[Math.floor(Math.random() * COMMON_CONFIG.SNOWFLAKE_EMOJIS.length)];
    const size = COMMON_CONFIG.SNOWFLAKE_MIN_SIZE + Math.random() * (COMMON_CONFIG.SNOWFLAKE_MAX_SIZE - COMMON_CONFIG.SNOWFLAKE_MIN_SIZE);
    const duration = COMMON_CONFIG.SNOWFLAKE_MIN_DURATION + Math.random() * (COMMON_CONFIG.SNOWFLAKE_MAX_DURATION - COMMON_CONFIG.SNOWFLAKE_MIN_DURATION);
    const delay = Math.random() * COMMON_CONFIG.SNOWFLAKE_MAX_DELAY;

    snowflake.textContent = emoji;
    snowflake.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: -50px;
      font-size: ${size}px;
      animation: snowfall ${duration}s linear ${delay}s infinite;
      opacity: ${0.6 + Math.random() * 0.4};
      pointer-events: none;
      z-index: 1;
    `;

    container.appendChild(snowflake);
    snowflakes.push(snowflake);
  }

  // Add snowfall animation if not already present
  if (!document.getElementById('snowfall-animation')) {
    const style = document.createElement('style');
    style.id = 'snowfall-animation';
    style.textContent = `
      @keyframes snowfall {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(${container.clientHeight + 100}px) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return snowflakes;
}

/**
 * Creates twinkling stars background
 */
export function createStars(container) {
  const stars = [];

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
      pointer-events: none;
      z-index: 1;
    `;
    container.appendChild(star);
    stars.push(star);
  }

  // Add twinkle animation if not already present
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

  return stars;
}

/**
 * Marks a machine as complete with celebration effects
 */
export function markMachineComplete(machineDiv) {
  machineDiv.style.border = '3px solid rgba(0, 255, 0, 0.8)';
  machineDiv.style.boxShadow = '0 0 50px rgba(0, 255, 0, 0.6)';

  // Play success sound
  audioManager.play(COMMON_CONFIG.SOUND_NAME_ENERGY, COMMON_CONFIG.ENERGY_VOLUME);

  // Add sparkles around the machine
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.textContent = '✨';
      sparkle.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: ${20 + Math.random() * 20}px;
        animation: sparkleFloat 1s ease-out forwards;
        pointer-events: none;
        z-index: 100;
      `;
      machineDiv.appendChild(sparkle);

      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }, i * 100);
  }

  // Add sparkle animation if not already present
  if (!document.getElementById('sparkle-float-animation')) {
    const style = document.createElement('style');
    style.id = 'sparkle-float-animation';
    style.textContent = `
      @keyframes sparkleFloat {
        0% { opacity: 1; transform: translateY(0) scale(0); }
        50% { opacity: 1; transform: translateY(-20px) scale(1.5); }
        100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
      }
    `;
    document.head.appendChild(style);
  }
}
