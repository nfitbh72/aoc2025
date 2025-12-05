/**
 * Festive intro screen for the Advent of Code visualization
 */
export function createIntroScreen(container) {
  const introContainer = document.createElement('div');
  introContainer.className = 'intro-screen';
  introContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 50%, #1a0033, #000000);
    z-index: 1000;
    overflow: hidden;
  `;

  // Animated snowflakes background
  createSnowflakes(introContainer);

  // Main content container
  const content = document.createElement('div');
  content.style.cssText = `
    text-align: center;
    max-width: 90%;
    width: 100%;
    padding: 30px 20px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 20px;
    border: 3px solid #FFD700;
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 50, 50, 0.3);
    animation: pulse-glow 2s ease-in-out infinite;
    position: relative;
    z-index: 10;
    box-sizing: border-box;
  `;

  // Title with festive styling
  const title = document.createElement('h1');
  title.style.cssText = `
    font-size: clamp(32px, 5vw, 56px);
    margin: 0 0 15px 0;
    background: linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4, #95E1D3, #FFD700);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 3s ease infinite;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    font-weight: bold;
    letter-spacing: 1px;
    word-wrap: break-word;
  `;
  title.textContent = '🎄 Advent of Code 2025 🎁';

  // Subtitle
  const subtitle = document.createElement('h2');
  subtitle.style.cssText = `
    font-size: clamp(18px, 3vw, 24px);
    color: #95E1D3;
    margin: 0 0 20px 0;
    text-shadow: 0 0 10px rgba(149, 225, 211, 0.5);
    animation: float 3s ease-in-out infinite;
    word-wrap: break-word;
  `;
  subtitle.textContent = '✨ Interactive Visualization Dashboard ✨';

  // Description
  const description = document.createElement('p');
  description.style.cssText = `
    font-size: clamp(14px, 2vw, 16px);
    color: #ffffff;
    line-height: 1.6;
    margin: 0 0 20px 0;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    word-wrap: break-word;
  `;
  description.innerHTML = `
    Welcome to the <strong style="color: #FFD700;">Advent of Code 2025</strong> visualization experience!<br/>
    This interactive dashboard brings each puzzle solution to life with
    <span style="color: #95E1D3;">✨ holiday magic</span>!
  `;

  // Instructions box
  const instructions = document.createElement('div');
  instructions.style.cssText = `
    background: rgba(255, 215, 0, 0.1);
    border: 2px dashed #FFD700;
    border-radius: 15px;
    padding: 20px 15px;
    margin: 15px auto;
    animation: wiggle 1s ease-in-out infinite;
    box-sizing: border-box;
    max-width: 600px;
  `;

  const instructionTitle = document.createElement('div');
  instructionTitle.style.cssText = `
    font-size: clamp(18px, 2.5vw, 22px);
    color: #FFD700;
    font-weight: bold;
    margin-bottom: 12px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    word-wrap: break-word;
  `;
  instructionTitle.textContent = '🎁 How to Unwrap the Magic 🎁';

  const instructionText = document.createElement('div');
  instructionText.style.cssText = `
    font-size: clamp(14px, 2vw, 16px);
    color: #ffffff;
    line-height: 1.5;
    word-wrap: break-word;
  `;
  instructionText.innerHTML = `
    Click on any <strong style="color: #FF6B6B;">gift box</strong> below to open it and watch<br/>
    the puzzle solution come alive with festive animations!<br/>
    <span style="font-size: 14px; color: #95E1D3; margin-top: 10px; display: block;">
      (Each box contains a different day's puzzle visualization)
    </span>
  `;

  instructions.appendChild(instructionTitle);
  instructions.appendChild(instructionText);

  // Festive emoji decorations
  const decorations = document.createElement('div');
  decorations.style.cssText = `
    font-size: clamp(32px, 5vw, 42px);
    margin-top: 15px;
    animation: bounce 2s ease-in-out infinite;
    word-wrap: break-word;
  `;
  decorations.textContent = '🎅 🎄 ⛄ 🎁 ❄️ 🔔 ⭐ 🦌';

  // Add pulsing arrow pointing down
  const arrow = document.createElement('div');
  arrow.style.cssText = `
    font-size: clamp(40px, 6vw, 56px);
    margin-top: 20px;
    animation: bounce-arrow 1.5s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
  `;
  arrow.textContent = '👇';

  // Assemble content
  content.appendChild(title);
  content.appendChild(subtitle);
  content.appendChild(description);
  content.appendChild(instructions);
  content.appendChild(decorations);
  content.appendChild(arrow);

  introContainer.appendChild(content);

  // Add CSS animations
  addIntroAnimations();

  container.appendChild(introContainer);

  return {
    element: introContainer,
    cleanup: () => {
      if (introContainer.parentNode) {
        introContainer.parentNode.removeChild(introContainer);
      }
    }
  };
}

function createSnowflakes(container) {
  const snowflakeCount = 50;
  
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.textContent = ['❄️', '❅', '❆'][Math.floor(Math.random() * 3)];
    snowflake.style.cssText = `
      position: absolute;
      top: -50px;
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 20 + 10}px;
      opacity: ${Math.random() * 0.5 + 0.3};
      animation: snowfall ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
      pointer-events: none;
      z-index: 1;
    `;
    container.appendChild(snowflake);
  }
}

function addIntroAnimations() {
  // Check if styles already exist
  if (document.getElementById('intro-screen-animations')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'intro-screen-animations';
  style.textContent = `
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes pulse-glow {
      0%, 100% { 
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 50, 50, 0.3);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 60px rgba(255, 215, 0, 0.8), 0 0 120px rgba(255, 50, 50, 0.5);
        transform: scale(1.02);
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-2deg); }
      75% { transform: rotate(2deg); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    @keyframes bounce-arrow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(20px); }
    }

    @keyframes snowfall {
      0% {
        transform: translateY(-50px) rotate(0deg);
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}
