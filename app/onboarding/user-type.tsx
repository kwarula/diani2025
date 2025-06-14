import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Plane, ChevronRight, Users, Chrome as Home } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function UserTypeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { updateOnboardingData, setCurrentStep } = useOnboarding();

  const handleUserTypeSelection = (userType: 'local' | 'tourist') => {
    updateOnboardingData({ userType });
    setCurrentStep(1);
    
    if (userType === 'tourist') {
      router.push('/onboarding/tourist-details');
    } else {
      router.push('/onboarding/local-details');
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '16.67%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 6</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Users size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            This helps us personalize your Diani Beach experience
          </Text>
        </View>

        {/* User Type Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleUserTypeSelection('tourist')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.optionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconContainer}>
                  <Plane size={40} color="#FFFFFF" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>I'm a Tourist</Text>
                  <Text style={styles.optionDescription}>
                    Visiting Diani Beach for vacation, adventure, or relaxation
                  </Text>
                </View>
                <ChevronRight size={24} color="#FFFFFF" />
              </View>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg' }}
                style={styles.optionBackgroundImage}
              />
              <View style={styles.optionOverlay} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleUserTypeSelection('local')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.success, '#45A049']}
              style={styles.optionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconContainer}>
                  <Home size={40} color="#FFFFFF" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>I'm a Local</Text>
                  <Text style={styles.optionDescription}>
                    Living in or around Diani Beach area
                  </Text>
                </View>
                <ChevronRight size={24} color="#FFFFFF" />
              </View>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }}
                style={styles.optionBackgroundImage}
              />
              <View style={styles.optionOverlay} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Why we ask this:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.benefitText}>Personalized recommendations</Text>
            </View>
            <View style={styles.benefitItem}>
              <Users size={16} color={colors.success} />
              <Text style={styles.benefitText}>Connect with like-minded people</Text>
            </View>
          </View>
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
  },
  progressContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  optionGradient: {
    position: 'relative',
    minHeight: 140,
    justifyContent: 'center',
  },
  optionBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.3,
  },
  optionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    zIndex: 1,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  benefitsContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    marginBottom: 40,
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
    marginLeft: 8,
  },
});