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
  Globe, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  Languages
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

const countries = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Canada', 'Australia', 'South Africa', 'India', 'China',
  'Japan', 'Brazil', 'Argentina', 'Mexico', 'Russia', 'Sweden', 'Norway',
  'Denmark', 'Switzerland', 'Belgium', 'Austria', 'Other'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Dutch', 'Russian', 'Chinese', 'Japanese', 'Arabic', 'Hindi',
  'Swahili', 'Other'
];

const durationOptions = [
  { value: '1-3', unit: 'days', label: '1-3 days' },
  { value: '4-7', unit: 'days', label: '4-7 days' },
  { value: '1-2', unit: 'weeks', label: '1-2 weeks' },
  { value: '3-4', unit: 'weeks', label: '3-4 weeks' },
  { value: '1-2', unit: 'months', label: '1-2 months' },
  { value: '3+', unit: 'months', label: '3+ months' },
];

export default function TouristDetailsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { onboardingData, updateOnboardingData, setCurrentStep } = useOnboarding();
  
  const [fullName, setFullName] = useState(onboardingData.fullName);
  const [countryOfOrigin, setCountryOfOrigin] = useState(onboardingData.countryOfOrigin);
  const [selectedDuration, setSelectedDuration] = useState(
    onboardingData.durationOfStay && onboardingData.durationUnit 
      ? `${onboardingData.durationOfStay}-${onboardingData.durationUnit}`
      : ''
  );
  const [preferredLanguage, setPreferredLanguage] = useState(onboardingData.preferredLanguage);
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  const handleContinue = () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name');
      return;
    }
    
    if (!countryOfOrigin) {
      Alert.alert('Required Field', 'Please select your country of origin');
      return;
    }
    
    if (!selectedDuration) {
      Alert.alert('Required Field', 'Please select your duration of stay');
      return;
    }

    const durationOption = durationOptions.find(option => 
      `${option.value}-${option.unit}` === selectedDuration
    );

    updateOnboardingData({
      fullName: fullName.trim(),
      countryOfOrigin,
      durationOfStay: durationOption?.value || '',
      durationUnit: durationOption?.unit as 'days' | 'weeks' | 'months',
      preferredLanguage,
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
              <User size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Tell us about your visit</Text>
            <Text style={styles.subtitle}>
              Help us create the perfect Diani Beach experience for you
            </Text>
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

            {/* Country of Origin */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country of Origin *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <Globe size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <Text style={[
                  styles.dropdownText,
                  !countryOfOrigin && styles.placeholderText
                ]}>
                  {countryOfOrigin || 'Select your country'}
                </Text>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              {showCountryDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {countries.map((country) => (
                      <TouchableOpacity
                        key={country}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setCountryOfOrigin(country);
                          setShowCountryDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{country}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Duration of Stay */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>How long are you staying? *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowDurationDropdown(!showDurationDropdown)}
              >
                <Calendar size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <Text style={[
                  styles.dropdownText,
                  !selectedDuration && styles.placeholderText
                ]}>
                  {selectedDuration ? 
                    durationOptions.find(option => `${option.value}-${option.unit}` === selectedDuration)?.label
                    : 'Select duration'
                  }
                </Text>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              {showDurationDropdown && (
                <View style={styles.dropdown}>
                  {durationOptions.map((option) => (
                    <TouchableOpacity
                      key={`${option.value}-${option.unit}`}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedDuration(`${option.value}-${option.unit}`);
                        setShowDurationDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
              colors={[colors.primary, colors.primaryDark]}
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
  placeholderText: {
    color: colors.placeholder,
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
    shadowColor: colors.primary,
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