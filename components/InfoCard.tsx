import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Phone, MapPin, Globe, Navigation, Bookmark, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
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

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {card.imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: card.imageUrl }} style={styles.image} />
          {onToggleSave && (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleToggleSave}
              activeOpacity={0.8}
            >
              <Bookmark 
                size={20} 
                color={isSaved ? colors.warning : '#FFFFFF'} 
                fill={isSaved ? colors.warning : 'transparent'}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(card.category) }]}>
            <Text style={styles.categoryText}>{card.category}</Text>
          </View>
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
            <Eye size={16} color={colors.primary} />
            <Text style={styles.actionText}>View Details</Text>
          </TouchableOpacity>
          
          {card.phone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall} activeOpacity={0.7}>
              <Phone size={16} color={colors.primary} />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
          )}
          
          {card.location && (
            <TouchableOpacity style={styles.actionButton} onPress={handleDirections} activeOpacity={0.7}>
              <Navigation size={16} color={colors.primary} />
              <Text style={styles.actionText}>Directions</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    textTransform: 'uppercase',
  },
  saveButtonInline: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    marginLeft: 6,
  },
});