import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Sound types for different celebration moments
export type SoundType = 
  | 'celebration' 
  | 'fanfare' 
  | 'success' 
  | 'positive' 
  | 'gentle' 
  | 'level_up'
  | 'achievement'
  | 'coin'
  | 'whoosh'
  | 'pop'
  | 'chime'
  | 'applause'
  | 'wrong'
  | 'correct'
  | 'button_tap'
  | 'notification';

// Haptic patterns
export type HapticPattern = 
  | 'light'
  | 'medium' 
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'impact_light'
  | 'impact_medium'
  | 'impact_heavy';

// Sound configuration
interface SoundConfig {
  file: string;
  volume: number;
  shouldLoop: boolean;
  fadeDuration?: number;
}

// Haptic configuration  
interface HapticConfig {
  type: 'impact' | 'notification' | 'selection';
  intensity?: 'light' | 'medium' | 'heavy';
  pattern?: number[]; // Custom vibration pattern for Android
}

// Enhanced sound service class
export class EnhancedSoundService {
  private static instance: EnhancedSoundService;
  private soundCache: Map<SoundType, Audio.Sound> = new Map();
  private isEnabled: boolean = true;
  private hapticEnabled: boolean = true;
  private volume: number = 0.7;
  private isInitialized: boolean = false;

  // Sound configurations mapping
  private soundConfigs: Record<SoundType, SoundConfig> = {
    // Celebration sounds
    celebration: { file: 'celebration.mp3', volume: 0.8, shouldLoop: false, fadeDuration: 500 },
    fanfare: { file: 'celebration.mp3', volume: 0.9, shouldLoop: false, fadeDuration: 300 },
    applause: { file: 'celebration.mp3', volume: 0.7, shouldLoop: false, fadeDuration: 400 },
    
    // Achievement sounds
    success: { file: 'correct.mp3', volume: 0.6, shouldLoop: false },
    achievement: { file: 'levelUp.mp3', volume: 0.8, shouldLoop: false },
    level_up: { file: 'levelUp.mp3', volume: 0.8, shouldLoop: false, fadeDuration: 300 },
    
    // Feedback sounds
    positive: { file: 'correct.mp3', volume: 0.5, shouldLoop: false },
    gentle: { file: 'correct.mp3', volume: 0.4, shouldLoop: false },
    correct: { file: 'correct.mp3', volume: 0.6, shouldLoop: false },
    wrong: { file: 'wrong.mp3', volume: 0.5, shouldLoop: false },
    
    // UI sounds
    button_tap: { file: 'buttonTap.mp3', volume: 0.3, shouldLoop: false },
    coin: { file: 'buttonTap.mp3', volume: 0.5, shouldLoop: false },
    whoosh: { file: 'buttonTap.mp3', volume: 0.4, shouldLoop: false },
    pop: { file: 'buttonTap.mp3', volume: 0.4, shouldLoop: false },
    chime: { file: 'correct.mp3', volume: 0.5, shouldLoop: false },
    notification: { file: 'buttonTap.mp3', volume: 0.6, shouldLoop: false },
  };

  // Haptic configurations
  private hapticConfigs: Record<HapticPattern, HapticConfig> = {
    light: { type: 'impact', intensity: 'light' },
    medium: { type: 'impact', intensity: 'medium' },
    heavy: { type: 'impact', intensity: 'heavy' },
    success: { type: 'notification', pattern: [50, 50, 100] },
    warning: { type: 'notification', pattern: [100, 100, 100] },
    error: { type: 'notification', pattern: [200, 100, 200] },
    selection: { type: 'selection' },
    impact_light: { type: 'impact', intensity: 'light' },
    impact_medium: { type: 'impact', intensity: 'medium' },
    impact_heavy: { type: 'impact', intensity: 'heavy' },
  };

  private constructor() {
    this.initializeAudioSession();
  }

  public static getInstance(): EnhancedSoundService {
    if (!EnhancedSoundService.instance) {
      EnhancedSoundService.instance = new EnhancedSoundService();
    }
    return EnhancedSoundService.instance;
  }

