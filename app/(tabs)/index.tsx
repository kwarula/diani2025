import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { Send, Mic, MicOff, ArrowUp, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatBubble } from '@/components/ChatBubble';
import { InfoCard } from '@/components/InfoCard';
import { VoiceInputOverlay } from '@/components/VoiceInputOverlay';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedItems, InfoCardData } from '@/hooks/useSavedItems';
import { useChatHistory } from '@/hooks/useChatHistory';

// n8n webhook endpoint
const WEBHOOK_URL = 'https://n8n.zaidicreatorlab.com/webhook-test/b65b3de6-506a-4c2a-86be-9bfd1c81d8ea';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  cards?: InfoCardData[];
}

interface WebhookResponse {
  text: string;
  richContent?: {
    type: string;
    data: any;
  };
  suggestions?: Array<{
    text: string;
    query: string;
  }>;
}

export default function ChatScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { toggleSaveItem, isItemSaved } = useSavedItems();
  const { saveMessage } = useChatHistory();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: user 
        ? `Jambo ${user.email?.split('@')[0]}! Welcome back to Discover Diani! 🏖️ I'm your AI guide for this coastal paradise. Ask me about the best restaurants, luxury hotels, exciting activities, or any local services you need. What would you like to explore today?`
        : "Jambo! Welcome to Discover Diani! 🏖️ I'm your AI guide for this coastal paradise. Ask me about the best restaurants, luxury hotels, exciting activities, or any local services you need. What would you like to explore first?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoadingResponse]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Function to format location data into a string
  const formatLocation = (location: any): string => {
    if (!location) return '';
    
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object') {
      // Handle coordinate objects
      if (location.lat && location.lng) {
        return `${location.lat}, ${location.lng}`;
      }
      
      // Handle address objects
      if (location.address) {
        return location.address;
      }
      
      // Handle other object formats
      if (location.name || location.description) {
        return location.name || location.description;
      }
      
      // Fallback for unknown object structure
      return JSON.stringify(location);
    }
    
    return String(location);
  };

  // Function to map webhook response data to InfoCardData
  const mapToInfoCardData = (item: any, index: number): InfoCardData => {
    return {
      id: item.id || `item-${Date.now()}-${index}`,
      title: item.name || item.title || 'Unknown',
      description: item.short_description || item.category || item.description || '',
      category: item.category || 'General',
      location: formatLocation(item.address || item.location),
      imageUrl: item.image || item.imageUrl || '',
      phone: item.contact_phone || item.phone || '',
      website: item.website_url || item.website || '',
      // Additional fields
      duration: item.duration,
      price: item.price,
      highlights: item.highlights,
      availability: item.availability,
      rating: item.average_rating || item.rating,
    };
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      const query = inputText.trim();
      setInputText('');
      setInputHeight(44);
      setIsLoadingResponse(true);

      // Save user message to chat history if user is logged in
      if (user) {
        await saveMessage(query, true);
      }

      try {
        // Make POST request to n8n webhook
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            timestamp: new Date().toISOString(),
            user_id: user?.id || 'anonymous',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const webhookData: WebhookResponse = await response.json();
        
        // Create AI response message
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: webhookData.text || "I received your message but couldn't generate a proper response. Please try asking again.",
          isUser: false,
          timestamp: new Date(),
        };

        // Process rich content if present
        if (webhookData.richContent && webhookData.richContent.data) {
          const { type, data } = webhookData.richContent;
          
          if (Array.isArray(data)) {
            // Handle plural types (activities, hotels, etc.) - array of items
            const cards = data.map((item, index) => mapToInfoCardData(item, index));
            aiResponse.cards = cards;
          } else if (typeof data === 'object' && data !== null) {
            // Handle singular types (restaurant, hotel, etc.) - single object
            const card = mapToInfoCardData(data, 0);
            aiResponse.cards = [card];
          }
        }

        setMessages(prev => [...prev, aiResponse]);

        // Save AI response to chat history if user is logged in
        if (user) {
          await saveMessage(aiResponse.text, false, webhookData.richContent);
        }

      } catch (error) {
        console.error('Webhook request failed:', error);
        
        // Add error message
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please check your internet connection and try again.",
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsLoadingResponse(false);
      }
    }
  };

  const handleVoiceInput = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice Input', 'Voice input is not available on web platform');
      return;
    }
    
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputText('What are the best restaurants near the beach?');
      }, 3000);
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(Math.max(height, 44), 120); // Min 44px, max 120px
    setInputHeight(newHeight);
  };

  const quickQuestions = [
    "Best restaurants near beach",
    "Luxury hotels with ocean views", 
    "Water sports activities",
    "Local transport options"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.surface, colors.surfaceSecondary]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/logo.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <View style={styles.logoGlow} />
            </View>
            <View style={styles.aiIndicator}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={styles.aiText}>AI Assistant</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          {messages.length === 1 && (
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>Try asking about:</Text>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[colors.primaryLight, colors.surface]}
                    style={styles.quickQuestionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.quickQuestionText}>{question}</Text>
                    <View style={styles.quickQuestionShimmer} />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {messages.map((message) => (
            <View key={message.id}>
              <ChatBubble message={message} />
              {message.cards && message.cards.length > 0 && (
                <View style={styles.cardsContainer}>
                  {message.cards.map((card) => (
                    <InfoCard 
                      key={card.id} 
                      card={card} 
                      onToggleSave={toggleSaveItem}
                      isSaved={isItemSaved(card.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
          {isLoadingResponse && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={[colors.surface, colors.surfaceElevated]}
            style={styles.inputContainerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={[styles.inputWrapper, { minHeight: inputHeight + 16 }]}>
              <TextInput
                ref={textInputRef}
                style={[styles.textInput, { height: inputHeight }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Message Discover Diani..."
                placeholderTextColor={colors.placeholder}
                multiline
                maxLength={500}
                onContentSizeChange={handleContentSizeChange}
                textAlignVertical="top"
              />
              <View style={styles.inputActions}>
                <TouchableOpacity
                  style={styles.voiceButton}
                  onPress={handleVoiceInput}
                  activeOpacity={0.7}>
                  {isListening ? (
                    <MicOff size={20} color={colors.textTertiary} />
                  ) : (
                    <Mic size={20} color={colors.textTertiary} />
                  )}
                </TouchableOpacity>
                {inputText.trim() ? (
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    disabled={!inputText.trim() || isLoadingResponse}
                    activeOpacity={0.8}>
                    <LinearGradient
                      colors={[colors.primary, colors.primaryDark]}
                      style={styles.sendButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <ArrowUp size={20} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
      {isListening && <VoiceInputOverlay onCancel={() => setIsListening(false)} />}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 80,
    height: 80,
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    opacity: 0.1,
    zIndex: -1,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  aiText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 100,
  },
  quickQuestionsContainer: {
    marginBottom: 20,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  quickQuestionButton: {
    marginVertical: 6,
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  quickQuestionGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.primary,
    position: 'relative',
    overflow: 'hidden',
  },
  quickQuestionText: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  quickQuestionShimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  cardsContainer: {
    marginTop: 12,
    marginLeft: 50,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  typingBubble: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.inputBackground,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 8,
    lineHeight: 20,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 8,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: colors.surfaceSecondary,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});