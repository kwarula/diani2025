import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  ChevronRight, 
  ChevronDown,
  Languages,
  Home
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

const languages = [
  'English', 'Swahili', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Dutch', 'Russian', 'Chinese', 'Japanese', 'Arabic', 'Hindi', 'Other'
];

export default function LocalDetailsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { onboardingData, updateOnboardingData, setCurrentStep } = useOnboarding();
  
  const [fullName, setFullName] = useState(onboardingData.fullName);
  const [preferredLanguage, setPreferredLanguage] = useState(onboardingData.preferredLanguage);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleContinue = () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name');
      return;
    }

    updateOnboardingData({
      fullName: fullName.trim(),
      preferredLanguage,
      // Set default values for local users
      countryOfOrigin: 'Kenya',
      durationOfStay: 'permanent',
      durationUnit: 'months',
    });
    
    setCurrentStep(2);
    router.push('/onboarding/preferences');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '33.33%' }]} />
            </View>
            <Text style={styles.progressText}>Step 2 of 6</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Home size={48} color={colors.success} />
            </View>
            <Text style={styles.title}>Welcome, Local!</Text>
            <Text style={styles.subtitle}>
              Help us personalize your Diani Beach experience as a local resident
            </Text>
          </View>

          {/* Local Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>As a local, you'll get:</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>🏠 Local business recommendations</Text>
              <Text style={styles.benefitItem}>🤝 Community events and gatherings</Text>
              <Text style={styles.benefitItem}>💡 Insider tips and hidden gems</Text>
              <Text style={styles.benefitItem}>🌟 Opportunities to share your knowledge</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.placeholder}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Preferred Language */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Language</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <Languages size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <Text style={styles.dropdownText}>{preferredLanguage}</Text>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              {showLanguageDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {languages.map((language) => (
                      <TouchableOpacity
                        key={language}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setPreferredLanguage(language);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{language}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.success, '#45A049']}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.success,
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
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.success,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    paddingVertical: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    marginLeft: 12,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
  },
  continueButton: {
    borderRadius: 16,
    shadowColor: colors.success,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});