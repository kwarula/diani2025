import React, { useState, useEffect } from 'react';
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
  Users,
  Calendar,
  DollarSign,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Waves,
  TreePine,
  Shield,
  Award,
  Heart,
  MessageCircle,
  ExternalLink,
  Play,
  ChevronRight,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  // Restaurant specific
  cuisine?: string;
  dietaryOptions?: string[];
  reservationRequired?: boolean;
  averageMealPrice?: string;
  chefSpecialty?: string;
  // Hotel specific
  roomTypes?: Array<{
    type: string;
    price: string;
    amenities: string[];
    maxOccupancy: number;
  }>;
  hotelAmenities?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  // Activity specific
  duration?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  groupSize?: string;
  equipment?: string[];
  seasonality?: string;
  safetyInfo?: string[];
  // General
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    avatar?: string;
  }>;
  nearbyAttractions?: string[];
  accessibility?: string[];
  languages?: string[];
}

// Enhanced sample data with category-specific information
const sampleDetailedData: { [key: string]: DetailedInfoData } = {
  '1': {
    id: '1',
    title: 'Ali Barbour\'s Cave Restaurant',
    description: 'Unique dining experience in a natural coral cave with fresh seafood and romantic ambiance.',
    fullDescription: 'Ali Barbour\'s Cave Restaurant offers an extraordinary dining experience in a natural coral cave that\'s over 120,000 years old. The restaurant features fresh seafood, international cuisine, and an extensive wine list. The unique setting, with its natural rock formations and candlelit atmosphere, makes it perfect for romantic dinners and special occasions. Our chef sources ingredients locally, supporting the community while ensuring the freshest flavors.',
    category: 'Restaurant',
    location: 'Diani Beach Road, Kwale',
    imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    phone: '+254 721 234567',
    email: 'info@alibarbours.com',
    website: 'alibarbours.com',
    rating: 4.8,
    reviewCount: 342,
    priceRange: '$$$',
    cuisine: 'Seafood & International',
    dietaryOptions: ['Vegetarian', 'Gluten-Free', 'Halal'],
    reservationRequired: true,
    averageMealPrice: '$45-65',
    chefSpecialty: 'Grilled Lobster with Coconut Curry',
    openingHours: {
      'Monday': '6:00 PM - 11:00 PM',
      'Tuesday': '6:00 PM - 11:00 PM',
      'Wednesday': '6:00 PM - 11:00 PM',
      'Thursday': '6:00 PM - 11:00 PM',
      'Friday': '6:00 PM - 11:00 PM',
      'Saturday': '6:00 PM - 11:00 PM',
      'Sunday': '6:00 PM - 11:00 PM',
    },
    features: ['Romantic Setting', 'Fresh Seafood', 'Wine Selection', 'Cave Dining', 'Candlelit Atmosphere', 'Live Music'],
    gallery: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    ],
    socialMedia: {
      instagram: '@alibarbourscave',
      facebook: 'AliBarboursCave',
    },
    reviews: [
      {
        id: '1',
        author: 'Sarah Johnson',
        rating: 5,
        comment: 'Absolutely magical experience! The cave setting is breathtaking and the seafood is incredibly fresh.',
        date: '2024-01-15',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
      },
      {
        id: '2',
        author: 'Michael Chen',
        rating: 4,
        comment: 'Unique atmosphere and excellent service. The lobster was perfectly prepared.',
        date: '2024-01-10',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
      },
    ],
    accessibility: ['Wheelchair accessible entrance', 'Accessible restrooms'],
    languages: ['English', 'Swahili', 'French'],
  },
  '2': {
    id: '2',
    title: 'Almanara Luxury Resort',
    description: 'Exclusive beachfront resort with private villas, spa services, and pristine white sand beaches.',
    fullDescription: 'Almanara Luxury Resort is an exclusive beachfront property offering unparalleled luxury on Diani Beach. The resort features private villas with direct beach access, world-class spa services, and personalized butler service. Each villa is designed with traditional Swahili architecture blended with modern amenities, creating a perfect sanctuary for discerning travelers seeking privacy and luxury.',
    category: 'Hotel',
    location: 'Diani Beach',
    imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    phone: '+254 733 123456',
    email: 'reservations@almanara.com',
    website: 'almanara.com',
    rating: 4.9,
    reviewCount: 156,
    priceRange: '$$$$',
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    roomTypes: [
      {
        type: 'Ocean Villa',
        price: '$450/night',
        amenities: ['Private pool', 'Ocean view', 'Butler service', 'Kitchenette'],
        maxOccupancy: 4,
      },
      {
        type: 'Beach Villa',
        price: '$350/night',
        amenities: ['Direct beach access', 'Garden view', 'Private terrace'],
        maxOccupancy: 2,
      },
      {
        type: 'Garden Suite',
        price: '$250/night',
        amenities: ['Garden view', 'Balcony', 'Mini bar'],
        maxOccupancy: 2,
      },
    ],
    hotelAmenities: ['Spa', 'Private Beach', 'Fine Dining', 'Infinity Pool', 'Fitness Center', 'Water Sports', 'Butler Service', 'Airport Transfer'],
    features: ['Private Villas', 'Spa Services', 'Butler Service', 'Beach Access', 'Fine Dining', 'Pool'],
    gallery: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    ],
    socialMedia: {
      instagram: '@almanararesort',
      facebook: 'AlmanaraLuxuryResort',
    },
    accessibility: ['Wheelchair accessible rooms', 'Accessible pool area', 'Braille signage'],
    languages: ['English', 'Swahili', 'German', 'Italian'],
  },
  '3': {
    id: '3',
    title: 'Diani Kite Surfing Adventure',
    description: 'Professional kite surfing lessons and equipment rental with certified instructors.',
    fullDescription: 'Experience the thrill of kite surfing on the pristine waters of Diani Beach with our professional instructors. Whether you\'re a complete beginner or looking to improve your skills, our certified team provides personalized instruction in a safe and fun environment. We use only the latest equipment and follow international safety standards.',
    category: 'Activity',
    location: 'Diani Beach',
    imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    phone: '+254 722 567890',
    email: 'info@dianikitesurf.com',
    website: 'dianikitesurf.com',
    rating: 4.7,
    reviewCount: 89,
    priceRange: '$$',
    duration: '2-4 hours',
    difficulty: 'Easy',
    groupSize: 'Max 6 people',
    equipment: ['Kite', 'Board', 'Harness', 'Helmet', 'Life jacket'],
    seasonality: 'Best conditions: December - March, June - September',
    safetyInfo: [
      'All equipment regularly inspected',
      'Certified instructors with rescue training',
      'Weather conditions monitored constantly',
      'First aid kit on site',
    ],
    features: ['Professional Instruction', 'Equipment Included', 'Small Groups', 'Safety First', 'All Levels Welcome'],
    gallery: [
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    ],
    socialMedia: {
      instagram: '@dianikitesurf',
      facebook: 'DianiKiteSurfing',
    },
    accessibility: ['Adapted equipment available', 'Beach wheelchair access'],
    languages: ['English', 'Swahili', 'French', 'Spanish'],
  },
};

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { toggleSaveItem, isItemSaved } = useSavedItems();
  
  const styles = createStyles(colors);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detailData, setDetailData] = useState<DetailedInfoData | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (id && sampleDetailedData[id]) {
      setDetailData(sampleDetailedData[id]);
    }
  }, [id]);

  if (!detailData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.textSecondary} />
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
      Linking.openURL(`https://maps.google.com/?q=${query}`);
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
      Alert.alert('Share', `Share ${detailData.title}`);
    }
  };

  const handleToggleSave = () => {
    toggleSaveItem(detailData);
  };

  const handleSocialMedia = (platform: string, handle: string) => {
    let url = '';
    switch (platform) {
      case 'instagram':
        url = `https://instagram.com/${handle.replace('@', '')}`;
        break;
      case 'facebook':
        url = `https://facebook.com/${handle}`;
        break;
      case 'twitter':
        url = `https://twitter.com/${handle.replace('@', '')}`;
        break;
    }
    if (url) {
      Linking.openURL(url);
    }
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return colors.success;
      case 'moderate':
        return colors.warning;
      case 'challenging':
        return colors.error;
      default:
        return colors.textSecondary;
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
        <Star key="half" size={16} color={colors.warning} fill="transparent" />
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

  const renderCategorySpecificContent = () => {
    switch (detailData.category.toLowerCase()) {
      case 'restaurant':
        return (
          <>
            {/* Restaurant Specific Info */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Restaurant Details</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Utensils size={20} color={colors.success} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Cuisine</Text>
                    <Text style={styles.infoValue}>{detailData.cuisine}</Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <DollarSign size={20} color={colors.warning} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Average Meal Price</Text>
                    <Text style={styles.infoValue}>{detailData.averageMealPrice}</Text>
                  </View>
                </View>

                {detailData.chefSpecialty && (
                  <View style={styles.infoItem}>
                    <Award size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Chef's Specialty</Text>
                      <Text style={styles.infoValue}>{detailData.chefSpecialty}</Text>
                    </View>
                  </View>
                )}

                {detailData.reservationRequired && (
                  <View style={styles.infoItem}>
                    <Calendar size={20} color={colors.error} />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Reservation</Text>
                      <Text style={styles.infoValue}>Required</Text>
                    </View>
                  </View>
                )}
              </View>

              {detailData.dietaryOptions && detailData.dietaryOptions.length > 0 && (
                <View style={styles.tagsSection}>
                  <Text style={styles.tagsTitle}>Dietary Options</Text>
                  <View style={styles.tagsContainer}>
                    {detailData.dietaryOptions.map((option, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
                        <CheckCircle size={12} color={colors.success} />
                        <Text style={[styles.tagText, { color: colors.success }]}>{option}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </>
        );

      case 'hotel':
        return (
          <>
            {/* Hotel Specific Info */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Hotel Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Clock size={20} color={colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Check-in / Check-out</Text>
                    <Text style={styles.infoValue}>{detailData.checkInTime} / {detailData.checkOutTime}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Shield size={20} color={colors.success} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Cancellation</Text>
                    <Text style={styles.infoValue}>{detailData.cancellationPolicy}</Text>
                  </View>
                </View>
              </View>

              {/* Room Types */}
              {detailData.roomTypes && detailData.roomTypes.length > 0 && (
                <View style={styles.roomTypesSection}>
                  <Text style={styles.sectionTitle}>Room Types</Text>
                  {detailData.roomTypes.map((room, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.roomTypeCard,
                        selectedRoomType === index && styles.roomTypeCardSelected
                      ]}
                      onPress={() => setSelectedRoomType(index)}
                    >
                      <View style={styles.roomTypeHeader}>
                        <Text style={styles.roomTypeName}>{room.type}</Text>
                        <Text style={styles.roomTypePrice}>{room.price}</Text>
                      </View>
                      <View style={styles.roomTypeDetails}>
                        <View style={styles.roomTypeInfo}>
                          <Users size={14} color={colors.textSecondary} />
                          <Text style={styles.roomTypeText}>Max {room.maxOccupancy} guests</Text>
                        </View>
                        <View style={styles.roomAmenities}>
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <Text key={idx} style={styles.amenityText}>• {amenity}</Text>
                          ))}
                          {room.amenities.length > 3 && (
                            <Text style={styles.moreAmenities}>+{room.amenities.length - 3} more</Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Hotel Amenities */}
              {detailData.hotelAmenities && detailData.hotelAmenities.length > 0 && (
                <View style={styles.amenitiesSection}>
                  <Text style={styles.sectionTitle}>Hotel Amenities</Text>
                  <View style={styles.amenitiesGrid}>
                    {detailData.hotelAmenities.map((amenity, index) => (
                      <View key={index} style={styles.amenityItem}>
                        <View style={styles.amenityIcon}>
                          {getAmenityIcon(amenity)}
                        </View>
                        <Text style={styles.amenityLabel}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </>
        );

      case 'activity':
        return (
          <>
            {/* Activity Specific Info */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Activity Details</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Clock size={20} color={colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Duration</Text>
                    <Text style={styles.infoValue}>{detailData.duration}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.difficultyIcon, { backgroundColor: getDifficultyColor(detailData.difficulty || '') + '20' }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(detailData.difficulty || '') }]}>
                      {detailData.difficulty?.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Difficulty</Text>
                    <Text style={[styles.infoValue, { color: getDifficultyColor(detailData.difficulty || '') }]}>
                      {detailData.difficulty}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Users size={20} color={colors.warning} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Group Size</Text>
                    <Text style={styles.infoValue}>{detailData.groupSize}</Text>
                  </View>
                </View>

                {detailData.seasonality && (
                  <View style={styles.infoItem}>
                    <Calendar size={20} color={colors.success} />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Best Season</Text>
                      <Text style={styles.infoValue}>{detailData.seasonality}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Equipment */}
              {detailData.equipment && detailData.equipment.length > 0 && (
                <View style={styles.tagsSection}>
                  <Text style={styles.tagsTitle}>Equipment Included</Text>
                  <View style={styles.tagsContainer}>
                    {detailData.equipment.map((item, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                        <CheckCircle size={12} color={colors.primary} />
                        <Text style={[styles.tagText, { color: colors.primary }]}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Safety Information */}
              {detailData.safetyInfo && detailData.safetyInfo.length > 0 && (
                <View style={styles.safetySection}>
                  <Text style={styles.sectionTitle}>Safety Information</Text>
                  {detailData.safetyInfo.map((info, index) => (
                    <View key={index} style={styles.safetyItem}>
                      <Shield size={16} color={colors.success} />
                      <Text style={styles.safetyText}>{info}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        );

      default:
        return null;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconProps = { size: 20, color: colors.primary };
    switch (amenity.toLowerCase()) {
      case 'wifi':
      case 'wi-fi':
        return <Wifi {...iconProps} />;
      case 'parking':
      case 'car':
        return <Car {...iconProps} />;
      case 'spa':
        return <Heart {...iconProps} />;
      case 'pool':
      case 'infinity pool':
        return <Waves {...iconProps} />;
      case 'fitness center':
      case 'gym':
        return <Users {...iconProps} />;
      case 'restaurant':
      case 'fine dining':
        return <Utensils {...iconProps} />;
      case 'coffee':
      case 'cafe':
        return <Coffee {...iconProps} />;
      case 'garden':
      case 'private beach':
        return <TreePine {...iconProps} />;
      default:
        return <CheckCircle {...iconProps} />;
    }
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

          {/* Location */}
          {detailData.location && (
            <TouchableOpacity style={styles.locationSection} onPress={handleDirections}>
              <MapPin size={20} color={colors.textSecondary} />
              <Text style={styles.locationText}>{detailData.location}</Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              {detailData.fullDescription || detailData.description}
            </Text>
          </View>

          {/* Category Specific Content */}
          {renderCategorySpecificContent()}

          {/* Features */}
          {detailData.features && detailData.features.length > 0 && (
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Features & Highlights</Text>
              <View style={styles.featuresGrid}>
                {detailData.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <CheckCircle size={16} color={colors.success} />
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

          {/* Reviews */}
          {detailData.reviews && detailData.reviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
                  <Text style={styles.viewAllText}>
                    {showAllReviews ? 'Show Less' : 'View All'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {(showAllReviews ? detailData.reviews : detailData.reviews.slice(0, 2)).map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <View style={styles.reviewRating}>
                        {renderStars(review.rating)}
                        <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Social Media */}
          {detailData.socialMedia && (
            <View style={styles.socialSection}>
              <Text style={styles.sectionTitle}>Follow Us</Text>
              <View style={styles.socialContainer}>
                {detailData.socialMedia.instagram && (
                  <TouchableOpacity 
                    style={styles.socialButton}
                    onPress={() => handleSocialMedia('instagram', detailData.socialMedia!.instagram!)}
                  >
                    <Camera size={20} color="#E4405F" />
                    <Text style={styles.socialText}>Instagram</Text>
                  </TouchableOpacity>
                )}
                {detailData.socialMedia.facebook && (
                  <TouchableOpacity 
                    style={styles.socialButton}
                    onPress={() => handleSocialMedia('facebook', detailData.socialMedia!.facebook!)}
                  >
                    <Users size={20} color="#1877F2" />
                    <Text style={styles.socialText}>Facebook</Text>
                  </TouchableOpacity>
                )}
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
                  <ExternalLink size={16} color={colors.textTertiary} />
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
                  <ExternalLink size={16} color={colors.textTertiary} />
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
                  <ExternalLink size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Accessibility & Languages */}
          {(detailData.accessibility || detailData.languages) && (
            <View style={styles.additionalInfoSection}>
              {detailData.accessibility && detailData.accessibility.length > 0 && (
                <View style={styles.accessibilitySection}>
                  <Text style={styles.sectionTitle}>Accessibility</Text>
                  {detailData.accessibility.map((item, index) => (
                    <View key={index} style={styles.accessibilityItem}>
                      <CheckCircle size={16} color={colors.success} />
                      <Text style={styles.accessibilityText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {detailData.languages && detailData.languages.length > 0 && (
                <View style={styles.languagesSection}>
                  <Text style={styles.sectionTitle}>Languages Spoken</Text>
                  <View style={styles.languagesContainer}>
                    {detailData.languages.map((language, index) => (
                      <View key={index} style={styles.languageTag}>
                        <Text style={styles.languageText}>{language}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
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

        {detailData.website && (
          <TouchableOpacity style={styles.secondaryAction} onPress={handleWebsite}>
            <Globe size={20} color={colors.primary} />
            <Text style={styles.secondaryActionText}>Website</Text>
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
    paddingBottom: 120,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
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
  categorySection: {
    marginBottom: 32,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
  },
  difficultyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    textTransform: 'uppercase',
  },
  tagsSection: {
    marginTop: 20,
  },
  tagsTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginLeft: 6,
  },
  roomTypesSection: {
    marginTop: 20,
  },
  roomTypeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  roomTypeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roomTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomTypeName: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
  },
  roomTypePrice: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.primary,
  },
  roomTypeDetails: {
    gap: 8,
  },
  roomTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomTypeText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  roomAmenities: {
    gap: 4,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  moreAmenities: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
  },
  amenitiesSection: {
    marginTop: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    alignItems: 'center',
    width: (screenWidth - 80) / 4,
  },
  amenityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  amenityLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    textAlign: 'center',
  },
  safetySection: {
    marginTop: 20,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    marginLeft: 12,
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
  reviewsSection: {
    marginBottom: 32,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
  },
  reviewItem: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  socialSection: {
    marginBottom: 32,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    marginLeft: 8,
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
  additionalInfoSection: {
    marginBottom: 32,
  },
  accessibilitySection: {
    marginBottom: 20,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accessibilityText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 12,
  },
  languagesSection: {
    marginBottom: 20,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
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
    paddingHorizontal: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryActionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.primary,
    marginLeft: 6,
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
    marginVertical: 24,
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