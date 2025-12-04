/**
 * Volume controls for music and sound effects
 */

import { audioManager } from '../utils/audio.js';

let musicVolume = 0.5;
let effectsVolume = 1.0;
let musicAudio = null;

// Store reference to audio manager for updating effects volume
let audioManagerRef = null;

export function initializeVolumeControls(audioManager) {
  // Store reference to audio manager
  audioManagerRef = audioManager;
  
  const container = document.createElement('div');
  container.id = 'volume-controls';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    gap: 30px;
    z-index: 2000;
  `;
  
  // Create music control
  const musicControl = createVolumeControl('Music', musicVolume, (volume) => {
    musicVolume = volume;
    if (musicAudio) {
      musicAudio.volume = volume;
    }
  });
  
  // Create effects control
  const effectsControl = createVolumeControl('Effects', effectsVolume, (volume) => {
    effectsVolume = volume;
    if (audioManagerRef) {
      audioManagerRef.setEffectsVolume(volume);
    }
  });
  
  container.appendChild(musicControl);
  container.appendChild(effectsControl);
  document.body.appendChild(container);
  
  // Set initial effects volume
  if (audioManagerRef) {
    audioManagerRef.setEffectsVolume(effectsVolume);
  }
  
  // Start playing background music
  startBackgroundMusic();
}

function createVolumeControl(label, initialVolume, onChange) {
  const control = document.createElement('div');
  control.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  `;
  
  // Create bars container with mute button
  const barsContainer = document.createElement('div');
  barsContainer.style.cssText = `
    display: flex;
    gap: 4px;
    align-items: flex-end;
    height: 50px;
    cursor: pointer;
  `;
  
  // Create mute button (represents 0 volume)
  const muteButton = document.createElement('div');
  muteButton.style.cssText = `
    width: 8px;
    height: 10px;
    background: ${initialVolume === 0 ? '#2ecc71' : '#555'};
    border-radius: 2px;
    transition: background 0.2s;
  `;
  muteButton.dataset.level = '0';
  barsContainer.appendChild(muteButton);
  
  // Create 10 bars
  const bars = [muteButton];
  for (let i = 0; i < 10; i++) {
    const bar = document.createElement('div');
    const height = 10 + (i * 4); // Increasing height
    bar.style.cssText = `
      width: 8px;
      height: ${height}px;
      background: ${i < initialVolume * 10 ? '#2ecc71' : '#555'};
      border-radius: 2px;
      transition: background 0.2s;
    `;
    bar.dataset.level = i + 1;
    bars.push(bar);
    barsContainer.appendChild(bar);
  }
  
  // Add click handler
  barsContainer.addEventListener('click', (e) => {
    const bar = e.target.closest('div[data-level]');
    if (bar) {
      const level = parseInt(bar.dataset.level);
      const volume = level / 10;
      
      // Update bar colors (level 0 means only mute button is active)
      bars.forEach((b, index) => {
        const barLevel = parseInt(b.dataset.level);
        b.style.background = barLevel <= level ? '#2ecc71' : '#555';
      });
      
      onChange(volume);
    }
  });
  
  // Create label
  const labelElement = document.createElement('div');
  labelElement.textContent = label;
  labelElement.style.cssText = `
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Comic Sans MS', Arial, sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  `;
  
  control.appendChild(barsContainer);
  control.appendChild(labelElement);
  
  return control;
}

async function startBackgroundMusic() {
  try {
    musicAudio = new Audio('/assets/sounds/music.mp3');
    musicAudio.loop = true;
    musicAudio.volume = musicVolume;
    
    // Try to play, but handle autoplay restrictions
    try {
      await musicAudio.play();
    } catch (err) {
      console.log('Autoplay prevented, music will start on first user interaction');
      
      // Start music on first user interaction
      const startMusic = () => {
        musicAudio.play().catch(() => {});
        document.removeEventListener('click', startMusic);
        document.removeEventListener('keydown', startMusic);
      };
      
      document.addEventListener('click', startMusic);
      document.addEventListener('keydown', startMusic);
    }
  } catch (error) {
    console.error('Failed to load background music:', error);
  }
}

