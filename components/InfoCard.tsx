import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Phone, MapPin, Globe, Navigation, Bookmark, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

export interface InfoCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  imageUrl?: string;
  phone?: string;
  website?: string;
}

interface InfoCardProps {
  card: InfoCardData;
  onToggleSave?: (card: InfoCardData) => void;
  isSaved?: boolean;
}

export function InfoCard({ card, onToggleSave, isSaved = false }: InfoCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  
  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Entrance animation
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withSpring(0, { 
      damping: 15, 
      stiffness: 120,
      mass: 1
    });
    scale.value = withSpring(1, { 
      damping: 12, 
      stiffness: 150,
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

  const handleCall = () => {
    if (card.phone) {
      Linking.openURL(`tel:${card.phone}`);
    }
  };

  const handleWebsite = () => {
    if (card.website) {
      const url = card.website.startsWith('http') ? card.website : `https://${card.website}`;
      Linking.openURL(url);
    }
  };

  const handleDirections = () => {
    if (card.location) {
      const query = encodeURIComponent(`${card.title}, ${card.location}`);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  const handleToggleSave = () => {
    if (onToggleSave) {
      onToggleSave(card);
    }
  };

  const handleViewDetails = () => {
    router.push(`/details/${card.id}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'restaurant':
        return colors.success;
      case 'hotel':
        return colors.primary;
      case 'activity':
        return colors.warning;
      case 'service':
        return '#8B5CF6';
      default:
        return colors.accent;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'restaurant':
        return [colors.success, '#45A049'];
      case 'hotel':
        return [colors.primary, colors.primaryDark];
      case 'activity':
        return [colors.warning, '#E65100'];
      case 'service':
        return ['#8B5CF6', '#7C3AED'];
      default:
        return [colors.accent, colors.primary];
    }
  };

  const styles = createStyles(colors);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {card.imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: card.imageUrl }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageGradient}
          />
          {onToggleSave && (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleToggleSave}
              activeOpacity={0.8}
            >
              <View style={[styles.saveButtonInner, isSaved && styles.saveButtonSaved]}>
                <Bookmark 
                  size={18} 
                  color={isSaved ? colors.warning : '#FFFFFF'} 
                  fill={isSaved ? colors.warning : 'transparent'}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={getCategoryGradient(card.category)}
            style={styles.categoryBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.categoryText}>{card.category}</Text>
          </LinearGradient>
          {!card.imageUrl && onToggleSave && (
            <TouchableOpacity 
              style={styles.saveButtonInline} 
              onPress={handleToggleSave}
              activeOpacity={0.8}
            >
              <Bookmark 
                size={18} 
                color={isSaved ? colors.warning : colors.textTertiary} 
                fill={isSaved ? colors.warning : 'transparent'}
              />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.description}>{card.description}</Text>
        
        {card.location && (
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={styles.locationText}>{card.location}</Text>
          </View>
        )}
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewDetails} activeOpacity={0.7}>
            <LinearGradient
              colors={[colors.primaryLight, colors.surface]}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Eye size={16} color={colors.primary} />
              <Text style={styles.actionText}>Details</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {card.phone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall} activeOpacity={0.7}>
              <LinearGradient
                colors={['#F0FDF4', colors.surface]}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Phone size={16} color={colors.success} />
                <Text style={[styles.actionText, { color: colors.success }]}>Call</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          {card.location && (
            <TouchableOpacity style={styles.actionButton} onPress={handleDirections} activeOpacity={0.7}>
              <LinearGradient
                colors={['#FFF7ED', colors.surface]}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Navigation size={16} color={colors.warning} />
                <Text style={[styles.actionText, { color: colors.warning }]}>Directions</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonSaved: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: colors.warning,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  saveButtonInline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 19,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
    marginLeft: 8,
    letterSpacing: 0.1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    marginLeft: 6,
    letterSpacing: 0.2,
  },
});