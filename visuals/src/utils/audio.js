/**
 * Audio utility for loading and playing sounds
 */

class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.enabled = true;
    this.effectsVolume = 1.0;
    this.activeSounds = []; // Track all playing sound clones
  }
  
  /**
   * Set the effects volume multiplier
   * @param {number} volume - Volume multiplier (0.0 to 1.0)
   */
  setEffectsVolume(volume) {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Load a sound file
   * @param {string} name - Identifier for the sound
   * @param {string} path - Path to the sound file (relative to src/assets/sounds/)
   */
  async loadSound(name, path) {
    try {
      const audio = new Audio(`/assets/sounds/${path}`);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
      return audio;
    } catch (error) {
      console.error(`Failed to load sound: ${name}`, error);
      return null;
    }
  }

  /**
   * Play a sound
   * @param {string} name - Identifier for the sound
   * @param {number} volume - Volume (0.0 to 1.0)
   */
  play(name, volume = 1.0) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(name);
    if (sound) {
      // Clone the audio to allow overlapping plays
      const clone = sound.cloneNode();
      
      // Apply effects volume multiplier
      clone.volume = Math.max(0, Math.min(1, volume * this.effectsVolume));
      
      // Track this sound
      this.activeSounds.push(clone);
      
      // Remove from active list when it ends
      clone.addEventListener('ended', () => {
        const index = this.activeSounds.indexOf(clone);
        if (index > -1) {
          this.activeSounds.splice(index, 1);
        }
      });
      
      clone.play().catch(err => console.warn(`Failed to play sound: ${name}`, err));
    } else {
      console.warn(`Sound not found: ${name}`);
    }
  }

  /**
   * Stop a sound
   * @param {string} name - Identifier for the sound
   */
  stop(name) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll() {
    // Stop all active sound clones
    this.activeSounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.activeSounds = [];
    
    // Also stop all base sounds
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Toggle audio on/off
   */
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /**
   * Set audio enabled state
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
