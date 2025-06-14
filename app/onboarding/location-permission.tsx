import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  ChevronRight,
  Navigation,
  Shield,
  Zap,
  Clock
} from 'lucide-react-native';
import * as Location from 'expo-location';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { updateOnboardingData, setCurrentStep } = useOnboarding();
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const benefits = [
    {
      icon: Navigation,
      title: 'Personalized Recommendations',
      description: 'Get suggestions for nearby restaurants, hotels, and activities',
      color: colors.primary,
    },
    {
      icon: Zap,
      title: 'Instant Directions',
      description: 'Quick navigation to your chosen destinations',
      color: colors.warning,
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Live information about wait times and availability',
      color: colors.success,
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your location data is encrypted and never shared',
      color: '#8B5CF6',
    },
  ];

  const handleAllowLocation = async () => {
    if (Platform.OS === 'web') {
      // For web, use browser geolocation API
      if (navigator.geolocation) {
        setIsRequestingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            
            updateOnboardingData({
              locationPermissionGranted: true,
              currentLocation: location,
            });
            
            setCurrentStep(4);
            router.push('/onboarding/complete');
            setIsRequestingLocation(false);
          },
          (error) => {
            console.error('Location error:', error);
            Alert.alert(
              'Location Access',
              'Unable to get your location. You can still use the app without location services.',
              [{ text: 'OK', onPress: () => handleSkipLocation() }]
            );
            setIsRequestingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert(
          'Location Not Supported',
          'Your browser does not support location services.',
          [{ text: 'OK', onPress: () => handleSkipLocation() }]
        );
      }
    } else {
      // For mobile platforms
      try {
        setIsRequestingLocation(true);
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Location permission is required for personalized recommendations. You can enable it later in settings.',
            [{ text: 'OK', onPress: () => handleSkipLocation() }]
          );
          setIsRequestingLocation(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        updateOnboardingData({
          locationPermissionGranted: true,
          currentLocation,
        });
        
        setCurrentStep(4);
        router.push('/onboarding/complete');
      } catch (error) {
        console.error('Location error:', error);
        Alert.alert(
          'Location Error',
          'Unable to get your location. You can still use the app without location services.',
          [{ text: 'OK', onPress: () => handleSkipLocation() }]
        );
      } finally {
        setIsRequestingLocation(false);
      }
    }
  };

  const handleSkipLocation = () => {
    updateOnboardingData({
      locationPermissionGranted: false,
      currentLocation: null,
    });
    
    setCurrentStep(4);
    router.push('/onboarding/complete');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66.67%' }]} />
          </View>
          <Text style={styles.progressText}>Step 4 of 6</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MapPin size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Enable Location Services</Text>
          <Text style={styles.subtitle}>
            Help us provide you with the best personalized experience in Diani Beach
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <View key={index} style={styles.benefitItem}>
                <View style={[styles.benefitIconContainer, { backgroundColor: `${benefit.color}20` }]}>
                  <IconComponent size={24} color={benefit.color} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Shield size={20} color={colors.success} />
          <Text style={styles.privacyText}>
            Your privacy is important to us. Location data is only used to enhance your experience and is never shared with third parties.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.allowButton}
            onPress={handleAllowLocation}
            disabled={isRequestingLocation}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.allowButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MapPin size={20} color="#FFFFFF" />
              <Text style={styles.allowButtonText}>
                {isRequestingLocation ? 'Getting Location...' : 'Allow Location Access'}
              </Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipLocation}
            disabled={isRequestingLocation}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip for Now</Text>
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
  benefitsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  benefitItem: {
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
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: colors.success,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.success,
    marginLeft: 12,
    lineHeight: 20,
  },
  actions: {
    paddingBottom: 40,
  },
  allowButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  allowButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  allowButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
  },
});