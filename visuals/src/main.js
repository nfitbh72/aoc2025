import './styles/main.css';
import './styles/header.css';
import { initializeButtons } from './components/gift-buttons.js';
import { initializeVisualization } from './components/visualization.js';
import { loadCelebrationAssets } from './utils/celebration.js';
import { initializeVolumeControls } from './components/volume-controls.js';
import { audioManager } from './utils/audio.js';
import { initializeHeaderEmojis } from './components/header-emojis.js';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Load celebration assets
  loadCelebrationAssets();
  
  // Initialize volume controls and start music
  initializeVolumeControls(audioManager);
  
  // Initialize jiggling header emojis
  initializeHeaderEmojis();
  
  initializeButtons();
  initializeVisualization();
});
