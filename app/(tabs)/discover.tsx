import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  TrendingUp,
  Heart,
  Bookmark,
  Eye,
  Clock
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavedItems } from '@/hooks/useSavedItems';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 60) / 2; // Two cards per row with margins

interface CuratedItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  curator: {
    name: string;
    type: 'local' | 'influencer' | 'tourist' | 'expert';
    avatar: string;
  };
  location?: string;
  rating?: number;
  price?: string;
  tags?: string[];
  isNew?: boolean;
  isTrending?: boolean;
}

interface EventCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  items: CuratedItem[];
  color: string;
}

// Sample curated data
const sampleEventCollections: EventCollection[] = [
  {
    id: 'summertides-2024',
    title: 'Summer Tides Picks',
    subtitle: 'Curated for Summer Tides Festival',
    description: 'Handpicked experiences perfect for the Summer Tides festival week',
    startDate: '2024-07-01',
    endDate: '2024-07-07',
    imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    color: '#FF6B6B',
    items: [
      {
        id: 'st-1',
        title: 'Sunset Beach Yoga',
        description: 'Join daily yoga sessions on the pristine white sands',
        imageUrl: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg',
        category: 'Activity',
        curator: {
          name: 'Amara Wellness',
          type: 'local',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        },
        location: 'Diani Beach',
        rating: 4.9,
        tags: ['Wellness', 'Sunset', 'Beach'],
        isNew: true,
      },
      {
        id: 'st-2',
        title: 'Festival Food Market',
        description: 'Taste authentic coastal cuisine from local vendors',
        imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
        category: 'Food',
        curator: {
          name: 'Chef Kesi',
          type: 'local',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
        },
        location: 'Diani Beach Road',
        rating: 4.8,
        tags: ['Local Food', 'Festival', 'Street Food'],
        isTrending: true,
      },
    ],
  },
];

