import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  ChevronRight,
  Utensils,
  Bed,
  Waves,
  Camera,
  Music,
  Dumbbell,
  Palette,
  ShoppingBag,
  TreePine,
  Users,
  Sparkles,
  Coffee
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

const interestOptions = [
  { id: 'food', label: 'Food & Dining', icon: Utensils, color: '#FF6B6B' },
  { id: 'accommodation', label: 'Hotels & Stays', icon: Bed, color: '#4ECDC4' },
  { id: 'water-sports', label: 'Water Sports', icon: Waves, color: '#45B7D1' },
  { id: 'photography', label: 'Photography', icon: Camera, color: '#96CEB4' },
  { id: 'nightlife', label: 'Nightlife & Music', icon: Music, color: '#FFEAA7' },
  { id: 'fitness', label: 'Fitness & Wellness', icon: Dumbbell, color: '#DDA0DD' },
  { id: 'culture', label: 'Culture & Arts', icon: Palette, color: '#98D8C8' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#F7DC6F' },
  { id: 'nature', label: 'Nature & Wildlife', icon: TreePine, color: '#82E0AA' },
  { id: 'social', label: 'Social Events', icon: Users, color: '#F8C471' },
  { id: 'luxury', label: 'Luxury Experiences', icon: Sparkles, color: '#BB8FCE' },
  { id: 'local-life', label: 'Local Life', icon: Coffee, color: '#85C1E9' },
];

const budgetOptions = [
  { id: 'budget', label: 'Budget-Friendly', description: 'Under $50/day', color: '#52B788' },
  { id: 'mid-range', label: 'Mid-Range', description: '$50-150/day', color: '#4A90E2' },
  { id: 'luxury', label: 'Luxury', description: '$150-500/day', color: '#8B5CF6' },
  { id: 'ultra-luxury', label: 'Ultra-Luxury', description: '$500+/day', color: '#FF6B6B' },
];

const travelStyleOptions = [
  { id: 'adventure', label: 'Adventure Seeker', icon: '🏄‍♂️' },
  { id: 'relaxation', label: 'Relaxation Focused', icon: '🧘‍♀️' },
  { id: 'cultural', label: 'Cultural Explorer', icon: '🏛️' },
  { id: 'foodie', label: 'Food Enthusiast', icon: '🍽️' },
  { id: 'photographer', label: 'Photography Lover', icon: '📸' },
  { id: 'social', label: 'Social Butterfly', icon: '🎉' },
  { id: 'romantic', label: 'Romantic Getaway', icon: '💕' },
  { id: 'family', label: 'Family Fun', icon: '👨‍👩‍👧‍👦' },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { onboardingData, updateOnboardingData, setCurrentStep } = useOnboarding();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>(onboardingData.interests);
  const [selectedBudget, setSelectedBudget] = useState(onboardingData.budgetRange);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>(onboardingData.travelStyle);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const toggleTravelStyle = (styleId: string) => {
    setSelectedTravelStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleContinue = () => {
    updateOnboardingData({
      interests: selectedInterests,
      budgetRange: selectedBudget,
      travelStyle: selectedTravelStyles,
    });
    
    setCurrentStep(3);
    router.push('/onboarding/location-permission');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>Step 3 of 6</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Heart size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>What interests you?</Text>
            <Text style={styles.subtitle}>
              Select your preferences to get personalized recommendations
            </Text>
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Interests</Text>
            <Text style={styles.sectionSubtitle}>Choose all that apply</Text>
            <View style={styles.optionsGrid}>
              {interestOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedInterests.includes(option.id);
                
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.interestOption,
                      isSelected && styles.interestOptionSelected,
                      { borderColor: option.color }
                    ]}
                    onPress={() => toggleInterest(option.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.interestIconContainer,
                      { backgroundColor: isSelected ? option.color : `${option.color}20` }
                    ]}>
                      <IconComponent 
                        size={24} 
                        color={isSelected ? '#FFFFFF' : option.color} 
                      />
                    </View>
                    <Text style={[
                      styles.interestLabel,
                      isSelected && styles.interestLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Budget Section (for tourists) */}
          {onboardingData.userType === 'tourist' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Budget Range</Text>
              <Text style={styles.sectionSubtitle}>What's your daily budget?</Text>
              <View style={styles.budgetOptions}>
                {budgetOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.budgetOption,
                      selectedBudget === option.id && styles.budgetOptionSelected,
                      { borderColor: option.color }
                    ]}
                    onPress={() => setSelectedBudget(option.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.budgetContent}>
                      <Text style={[
                        styles.budgetLabel,
                        selectedBudget === option.id && styles.budgetLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={[
                        styles.budgetDescription,
                        selectedBudget === option.id && styles.budgetDescriptionSelected
                      ]}>
                        {option.description}
                      </Text>
                    </View>
                    <View style={[
                      styles.budgetIndicator,
                      { backgroundColor: option.color },
                      selectedBudget === option.id && styles.budgetIndicatorSelected
                    ]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Travel Style Section (for tourists) */}
          {onboardingData.userType === 'tourist' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Travel Style</Text>
              <Text style={styles.sectionSubtitle}>How do you like to travel?</Text>
              <View style={styles.travelStyleGrid}>
                {travelStyleOptions.map((option) => {
                  const isSelected = selectedTravelStyles.includes(option.id);
                  
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.travelStyleOption,
                        isSelected && styles.travelStyleOptionSelected
                      ]}
                      onPress={() => toggleTravelStyle(option.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.travelStyleIcon}>{option.icon}</Text>
                      <Text style={[
                        styles.travelStyleLabel,
                        isSelected && styles.travelStyleLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

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
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestOption: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interestOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  interestIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  interestLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    textAlign: 'center',
  },
  interestLabelSelected: {
    color: colors.primary,
  },
  budgetOptions: {
    gap: 12,
  },
  budgetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  budgetOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  budgetContent: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  budgetLabelSelected: {
    color: colors.primary,
  },
  budgetDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  budgetDescriptionSelected: {
    color: colors.primary,
  },
  budgetIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.3,
  },
  budgetIndicatorSelected: {
    opacity: 1,
  },
  travelStyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  travelStyleOption: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  travelStyleOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  travelStyleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  travelStyleLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    textAlign: 'center',
  },
  travelStyleLabelSelected: {
    color: colors.primary,
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