  /**
   * Initialize audio session with proper configuration
   */
  private async initializeAudioSession(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
      this.isInitialized = true;
      console.log('✅ Enhanced sound service initialized successfully');
    } catch (error) {
      console.warn('⚠️ Failed to initialize audio session, trying fallback configuration:', error);
      // Fallback configuration with minimal settings
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });
        this.isInitialized = true;
        console.log('✅ Enhanced sound service initialized with fallback configuration');
      } catch (fallbackError) {
        console.error('❌ Failed to initialize audio session with fallback:', fallbackError);
        this.isInitialized = false;
      }
    }
  }

  /**
   * Preload frequently used sounds
   */
  public async preloadSounds(soundTypes: SoundType[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeAudioSession();
    }

    if (!this.isInitialized) {
      console.warn('⚠️ Audio session not initialized, skipping preload');
      return;
    }

    console.log(`🎵 Preloading ${soundTypes.length} sounds...`);
    
    const loadPromises = soundTypes.map(soundType => this.loadSound(soundType));
    await Promise.all(loadPromises);
    
    const successfullyLoaded = soundTypes.filter(type => this.soundCache.has(type));
    console.log(`✅ Preloaded ${successfullyLoaded.length}/${soundTypes.length} sounds successfully`);
  }

  /**
   * Play a sound with enhanced options
   */
  public async playSound(
    soundType: SoundType, 
    options?: {
      volume?: number;
      fadeIn?: boolean;
      delay?: number;
      onComplete?: () => void;
    }
  ): Promise<void> {
    if (!this.isEnabled || !this.isInitialized) {
      console.log(`🔇 Sound disabled or not initialized, skipping: ${soundType}`);
      return;
    }

    try {
      // Add delay if specified - use non-blocking timeout
      if (options?.delay && options.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }

      let sound = this.soundCache.get(soundType);
      
      // Load sound if not cached
      if (!sound) {
        await this.loadSound(soundType);
        sound = this.soundCache.get(soundType);
        if (!sound) {
          console.error(`❌ Failed to load sound: ${soundType}`);
          return;
        }
      }

      // Reset sound position for replayability
      try {
        await sound.setPositionAsync(0);
      } catch (resetError) {
        console.warn(`⚠️ Could not reset sound position for ${soundType}:`, resetError);
      }

      // Set volume
      const config = this.soundConfigs[soundType];
      const volume = (options?.volume ?? config.volume) * this.volume;
      
      try {
        await sound.setVolumeAsync(options?.fadeIn ? 0 : volume);
      } catch (volumeError) {
        console.warn(`⚠️ Could not set volume for ${soundType}:`, volumeError);
      }

      // Play sound with better error handling
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.playAsync();
          console.log(`🎵 Playing sound: ${soundType} at volume ${Math.round(volume * 100)}%`);
        } else {
          console.warn(`⚠️ Sound not loaded properly: ${soundType}`);
          return;
        }
      } catch (playError) {
        console.error(`❌ Failed to play sound ${soundType}:`, playError);
        // Try to reload sound on play failure
        this.soundCache.delete(soundType);
        return;
      }

      // Fade in if requested
      if (options?.fadeIn && config.fadeDuration) {
        this.fadeInSound(sound, volume, config.fadeDuration);
      }

      // Call completion callback
      if (options?.onComplete) {
        const estimatedDuration = this.getEstimatedDuration(soundType);
        setTimeout(options.onComplete, estimatedDuration);
      }

    } catch (error) {
      console.error(`❌ Failed to play sound ${soundType}:`, error);
    }
  }

  /**
   * Load a single sound into cache
   */
  private async loadSound(soundType: SoundType): Promise<void> {
    const config = this.soundConfigs[soundType];
    if (!config) {
      console.warn(`⚠️ No configuration found for sound type: ${soundType}`);
      return;
    }

    try {
      // Load actual sound file using proper asset paths
      let soundAsset;
      
      switch (config.file) {
        case 'celebration.mp3':
          soundAsset = require('../../../assets/sounds/celebration.mp3');
          break;
        case 'correct.mp3':
          soundAsset = require('../../../assets/sounds/correct.mp3');
          break;
        case 'wrong.mp3':
          soundAsset = require('../../../assets/sounds/wrong.mp3');
          break;
        case 'levelUp.mp3':
          soundAsset = require('../../../assets/sounds/levelUp.mp3');
          break;
        case 'buttonTap.mp3':
          soundAsset = require('../../../assets/sounds/buttonTap.mp3');
          break;
        default:
          soundAsset = require('../../../assets/sounds/buttonTap.mp3');
      }
      
      const { sound } = await Audio.Sound.createAsync(
        soundAsset,
        { 
          shouldPlay: false, 
          isLooping: config.shouldLoop,
          volume: config.volume * this.volume
        }
      );

      this.soundCache.set(soundType, sound);
      console.log(`✅ Loaded sound: ${soundType}`);
    } catch (error) {
      console.error(`❌ Failed to load sound ${soundType}:`, error);
    }
  }

  /**
   * Play multiple sounds in sequence
   */
  public async playSoundSequence(
    sequence: Array<{
      soundType: SoundType;
      delay?: number;
      volume?: number;
    }>,
    options?: {
      onComplete?: () => void;
      onSoundComplete?: (soundType: SoundType) => void;
    }
  ): Promise<void> {
    for (const item of sequence) {
      await this.playSound(item.soundType, {
        volume: item.volume,
        delay: item.delay,
        onComplete: () => options?.onSoundComplete?.(item.soundType),
      });
    }
    
    options?.onComplete?.();
  }

  /**
   * Execute haptic feedback with enhanced patterns
   */
  public async executeHaptic(
    pattern: HapticPattern,
    options?: {
      intensity?: number;
      duration?: number;
      delay?: number;
    }
  ): Promise<void> {
    if (!this.hapticEnabled) {
      console.log(`📳 Haptic disabled, skipping: ${pattern}`);
      return;
    }

    try {
      // Add delay if specified
      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }

      const config = this.hapticConfigs[pattern];
      
      switch (config.type) {
        case 'impact':
          const impactStyle = config.intensity === 'light' 
            ? Haptics.ImpactFeedbackStyle.Light
            : config.intensity === 'heavy' 
            ? Haptics.ImpactFeedbackStyle.Heavy
            : Haptics.ImpactFeedbackStyle.Medium;
          
          await Haptics.impactAsync(impactStyle);
          console.log(`📳 Haptic impact: ${config.intensity}`);
          break;

        case 'notification':
          if (pattern === 'success') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else if (pattern === 'warning') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } else if (pattern === 'error') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          console.log(`📳 Haptic notification: ${pattern}`);
          break;

        case 'selection':
          await Haptics.selectionAsync();
          console.log(`📳 Haptic selection`);
          break;
      }

    } catch (error) {
      console.error(`❌ Failed to execute haptic ${pattern}:`, error);
    }
  }

  /**
   * Execute complex feedback combining sound and haptics
   */
  public async executeCelebrationFeedback(
    level: 'epic' | 'great' | 'good' | 'supportive',
    options?: {
      customSounds?: SoundType[];
      customHaptics?: HapticPattern[];
      onComplete?: () => void;
    }
  ): Promise<void> {
    const feedbackConfigs = {
      epic: {
        sounds: ['celebration'] as SoundType[], // Simplified for less delay
        haptics: ['heavy', 'success'] as HapticPattern[],
        soundDelays: [0],
        hapticDelays: [0, 100], // Reduced delays
      },
      great: {
        sounds: ['success'] as SoundType[], // Single sound for responsiveness
        haptics: ['medium', 'success'] as HapticPattern[],
        soundDelays: [0],
        hapticDelays: [0, 150],
      },
      good: {
        sounds: ['positive'] as SoundType[],
        haptics: ['medium'] as HapticPattern[],
        soundDelays: [0],
        hapticDelays: [0],
      },
      supportive: {
        sounds: ['gentle'] as SoundType[],
        haptics: ['light'] as HapticPattern[],
        soundDelays: [0],
        hapticDelays: [0],
      },
    };

    const config = feedbackConfigs[level];
    const sounds = options?.customSounds || config.sounds;
    const haptics = options?.customHaptics || config.haptics;

    console.log(`🎉 Executing ${level} celebration feedback...`);

    try {
      // Execute immediate feedback first (haptics are faster)
      const immediateHaptics = haptics.filter((_, index) => config.hapticDelays[index] === 0);
      const immediateHapticPromises = immediateHaptics.map(haptic => 
        this.executeHaptic(haptic)
      );
      
      // Execute immediate sounds
      const immediateSounds = sounds.filter((_, index) => config.soundDelays[index] === 0);
      const immediateSoundPromises = immediateSounds.map(sound => 
        this.playSound(sound, { volume: 0.7 }) // Slightly lower volume for faster response
      );

      // Execute immediate feedback in parallel
      await Promise.all([...immediateHapticPromises, ...immediateSoundPromises]);

      // Execute delayed feedback
      const delayedPromises = [];
      
      haptics.forEach((haptic, index) => {
        const delay = config.hapticDelays[index];
        if (delay > 0) {
          delayedPromises.push(this.executeHaptic(haptic, { delay }));
        }
      });

      sounds.forEach((sound, index) => {
        const delay = config.soundDelays[index];
        if (delay > 0) {
          delayedPromises.push(this.playSound(sound, { delay, volume: 0.6 }));
        }
      });

      // Don't await delayed promises to prevent blocking
      if (delayedPromises.length > 0) {
        Promise.all(delayedPromises).catch(error => 
          console.warn('⚠️ Some delayed feedback failed:', error)
        );
      }

      // Call completion callback immediately for responsiveness
      if (options?.onComplete) {
        // Use shorter timeout for better UX
        setTimeout(options.onComplete, 200); 
      }

      console.log(`✅ ${level} celebration feedback initiated`);
    } catch (error) {
      console.error(`❌ Failed to execute ${level} celebration feedback:`, error);
      // Still call completion callback on error
      if (options?.onComplete) {
        setTimeout(options.onComplete, 100);
      }
    }
  }

  /**
   * Helper methods
   */
  private async fadeInSound(sound: Audio.Sound, targetVolume: number, duration: number): Promise<void> {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;

    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        sound.setVolumeAsync(volumeStep * i);
      }, stepDuration * i);
    }
  }

  private getEstimatedDuration(soundType: SoundType): number {
    // Estimated durations in milliseconds
    const durations: Record<SoundType, number> = {
      celebration: 3000,
      fanfare: 2500,
      applause: 2000,
      success: 800,
      achievement: 1500,
      level_up: 2000,
      positive: 600,
      gentle: 500,
      correct: 400,
      wrong: 500,
      button_tap: 100,
      coin: 300,
      whoosh: 400,
      pop: 200,
      chime: 800,
      notification: 600,
    };
    
    return durations[soundType] || 500;
  }

  /**
   * Configuration methods
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`🔊 Sound ${enabled ? 'enabled' : 'disabled'}`);
  }

  public setHapticEnabled(enabled: boolean): void {
    this.hapticEnabled = enabled;
    console.log(`📳 Haptic ${enabled ? 'enabled' : 'disabled'}`);
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log(`🔊 Volume set to: ${Math.round(this.volume * 100)}%`);
  }

  public getVolume(): number {
    return this.volume;
  }

  public isAudioEnabled(): boolean {
    return this.isEnabled && this.isInitialized;
  }

  public isHapticSupported(): boolean {
    return Platform.OS !== 'web' && this.hapticEnabled;
  }

  /**
   * Manually retry initialization if it failed
   */
  public async retryInitialization(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }
    
    console.log('🔄 Retrying sound service initialization...');
    await this.initializeAudioSession();
    return this.isInitialized;
  }

  /**
   * Cleanup resources
   */
  public async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up sound service...');
    
    const unloadPromises = Array.from(this.soundCache.values()).map(sound => 
      sound.unloadAsync().catch(error => 
        console.warn('Failed to unload sound:', error)
      )
    );

    await Promise.all(unloadPromises);
    this.soundCache.clear();
    
    console.log('✅ Sound service cleanup completed');
  }
}

