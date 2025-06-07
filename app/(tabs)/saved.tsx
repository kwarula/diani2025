import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Bookmark, Trash2, Heart } from 'lucide-react-native';
import { InfoCard } from '@/components/InfoCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavedItems } from '@/hooks/useSavedItems';

export default function SavedItemsScreen() {
  const { colors } = useTheme();
  const { 
    savedItems, 
    isLoading, 
    toggleSaveItem, 
    isItemSaved, 
    clearAllSavedItems, 
    refreshSavedItems 
  } = useSavedItems();

  // Refresh saved items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshSavedItems();
    }, [refreshSavedItems])
  );

  const handleClearAll = () => {
    if (savedItems.length === 0) return;
    
    Alert.alert(
      'Clear All Saved Items',
      'Are you sure you want to remove all saved items? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => {
            clearAllSavedItems();
            Alert.alert('Success', 'All saved items have been cleared.');
          }
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Heart size={64} color={colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>No Saved Items Yet</Text>
      <Text style={styles.emptyDescription}>
        Start exploring Diani Beach and save your favorite restaurants, hotels, and activities by tapping the bookmark icon on any recommendation.
      </Text>
      <View style={styles.emptyTipContainer}>
        <Bookmark size={20} color={colors.primary} />
        <Text style={styles.emptyTip}>
          Look for the bookmark icon on information cards in your chat conversations
        </Text>
      </View>
    </View>
  );

  const renderSavedItem = ({ item }: { item: any }) => (
    <View style={styles.cardContainer}>
      <InfoCard 
        card={item} 
        onToggleSave={toggleSaveItem}
        isSaved={isItemSaved(item.id)}
      />
    </View>
  );

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Bookmark size={28} color={colors.primary} />
            <Text style={styles.headerTitle}>Saved Items</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved
          </Text>
        </View>
        
        {savedItems.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        {savedItems.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={savedItems}
            renderItem={renderSavedItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refreshSavedItems}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          />
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
  header: {
    backgroundColor: colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 40,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.error,
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTip: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});