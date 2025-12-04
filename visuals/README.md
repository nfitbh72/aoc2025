# AOC Visuals

Advent of Code visualization app built with Electron and Vite.

## Project Structure

```
visuals/
├── src/
│   ├── assets/
│   │   ├── sounds/             # Audio files
│   │   └── images/             # Image files
│   ├── components/
│   │   ├── gift-buttons.js      # Gift box button UI
│   │   ├── visualization.js     # Main visualization loader
│   │   └── visualizations/      # Day-specific visualizations
│   ├── styles/
│   │   ├── main.css            # Global styles
│   │   └── gift-buttons.css    # Button-specific styles
│   ├── utils/
│   │   ├── colors.js           # Color utilities
│   │   └── audio.js            # Audio manager
│   ├── index.html              # Main HTML entry
│   └── main.js                 # App entry point
├── main.js                     # Electron main process
├── vite.config.js              # Vite configuration
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build
```

## Adding New Visualizations

Create a new file in `src/components/visualizations/` for each day/part:

```javascript
// src/components/visualizations/day1-1.js
export default function visualize(container) {
  // Your visualization code here
  
  // Return cleanup function if needed
  return {
    cleanup: () => {
      // Clean up resources
    }
  };
}
```

Then import it dynamically in `src/components/visualization.js`.

## Adding Sounds

Place audio files in `src/assets/sounds/` and use the audio manager:

```javascript
import { audioManager } from '../../utils/audio.js';

// Load sounds
await audioManager.loadSound('click', 'click.mp3');
await audioManager.loadSound('success', 'success.wav');

// Play sounds
audioManager.play('click', 0.5); // volume 0.0-1.0
audioManager.play('success');
```
