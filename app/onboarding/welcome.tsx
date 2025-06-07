import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle, Mic, MapPin, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function OnboardingWelcome() {
  const router = useRouter();
  const { colors } = useTheme();

  const features = [
    {
      icon: <MessageCircle size={32} color={colors.primary} />,
      title: 'Chat with AI',
      description: 'Ask anything about Diani Beach and get instant, accurate answers',
      color: colors.primary,
      bgColor: colors.primaryLight,
    },
    {
      icon: <Mic size={32} color={colors.success} />,
      title: 'Voice Input',
      description: 'Speak your questions naturally - no typing required',
      color: colors.success,
      bgColor: '#F0FDF4',
    },
    {
      icon: <MapPin size={32} color={colors.warning} />,
      title: 'Local Insights',
      description: 'Discover restaurants, hotels, activities, and hidden gems',
      color: colors.warning,
      bgColor: '#FFF7ED',
    },
  ];

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <View style={styles.headerIcon}>
              <MessageCircle size={40} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.title}>How It Works</Text>
          <Text style={styles.subtitle}>
            Discover Diani makes exploring easy with these powerful features
          </Text>
        </View>
        
        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.iconContainer, { backgroundColor: feature.bgColor }]}>
                {feature.icon}
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <View style={[styles.featureAccent, { backgroundColor: feature.color }]} />
            </View>
          ))}
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/onboarding/features')}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>Continue</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip to App</Text>
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
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: 24,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    flex: 1,
    paddingVertical: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  featureAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  actions: {
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
  },
});