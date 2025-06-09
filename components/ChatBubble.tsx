import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    // Stagger the animations for a smooth entrance
    opacity.value = withTiming(1, { duration: 400 });
    translateY.value = withSpring(0, { 
      damping: 15, 
      stiffness: 150,
      mass: 1
    });
    scale.value = withSpring(1, { 
      damping: 12, 
      stiffness: 200,
      mass: 0.8
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  return (
    <Animated.View style={[
      styles.container,
      message.isUser ? styles.userContainer : styles.aiContainer,
      animatedStyle
    ]}>
      <View style={[
        styles.bubble,
        message.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        {message.isUser ? (
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.userBubbleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.text, styles.userText]}>
              {message.text}
            </Text>
            <Text style={[styles.timestamp, styles.userTimestamp]}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.aiBubbleContent}>
            <Text style={[styles.text, styles.aiText]}>
              {message.text}
            </Text>
            <Text style={[styles.timestamp, styles.aiTimestamp]}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            <View style={styles.aiBubbleGlow} />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  userBubble: {
    borderBottomRightRadius: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    position: 'relative',
    overflow: 'hidden',
  },
  userBubbleGradient: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderBottomRightRadius: 8,
  },
  aiBubbleContent: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: 'relative',
  },
  aiBubbleGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Roboto-Light',
    marginTop: 6,
    opacity: 0.8,
    letterSpacing: 0.2,
  },
  userTimestamp: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: colors.textSecondary,
  },
});