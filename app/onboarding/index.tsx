import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

export default function OnboardingStart() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoInnerShadow}>
              <Image 
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.imageContainer}>
          <View style={styles.heroImageWrapper}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg' }}
              style={styles.heroImage}
            />
            <LinearGradient
              colors={['rgba(74, 144, 226, 0.15)', 'rgba(82, 183, 136, 0.1)', 'transparent']}
              style={styles.imageOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.imageGlow} />
          </View>
        </View>
        
        <View style={styles.textContent}>
          <Text style={styles.title}>Welcome to Discover Diani</Text>
          <Text style={styles.subtitle}>
            Your AI-powered local guide to the beautiful coastal paradise of Diani Beach
          </Text>
          <Text style={styles.description}>
            Get instant answers about restaurants, hotels, activities, and local services from your personal AI assistant.
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={() => router.push('/onboarding/welcome')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip Introduction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  logoInnerShadow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 100,
    height: 100,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  heroImageWrapper: {
    width: '100%',
    height: 240,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 38,
    backgroundColor: colors.primary,
    opacity: 0.1,
    zIndex: -1,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 19,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.1,
  },
  actions: {
    paddingBottom: 40,
  },
  getStartedButton: {
    borderRadius: 32,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 36,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 26,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
});