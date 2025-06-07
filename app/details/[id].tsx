import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Globe,
  Navigation,
  Clock,
  Star,
  Bookmark,
  Share,
  Mail,
  Camera,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavedItems, InfoCardData } from '@/hooks/useSavedItems';

const { width: screenWidth } = Dimensions.get('window');

// Extended interface for detailed information
interface DetailedInfoData extends InfoCardData {
  email?: string;
  openingHours?: {
    [key: string]: string;
  };
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  features?: string[];
  gallery?: string[];
  fullDescription?: string;
}

// Sample detailed data - in a real app, this would come from an API
const sampleDetailedData: { [key: string]: DetailedInfoData } = {
  '1': {
    id: '1',
    title: 'Ali Barbour\'s Cave Restaurant',
    description: 'Unique dining experience in a natural coral cave with fresh seafood and romantic ambiance.',
    fullDescription: 'Ali Barbour\'s Cave Restaurant offers an extraordinary dining experience in a natural coral cave that\'s over 120,000 years old. The restaurant features fresh seafood, international cuisine, and an extensive wine list. The unique setting, with its natural rock formations and candlelit atmosphere, makes it perfect for romantic dinners and special occasions.',
    category: 'Restaurant',
    location: 'Diani Beach Road, Kwale',
    imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    phone: '+254 721 234567',
    email: 'info@alibarbours.com',
    website: 'alibarbours.com',
    rating: 4.8,
    reviewCount: 342,
    priceRange: '$$$',
    openingHours: {
      'Monday': '6:00 PM - 11:00 PM',
      'Tuesday': '6:00 PM - 11:00 PM',
      'Wednesday': '6:00 PM - 11:00 PM',
      'Thursday': '6:00 PM - 11:00 PM',
      'Friday': '6:00 PM - 11:00 PM',
      'Saturday': '6:00 PM - 11:00 PM',
      'Sunday': '6:00 PM - 11:00 PM',
    },
    features: ['Romantic Setting', 'Fresh Seafood', 'Wine Selection', 'Cave Dining', 'Candlelit Atmosphere'],
    gallery: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    ],
  },
  '2': {
    id: '2',
    title: 'The Sands at Nomad',
    description: 'Beachfront dining with international cuisine and stunning ocean views.',
    fullDescription: 'The Sands at Nomad is a premier beachfront restaurant offering international cuisine with a focus on fresh, local ingredients. Located directly on Diani Beach, guests can enjoy their meals with unobstructed views of the Indian Ocean. The restaurant features both indoor and outdoor seating, with a relaxed yet sophisticated atmosphere.',
    category: 'Restaurant',
    location: 'Diani Beach',
    imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    phone: '+254 722 567890',
    email: 'reservations@thesandsatnomad.com',
    website: 'thesandsatnomad.com',
    rating: 4.6,
    reviewCount: 198,
    priceRange: '$$',
    openingHours: {
      'Monday': '7:00 AM - 11:00 PM',
      'Tuesday': '7:00 AM - 11:00 PM',
      'Wednesday': '7:00 AM - 11:00 PM',
      'Thursday': '7:00 AM - 11:00 PM',
      'Friday': '7:00 AM - 11:00 PM',
      'Saturday': '7:00 AM - 11:00 PM',
      'Sunday': '7:00 AM - 11:00 PM',
    },
    features: ['Ocean Views', 'Beachfront', 'International Cuisine', 'Outdoor Seating', 'Sunset Views'],
    gallery: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    ],
  },
  '3': {
    id: '3',
    title: 'Almanara Luxury Resort',
    description: 'Exclusive beachfront resort with private villas, spa services, and pristine white sand beaches.',
    fullDescription: 'Almanara Luxury Resort is an exclusive beachfront property offering unparalleled luxury on Diani Beach. The resort features private villas with direct beach access, world-class spa services, and personalized butler service. Each villa is designed with traditional Swahili architecture blended with modern amenities, creating a perfect sanctuary for discerning travelers.',
    category: 'Hotel',
    location: 'Diani Beach',
    imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    phone: '+254 733 123456',
    email: 'reservations@almanara.com',
    website: 'almanara.com',
    rating: 4.9,
    reviewCount: 156,
    priceRange: '$$$$',
    features: ['Private Villas', 'Spa Services', 'Butler Service', 'Beach Access', 'Fine Dining', 'Pool'],
    gallery: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    ],
  },
};

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { toggleSaveItem, isItemSaved } = useSavedItems();
  
  // Initialize styles early to prevent initialization errors
  const styles = createStyles(colors);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detailData, setDetailData] = useState<DetailedInfoData | null>(null);

  useEffect(() => {
    if (id && sampleDetailedData[id]) {
      setDetailData(sampleDetailedData[id]);
    }
  }, [id]);

  if (!detailData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Information not found
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    if (detailData.phone) {
      Linking.openURL(`tel:${detailData.phone}`);
    }
  };

  const handleEmail = () => {
    if (detailData.email) {
      Linking.openURL(`mailto:${detailData.email}`);
    }
  };

  const handleWebsite = () => {
    if (detailData.website) {
      const url = detailData.website.startsWith('http') 
        ? detailData.website 
        : `https://${detailData.website}`;
      Linking.openURL(url);
    }
  };

  const handleDirections = () => {
    if (detailData.location) {
      const query = encodeURIComponent(`${detailData.title}, ${detailData.location}`);
      
      if (Platform.OS === 'ios') {
        // Try Apple Maps first, fallback to Google Maps
        Linking.canOpenURL(`maps://app?q=${query}`)
          .then(supported => {
            if (supported) {
              Linking.openURL(`maps://app?q=${query}`);
            } else {
              Linking.openURL(`https://maps.google.com/?q=${query}`);
            }
          })
          .catch(() => {
            Linking.openURL(`https://maps.google.com/?q=${query}`);
          });
      } else if (Platform.OS === 'android') {
        // Try Google Maps app first, fallback to web
        Linking.canOpenURL(`geo:0,0?q=${query}`)
          .then(supported => {
            if (supported) {
              Linking.openURL(`geo:0,0?q=${query}`);
            } else {
              Linking.openURL(`https://maps.google.com/?q=${query}`);
            }
          })
          .catch(() => {
            Linking.openURL(`https://maps.google.com/?q=${query}`);
          });
      } else {
        // Web platform - open Google Maps in browser
        Linking.openURL(`https://maps.google.com/?q=${query}`);
      }
    }
  };

  const handleShare = () => {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        navigator.share({
          title: detailData.title,
          text: detailData.description,
          url: window.location.href,
        });
      } else {
        Alert.alert('Share', 'Sharing is not supported on this platform');
      }
    } else {
      // For mobile platforms, you would use react-native-share or similar
      Alert.alert('Share', `Share ${detailData.title}`);
    }
  };

  const handleToggleSave = () => {
    toggleSaveItem(detailData);
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} color={colors.warning} fill={colors.warning} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half\" size={16} color={colors.warning} fill="transparent" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} color={colors.textTertiary} fill="transparent" />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(index);
            }}
          >
            {(detailData.gallery || [detailData.imageUrl]).filter(Boolean).map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.heroImage} />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          {detailData.gallery && detailData.gallery.length > 1 && (
            <View style={styles.imageIndicators}>
              {detailData.gallery.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleToggleSave}>
                <Bookmark
                  size={20}
                  color="#FFFFFF"
                  fill={isItemSaved(detailData.id) ? colors.warning : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Category */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{detailData.title}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(detailData.category) }]}>
                <Text style={styles.categoryText}>{detailData.category}</Text>
              </View>
            </View>
            
            {/* Rating and Reviews */}
            {detailData.rating && (
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(detailData.rating)}
                </View>
                <Text style={styles.ratingText}>
                  {detailData.rating} ({detailData.reviewCount} reviews)
                </Text>
                {detailData.priceRange && (
                  <Text style={styles.priceRange}> • {detailData.priceRange}</Text>
                )}
              </View>
            )}
          </View>

          {/* Location - Now Tappable */}
          {detailData.location && (
            <TouchableOpacity 
              style={styles.locationSection} 
              onPress={handleDirections}
              activeOpacity={0.7}
            >
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.locationText}>{detailData.location}</Text>
              <View style={styles.locationHint}>
                <Text style={styles.locationHintText}>Tap for directions</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              {detailData.fullDescription || detailData.description}
            </Text>
          </View>

          {/* Features */}
          {detailData.features && detailData.features.length > 0 && (
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                {detailData.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Opening Hours */}
          {detailData.openingHours && (
            <View style={styles.hoursSection}>
              <Text style={styles.sectionTitle}>Opening Hours</Text>
              <View style={styles.hoursContainer}>
                {Object.entries(detailData.openingHours).map(([day, hours]) => (
                  <View key={day} style={styles.hourRow}>
                    <Text style={styles.dayText}>{day}</Text>
                    <Text style={styles.hoursText}>{hours}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Contact Information */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactGrid}>
              {detailData.phone && (
                <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                  <View style={styles.contactIcon}>
                    <Phone size={20} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>{detailData.phone}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {detailData.email && (
                <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                  <View style={styles.contactIcon}>
                    <Mail size={20} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{detailData.email}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {detailData.website && (
                <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
                  <View style={styles.contactIcon}>
                    <Globe size={20} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Website</Text>
                    <Text style={styles.contactValue}>{detailData.website}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.primaryAction} onPress={handleDirections}>
          <Navigation size={20} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Get Directions</Text>
        </TouchableOpacity>
        
        {detailData.phone && (
          <TouchableOpacity style={styles.secondaryAction} onPress={handleCall}>
            <Phone size={20} color={colors.primary} />
            <Text style={styles.secondaryActionText}>Call</Text>
          </TouchableOpacity>
        )}
      </View>
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
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    flex: 1,
    marginRight: 16,
    lineHeight: 34,
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
  },
  priceRange: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    marginLeft: 12,
    flex: 1,
  },
  locationHint: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationHintText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  featureItem: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
  },
  hoursSection: {
    marginBottom: 32,
  },
  hoursContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
  },
  hoursText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  contactSection: {
    marginBottom: 32,
  },
  contactGrid: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryAction: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryActionText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryActionText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.primary,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
});