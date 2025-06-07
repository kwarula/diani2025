import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Mic, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface VoiceInputOverlayProps {
  onCancel: () => void;
}

export function VoiceInputOverlay({ onCancel }: VoiceInputOverlayProps) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseAnim, fadeAnim]);

  const styles = createStyles(colors);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Animated.View style={[styles.micContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.micBackground}>
            <Mic size={40} color="#FFFFFF" />
          </View>
        </Animated.View>
        
        <Text style={styles.title}>Listening...</Text>
        <Text style={styles.subtitle}>Speak now to ask about Diani Beach</Text>
        
        <View style={styles.soundWaves}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <SoundWave key={index} delay={index * 100} colors={colors} />
          ))}
        </View>
        
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function SoundWave({ delay, colors }: { delay: number; colors: any }) {
  const waveAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const wave = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    const timer = setTimeout(() => {
      wave.start();
    }, delay);

    return () => {
      clearTimeout(timer);
      wave.stop();
    };
  }, [waveAnim, delay]);

  return (
    <Animated.View style={[
      {
        width: 4,
        height: 20,
        backgroundColor: colors.success,
        marginHorizontal: 2,
        borderRadius: 2,
      },
      { opacity: waveAnim }
    ]} />
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  closeButton: {
    position: 'absolute',
    top: -100,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micContainer: {
    marginBottom: 30,
  },
  micBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  soundWaves: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
  },
});