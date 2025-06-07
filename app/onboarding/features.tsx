import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Star, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function OnboardingFeatures() {
  const router = useRouter();
  const { colors } = useTheme();

  const tips = [
    {
      text: 'Ask: "What are the best restaurants near the beach?"',
      icon: <Star size={16} color={colors.success} />,
    },
    {
      text: 'Try: "I need a luxury hotel with ocean views"',
      icon: <Star size={16} color={colors.primary} />,
    },
    {
      text: 'Say: "What activities can I do this evening?"',
      icon: <Star size={16} color={colors.warning} />,
    },
    {
      text: 'Ask: "Where can I find local transport?"',
      icon: <Star size={16} color="#8B5CF6" />,
    },
  ];

  function getIconBgColor(index: number) {
    const lightColors = ['#F0FDF4', colors.primaryLight, '#FFF7ED', '#F3E8FF'];
    return lightColors[index % lightColors.length];
  }

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MessageSquare size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Ask Anything</Text>
          <Text style={styles.subtitle}>
            Get the most out of Discover Diani with these example questions
          </Text>
        </View>
        
        <View style={styles.tips}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={[styles.tipIconContainer, { backgroundColor: getIconBgColor(index) }]}>
                {tip.icon}
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.bottomSection}>
          <View style={styles.readyCard}>
            <View style={styles.readyIconContainer}>
              <CheckCircle size={40} color={colors.success} />
            </View>
            <Text style={styles.readyTitle}>You're All Set!</Text>
            <Text style={styles.readyDescription}>
              Start exploring Diani Beach with your AI guide
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.startText}>Start Exploring</Text>
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
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  tips: {
    flex: 1,
    paddingVertical: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  bottomSection: {
    paddingBottom: 40,
  },
  readyCard: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  readyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.success,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  readyTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 12,
  },
  readyDescription: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: colors.success,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
});