const sampleCuratedItems: CuratedItem[] = [
  {
    id: 'local-1',
    title: 'Hidden Coral Gardens',
    description: 'Secret snorkeling spot known only to locals',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
    category: 'Activity',
    curator: {
      name: 'Hassan Mwalimu',
      type: 'local',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    location: 'South Diani',
    rating: 4.9,
    tags: ['Snorkeling', 'Hidden Gem', 'Marine Life'],
    isNew: true,
  },
  {
    id: 'influencer-1',
    title: 'Boho Beach Picnic Setup',
    description: 'Instagram-worthy picnic experiences on the beach',
    imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    category: 'Experience',
    curator: {
      name: 'Sarah Wanderlust',
      type: 'influencer',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    },
    location: 'Diani Beach',
    rating: 4.7,
    price: '$45',
    tags: ['Instagram', 'Picnic', 'Boho'],
    isTrending: true,
  },
  {
    id: 'tourist-1',
    title: 'Authentic Dhow Sailing',
    description: 'Traditional sailing experience at golden hour',
    imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    category: 'Activity',
    curator: {
      name: 'Marco Adventures',
      type: 'tourist',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
    },
    location: 'Diani Marina',
    rating: 4.8,
    price: '$35',
    tags: ['Sailing', 'Sunset', 'Traditional'],
  },
  {
    id: 'expert-1',
    title: 'Colobus Monkey Sanctuary',
    description: 'Conservation center for endangered primates',
    imageUrl: 'https://images.pexels.com/photos/1661535/pexels-photo-1661535.jpeg',
    category: 'Wildlife',
    curator: {
      name: 'Dr. Jane Kimani',
      type: 'expert',
      avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg',
    },
    location: 'Diani Forest',
    rating: 4.9,
    tags: ['Wildlife', 'Conservation', 'Educational'],
    isNew: true,
  },
  {
    id: 'local-2',
    title: 'Mama Ngina\'s Kitchen',
    description: 'Home-cooked Swahili meals in a family setting',
    imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    category: 'Restaurant',
    curator: {
      name: 'Fatuma Ali',
      type: 'local',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
    location: 'Ukunda Village',
    rating: 4.8,
    price: '$12',
    tags: ['Authentic', 'Home Cooking', 'Swahili'],
  },
  {
    id: 'influencer-2',
    title: 'Luxury Beach Glamping',
    description: 'Glamorous camping with ocean views',
    imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    category: 'Accommodation',
    curator: {
      name: 'Luxury Nomad',
      type: 'influencer',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    },
    location: 'Diani Beach',
    rating: 4.9,
    price: '$120',
    tags: ['Luxury', 'Glamping', 'Ocean View'],
    isTrending: true,
  },
];

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { toggleSaveItem, isItemSaved } = useSavedItems();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Activity', 'Restaurant', 'Accommodation', 'Experience', 'Wildlife'];

  const filteredItems = selectedCategory === 'All' 
    ? sampleCuratedItems 
    : sampleCuratedItems.filter(item => item.category === selectedCategory);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getCuratorTypeColor = (type: string) => {
    switch (type) {
      case 'local': return colors.success;
      case 'influencer': return '#FF6B6B';
      case 'tourist': return colors.primary;
      case 'expert': return '#8B5CF6';
      default: return colors.accent;
    }
  };

  const getCuratorTypeIcon = (type: string) => {
    switch (type) {
      case 'local': return <MapPin size={12} color="#FFFFFF" />;
      case 'influencer': return <Star size={12} color="#FFFFFF" />;
      case 'tourist': return <Users size={12} color="#FFFFFF" />;
      case 'expert': return <Sparkles size={12} color="#FFFFFF" />;
      default: return <Heart size={12} color="#FFFFFF" />;
    }
  };

  const handleItemPress = (item: CuratedItem) => {
    // Navigate to details or handle item selection
    console.log('Selected item:', item.title);
  };

  const handleSaveItem = (item: CuratedItem) => {
    const cardData = {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      imageUrl: item.imageUrl,
      rating: item.rating,
    };
    toggleSaveItem(cardData);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.surface, colors.surfaceSecondary]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerTitleContainer}>
                <Compass size={32} color={colors.primary} />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>Discover Diani</Text>
                  <Text style={styles.headerSubtitle}>Curated by locals & experts</Text>
                </View>
              </View>
              <View style={styles.trendingIndicator}>
                <TrendingUp size={16} color={colors.warning} />
                <Text style={styles.trendingText}>Trending Now</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Event Collections */}
        {sampleEventCollections.map((collection) => (
          <View key={collection.id} style={styles.eventSection}>
            <View style={styles.eventHeader}>
              <LinearGradient
                colors={[collection.color, `${collection.color}CC`]}
                style={styles.eventHeaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image source={{ uri: collection.imageUrl }} style={styles.eventBackgroundImage} />
                <View style={styles.eventOverlay} />
                <View style={styles.eventHeaderContent}>
                  <View style={styles.eventBadge}>
                    <Calendar size={14} color="#FFFFFF" />
                    <Text style={styles.eventBadgeText}>
                      {new Date(collection.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                      {new Date(collection.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  <Text style={styles.eventTitle}>{collection.title}</Text>
                  <Text style={styles.eventSubtitle}>{collection.subtitle}</Text>
                  <Text style={styles.eventDescription}>{collection.description}</Text>
                </View>
              </LinearGradient>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventItemsContainer}
            >
              {collection.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.eventCard}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.9}
                >
                  <View style={styles.eventCardImageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.eventCardImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={styles.eventCardGradient}
                    />
                    {item.isNew && (
                      <View style={[styles.badge, { backgroundColor: colors.success }]}>
                        <Text style={styles.badgeText}>NEW</Text>
                      </View>
                    )}
                    {item.isTrending && (
                      <View style={[styles.badge, styles.trendingBadge, { backgroundColor: colors.warning }]}>
                        <TrendingUp size={10} color="#FFFFFF" />
                        <Text style={styles.badgeText}>HOT</Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      style={styles.saveButtonOverlay} 
                      onPress={() => handleSaveItem(item)}
                    >
                      <Bookmark 
                        size={16} 
                        color={isItemSaved(item.id) ? colors.warning : "#FFFFFF"} 
                        fill={isItemSaved(item.id) ? colors.warning : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.eventCardContent}>
                    <Text style={styles.eventCardTitle}>{item.title}</Text>
                    <Text style={styles.eventCardDescription}>{item.description}</Text>
                    {item.rating && (
                      <View style={styles.ratingContainer}>
                        <Star size={12} color={colors.warning} fill={colors.warning} />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Curated Items Grid */}
        <View style={styles.curatedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Curated Picks</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredItems.length} {filteredItems.length === 1 ? 'recommendation' : 'recommendations'}
            </Text>
          </View>
          
          <View style={styles.gridContainer}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.curatedCard}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.9}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.cardGradient}
                  />
                  
                  {/* Badges */}
                  <View style={styles.badgeContainer}>
                    {item.isNew && (
                      <View style={[styles.badge, { backgroundColor: colors.success }]}>
                        <Text style={styles.badgeText}>NEW</Text>
                      </View>
                    )}
                    {item.isTrending && (
                      <View style={[styles.badge, styles.trendingBadge, { backgroundColor: colors.warning }]}>
                        <TrendingUp size={10} color="#FFFFFF" />
                        <Text style={styles.badgeText}>HOT</Text>
                      </View>
                    )}
                  </View>

                  {/* Save Button */}
                  <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={() => handleSaveItem(item)}
                  >
                    <Bookmark 
                      size={16} 
                      color={isItemSaved(item.id) ? colors.warning : "#FFFFFF"} 
                      fill={isItemSaved(item.id) ? colors.warning : 'transparent'}
                    />
                  </TouchableOpacity>

                  {/* Category Badge */}
                  <View style={[styles.categoryBadge, { backgroundColor: getCuratorTypeColor(item.curator.type) }]}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  
                  {/* Curator Info */}
                  <View style={styles.curatorContainer}>
                    <Image source={{ uri: item.curator.avatar }} style={styles.curatorAvatar} />
                    <View style={styles.curatorInfo}>
                      <Text style={styles.curatorName}>{item.curator.name}</Text>
                      <View style={[styles.curatorType, { backgroundColor: getCuratorTypeColor(item.curator.type) }]}>
                        {getCuratorTypeIcon(item.curator.type)}
                        <Text style={styles.curatorTypeText}>{item.curator.type}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Rating and Price */}
                  <View style={styles.cardFooter}>
                    {item.rating && (
                      <View style={styles.ratingContainer}>
                        <Star size={12} color={colors.warning} fill={colors.warning} />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                    )}
                    {item.price && (
                      <Text style={styles.priceText}>{item.price}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  header: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTextContainer: {
    marginLeft: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
    marginTop: 2,
  },
  trendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  trendingText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: colors.warning,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  eventSection: {
    marginVertical: 16,
  },
  eventHeader: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  eventHeaderGradient: {
    position: 'relative',
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  eventBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  eventHeaderContent: {
    padding: 24,
    zIndex: 1,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  eventBadgeText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  eventTitle: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  eventSubtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  eventItemsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eventCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  eventCardImageContainer: {
    position: 'relative',
    height: 120,
  },
  eventCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  eventCardContent: {
    padding: 16,
  },
  eventCardTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 6,
  },
  eventCardDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  categorySection: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
  },
  categoryContainer: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  curatedSection: {
    marginTop: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  curatedCard: {
    width: cardWidth,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardImageContainer: {
    position: 'relative',
    height: 160,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  curatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  curatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  curatorInfo: {
    flex: 1,
  },
  curatorName: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    marginBottom: 2,
  },
  curatorType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  curatorTypeText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.primary,
  },
  bottomSpacing: {
    height: 100,
  },
});