// Export singleton instance
export const soundService = EnhancedSoundService.getInstance();

// Export utility functions
export const playSound = (soundType: SoundType, options?: Parameters<typeof soundService.playSound>[1]) => 
  soundService.playSound(soundType, options);

export const executeHaptic = (pattern: HapticPattern, options?: Parameters<typeof soundService.executeHaptic>[1]) => 
  soundService.executeHaptic(pattern, options);

export const executeCelebrationFeedback = (
  level: Parameters<typeof soundService.executeCelebrationFeedback>[0], 
  options?: Parameters<typeof soundService.executeCelebrationFeedback>[1]
) => soundService.executeCelebrationFeedback(level, options);

/**
 * Initialize sound service early for better performance
 */
export const initializeSoundService = async (): Promise<void> => {
  try {
    console.log('🎵 Initializing enhanced sound service...');
    
    // Ensure audio session is initialized first
    const instance = soundService;
    
    // Wait for audio session to be ready with better checking
    let attempts = 0;
    const maxAttempts = 10; // Reasonable attempts
    while (attempts < maxAttempts) {
      if (instance.isAudioEnabled()) {
        console.log(`✅ Audio session ready after ${attempts + 1} attempts`);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for initialization
      attempts++;
    }
    
    // If initialization failed, try manual retry
    if (!instance.isAudioEnabled()) {
      console.log('🔄 Attempting manual initialization retry...');
      const retrySuccess = await instance.retryInitialization();
      if (!retrySuccess) {
        console.warn('⚠️ Audio session initialization failed, sounds may not work properly');
      } else {
        console.log('✅ Manual initialization retry succeeded');
      }
    }
    
    // Preload essential sounds for immediate use
    const essentialSounds: SoundType[] = [
      'correct',
      'wrong', 
      'success',
      'button_tap',
    ];
    
    // Preload celebration sounds in background
    const celebrationSounds: SoundType[] = [
      'celebration',
      'achievement',
      'level_up',
      'coin',
      'pop',
      'chime',
    ];
    
    // Load essential sounds first (blocking)
    await instance.preloadSounds(essentialSounds);
    console.log('✅ Essential sounds loaded');
    
    // Load celebration sounds in background (non-blocking)
    instance.preloadSounds(celebrationSounds).then(() => {
      console.log('✅ Celebration sounds loaded');
    }).catch(error => {
      console.warn('⚠️ Some celebration sounds failed to load:', error);
    });
    
    console.log('🎵 Sound service initialization completed');
  } catch (error) {
    console.error('❌ Sound service initialization failed:', error);
  }
};