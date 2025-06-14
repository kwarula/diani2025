import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, Alert } from 'react-native';
import { Bell, Trash2, CircleHelp as HelpCircle, Info, ChevronRight, Moon, Volume2, LogOut, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHistory } from '@/hooks/useChatHistory';

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const { user, signOut } = useAuth();
  const { clearChatHistory } = useChatHistory();
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: async () => {
          await clearChatHistory();
          Alert.alert('Success', 'Chat history has been cleared.');
        }},
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
          const { error } = await signOut();
          if (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } else {
            router.replace('/(auth)/signin');
          }
        }},
      ]
    );
  };

  const handleProfile = () => {
    // Navigate to profile screen (to be implemented)
    Alert.alert('Profile', 'Profile management coming soon!');
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Tips',
      'Tips for using Discover Diani:\n\n• Ask specific questions about locations\n• Use voice input for hands-free interaction\n• Try questions like "best restaurants near me"\n• Ask about activities, hotels, and local services\n• Save your favorite places for quick access'
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Discover Diani',
      'Version 1.0.0\n\nYour AI-powered guide to Diani Beach. Get instant answers about restaurants, hotels, activities, and local services.\n\nMade with ❤️ for travelers and locals.'
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>
      
      <View style={styles.content}>
        {/* User Section */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleProfile} activeOpacity={0.7}>
              <View style={styles.actionInfo}>
                <View style={styles.iconContainer}>
                  <User size={20} color={colors.primary} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Profile</Text>
                  <Text style={styles.actionSubtitle}>{user.email}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>Get updates and tips</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : colors.textTertiary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Volume2 size={20} color={colors.success} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingDescription}>Audio feedback for interactions</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.border, true: '#B8E6B8' }}
              thumbColor={soundEnabled ? colors.success : colors.textTertiary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Moon size={20} color="#8B5CF6" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Switch between light and dark themes</Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: '#D1B3FF' }}
              thumbColor={theme === 'dark' ? '#8B5CF6' : colors.textTertiary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleClearHistory} activeOpacity={0.7}>
            <View style={styles.actionInfo}>
              <View style={styles.iconContainer}>
                <Trash2 size={20} color={colors.error} />
              </View>
              <Text style={styles.actionTitle}>Clear Chat History</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleHelp} activeOpacity={0.7}>
            <View style={styles.actionInfo}>
              <View style={styles.iconContainer}>
                <HelpCircle size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionTitle}>Help & Tips</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleAbout} activeOpacity={0.7}>
            <View style={styles.actionInfo}>
              <View style={styles.iconContainer}>
                <Info size={20} color={colors.success} />
              </View>
              <Text style={styles.actionTitle}>About Discover Diani</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Section */}
        {user && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.signOutItem} onPress={handleSignOut} activeOpacity={0.7}>
              <View style={styles.actionInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                  <LogOut size={20} color={colors.error} />
                </View>
                <Text style={[styles.actionTitle, { color: colors.error }]}>Sign Out</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Auth Section for non-logged in users */}
        {!user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity 
              style={styles.authButton} 
              onPress={() => router.push('/(auth)/signin')}
              activeOpacity={0.8}
            >
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.authButton, styles.signUpButton]} 
              onPress={() => router.push('/(auth)/signup')}
              activeOpacity={0.8}
            >
              <Text style={[styles.authButtonText, styles.signUpButtonText]}>Create Account</Text>
            </TouchableOpacity>
          </View>
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    marginLeft: 12,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    marginLeft: 12,
    marginTop: 2,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  authButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  signUpButtonText: {
    color: '#FFFFFF',
  },
});