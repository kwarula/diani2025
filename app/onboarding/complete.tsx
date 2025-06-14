import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle, Sparkles, ArrowRight, Heart, MapPin, Users } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { onboardingData, resetOnboardingData } = useOnboarding();
  const { updateProfile, user } = useAuth();

  const handleCompleteOnboarding = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to complete onboarding');
      return;
    }

    try {
      // Update user profile with onboarding data
      const profileUpdates = {
        full_name: onboardingData.fullName,
        onboarding_completed: true,
        user_type: onboardingData.userType,
        country_of_origin: onboardingData.countryOfOrigin,
        duration_of_stay: onboardingData.durationOfStay,
        duration_unit: onboardingData.durationUnit,
        preferred_language: onboardingData.preferredLanguage,
        location_permission_granted: onboardingData.locationPermissionGranted,
        current_location: onboardingData.currentLocation,
        interests: onboardingData.interests,
        accommodation_preferences: onboardingData.accommodationPreferences,
        activity_preferences: onboardingData.activityPreferences,
        food_preferences: onboardingData.foodPreferences,
        budget_range: onboardingData.budgetRange,
        travel_style: onboardingData.travelStyle,
        onboarding_completed_at: new Date().toISOString(),
      };

      const { error } = await updateProfile(profileUpdates);

      if (error) {
        Alert.alert('Error', 'Failed to save your preferences. Please try again.');
        return;
      }

      // Reset onboarding data
      resetOnboardingData();

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const getPersonalizedMessage = () => {
    const { userType, fullName, countryOfOrigin, interests } = onboardingData;
    const firstName = fullName.split(' ')[0];
    
    if (userType === 'tourist') {
      return `Welcome to Diani Beach, ${firstName}! We're excited to help you discover the best of our coastal paradise during your visit from ${countryOfOrigin}.`;
    } else {
      return `Karibu ${firstName}! As a local, you'll help us share the authentic beauty of Diani Beach with visitors from around the world.`;
    }
  };

  const getRecommendationPreview = () => {
    const { interests, userType } = onboardingData;
    
    if (interests.includes('food')) {
      return userType === 'tourist' 
        ? "🍽️ We'll recommend authentic Swahili restaurants and beachfront dining"
        : "🍽️ Share your favorite local eateries and hidden culinary gems";
    }
    
    if (interests.includes('water-sports')) {
      return userType === 'tourist'
        ? "🏄‍♂️ Get ready for kitesurfing, diving, and dhow sailing adventures"
        : "🏄‍♂️ Connect with water sports enthusiasts and local operators";
    }
    
    if (interests.includes('culture')) {
      return userType === 'tourist'
        ? "🏛️ Explore local culture, art galleries, and traditional experiences"
        : "🏛️ Help visitors discover authentic cultural experiences";
    }
    
    return userType === 'tourist'
      ? "✨ Discover personalized recommendations based on your interests"
      : "✨ Share your local knowledge and connect with fellow residents";
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Complete!</Text>
        </View>

        {/* Success Animation */}
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={64} color={colors.success} />
            <View style={styles.sparkleContainer}>
              <Sparkles size={24} color={colors.warning} style={styles.sparkle1} />
              <Sparkles size={20} color={colors.primary} style={styles.sparkle2} />
              <Sparkles size={18} color={colors.success} style={styles.sparkle3} />
            </View>
          </View>
          <Text style={styles.successTitle}>You're All Set!</Text>
          <Text style={styles.successSubtitle}>
            Your personalized Diani Beach experience is ready
          </Text>
        </View>

        {/* Personalized Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.personalizedMessage}>
            {getPersonalizedMessage()}
          </Text>
        </View>

        {/* Preview Cards */}
        <View style={styles.previewContainer}>
          <View style={styles.previewCard}>
            <Heart size={24} color={colors.primary} />
            <Text style={styles.previewText}>
              {getRecommendationPreview()}
            </Text>
          </View>

          {onboardingData.locationPermissionGranted && (
            <View style={styles.previewCard}>
              <MapPin size={24} color={colors.success} />
              <Text style={styles.previewText}>
                📍 Location-based recommendations for nearby attractions and services
              </Text>
            </View>
          )}

          <View style={styles.previewCard}>
            <Users size={24} color={colors.warning} />
            <Text style={styles.previewText}>
              {onboardingData.userType === 'tourist' 
                ? "🌟 Connect with locals and fellow travelers"
                : "🌟 Help visitors discover the real Diani Beach"
              }
            </Text>
          </View>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteOnboarding}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.success, '#45A049']}
            style={styles.completeButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.completeButtonText}>Start Exploring Diani</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
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
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.success,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
  },
  sparkle1: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 10,
    left: 0,
  },
  sparkle3: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  successTitle: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  messageContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 24,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  personalizedMessage: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    marginLeft: 16,
    lineHeight: 22,
  },
  completeButton: {
    borderRadius: 16,
    marginBottom: 40,
    shadowColor: colors.success,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  completeButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});