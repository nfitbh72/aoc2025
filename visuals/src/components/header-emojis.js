let audioContext = null;
let analyser = null;
let dataArray = null;
let animationFrameId = null;
let isConnected = false;

/**
 * Initialize jiggling emojis in the header
 */
export function initializeHeaderEmojis() {
  const header = document.getElementById('header');
  if (!header) return;

  // Top row emojis
  const topEmojis = ['❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄', '✨', '⭐', '❄'];
  
  // Bottom row emojis
  const bottomEmojis = ['🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔', '🎄', '🎁', '🔔'];

  // Create top row container
  const topRow = document.createElement('div');
  topRow.style.cssText = `
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    opacity: 0.6;
    height: 20px;
    pointer-events: none;
  `;

  // Create bottom row container
  const bottomRow = document.createElement('div');
  bottomRow.style.cssText = `
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    opacity: 0.7;
    height: 20px;
    pointer-events: none;
  `;

  const topSpans = [];
  const bottomSpans = [];
  
  // Add top emojis
  topEmojis.forEach((emoji) => {
    const span = document.createElement('span');
    span.className = 'header-emoji';
    span.textContent = emoji;
    span.style.display = 'inline-block';
    span.style.margin = '0 3px';
    topRow.appendChild(span);
    topSpans.push(span);
  });

  // Add bottom emojis
  bottomEmojis.forEach((emoji) => {
    const span = document.createElement('span');
    span.className = 'header-emoji';
    span.textContent = emoji;
    span.style.display = 'inline-block';
    span.style.margin = '0 3px';
    bottomRow.appendChild(span);
    bottomSpans.push(span);
  });

  header.appendChild(topRow);
  header.appendChild(bottomRow);

  // Split title into individual characters
  const title = document.getElementById('title');
  if (title) {
    const titleText = title.textContent;
    title.textContent = '';
    title.style.display = 'flex';
    title.style.justifyContent = 'center';
    title.style.gap = '2px';
    
    const titleSpans = [];
    for (let i = 0; i < titleText.length; i++) {
      const span = document.createElement('span');
      span.textContent = titleText[i];
      span.style.display = 'inline-block';
      if (titleText[i] === ' ') {
        span.style.width = '0.5em';
      }
      title.appendChild(span);
      titleSpans.push(span);
    }
    
    // Store references for audio reactivity
    window.headerEmojiSpans = { top: topSpans, bottom: bottomSpans, title: titleSpans };
  } else {
    // Store references for audio reactivity
    window.headerEmojiSpans = { top: topSpans, bottom: bottomSpans };
  }
}

/**
 * Connect audio element to frequency analyzer
 */
export function connectMusicAnalyzer(audioElement) {
  if (!audioElement) return;
  
  // Only connect once - createMediaElementSource can only be called once per element
  if (isConnected) {
    // Just restart the analysis if it was stopped
    if (!animationFrameId) {
      startFrequencyAnalysis();
    }
    return;
  }

  try {
    // Create audio context and analyser
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // Connect audio element to analyser
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    isConnected = true;

    // Start analyzing
    startFrequencyAnalysis();
  } catch (error) {
    console.warn('Could not initialize audio analyzer:', error);
  }
}

/**
 * Analyze frequencies and update emoji positions
 */
function startFrequencyAnalysis() {
  // Import setHeaderAnimationFrameId dynamically to avoid circular dependency
  let setHeaderAnimationFrameId = null;
  import('./visualization.js').then(module => {
    setHeaderAnimationFrameId = module.setHeaderAnimationFrameId;
  }).catch(() => {
    // Ignore if module doesn't exist yet
  });

  const analyze = () => {
    if (!analyser || !dataArray || !window.headerEmojiSpans) {
      return;
    }

    analyser.getByteFrequencyData(dataArray);

    const { top, bottom, title } = window.headerEmojiSpans;
    const totalEmojis = top.length;

    // Use only the lower 40% of the frequency spectrum
    const maxFreqIndex = Math.floor(dataArray.length * 0.4);
    const freqPerEmoji = Math.floor(maxFreqIndex / totalEmojis);

    // Update top row (left = low freq, right = high freq)
    top.forEach((span, index) => {
      const startFreq = index * freqPerEmoji;
      const endFreq = startFreq + freqPerEmoji;
      
      // Average frequency magnitude for this emoji's range
      let sum = 0;
      for (let i = startFreq; i < endFreq && i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / freqPerEmoji;
      
      // Progressive multiplier: 1.0 on left to 1.5 on right
      const positionRatio = index / (totalEmojis - 1); // 0 to 1
      const multiplier = 1.0 + (positionRatio * 0.5); // 1.0 to 1.5
      
      // Only animate if above 50% threshold (127.5)
      let movement = 0;
      if (avg > 127.5) {
        // Map the upper 50% (127.5-255) to full movement range (0-12px)
        const normalizedAvg = (avg - 127.5) / 127.5; // 0 to 1
        movement = -(normalizedAvg) * 12 * multiplier;
      }
      span.style.transform = `translateY(${movement}px)`;
    });

    // Update bottom row (left = low freq, right = high freq)
    bottom.forEach((span, index) => {
      const startFreq = index * freqPerEmoji;
      const endFreq = startFreq + freqPerEmoji;
      
      let sum = 0;
      for (let i = startFreq; i < endFreq && i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / freqPerEmoji;
      
      // Progressive multiplier: 1.0 on left to 1.5 on right
      const positionRatio = index / (totalEmojis - 1); // 0 to 1
      const multiplier = 1.0 + (positionRatio * 0.5); // 1.0 to 1.5
      
      // Only animate if above 50% threshold (127.5)
      let movement = 0;
      if (avg > 127.5) {
        // Map the upper 50% (127.5-255) to full movement range (0-12px)
        const normalizedAvg = (avg - 127.5) / 127.5; // 0 to 1
        movement = -(normalizedAvg) * 12 * multiplier;
      }
      span.style.transform = `translateY(${movement}px)`;
    });

    // Update title characters (left = low freq, right = high freq)
    if (title) {
      const totalChars = title.length;
      const freqPerChar = Math.floor(maxFreqIndex / totalChars);
      
      title.forEach((span, index) => {
        const startFreq = index * freqPerChar;
        const endFreq = startFreq + freqPerChar;
        
        let sum = 0;
        for (let i = startFreq; i < endFreq && i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / freqPerChar;
        
        // Progressive multiplier: 1.0 on left to 1.5 on right
        const positionRatio = index / (totalChars - 1); // 0 to 1
        const multiplier = 1.0 + (positionRatio * 0.5); // 1.0 to 1.5
        
        // Only animate if above 50% threshold (127.5)
        let movement = 0;
        if (avg > 127.5) {
          // Map the upper 50% (127.5-255) to full movement range (0-15px)
          const normalizedAvg = (avg - 127.5) / 127.5; // 0 to 1
          movement = -(normalizedAvg) * 15 * multiplier;
        }
        span.style.transform = `translateY(${movement}px)`;
      });
    }

    animationFrameId = requestAnimationFrame(analyze);
    
    // Register this animation frame as the header animation to preserve it
    if (setHeaderAnimationFrameId) {
      setHeaderAnimationFrameId(animationFrameId);
    }
  };

  analyze();
}

/**
 * Stop frequency analysis
 */
export function stopFrequencyAnalysis() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}
