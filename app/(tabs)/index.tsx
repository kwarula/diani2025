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
import { Send, Mic, MicOff, ArrowUp } from 'lucide-react-native';
import { ChatBubble } from '@/components/ChatBubble';
import { InfoCard } from '@/components/InfoCard';
import { VoiceInputOverlay } from '@/components/VoiceInputOverlay';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavedItems, InfoCardData } from '@/hooks/useSavedItems';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  cards?: InfoCardData[];
}

export default function ChatScreen() {
  const { colors } = useTheme();
  const { toggleSaveItem, isItemSaved } = useSavedItems();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Jambo! Welcome to Discover Diani! 🏖️ I'm your AI guide for this coastal paradise. Ask me about the best restaurants, luxury hotels, exciting activities, or any local services you need. What would you like to explore first?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  const sampleResponses: { [key: string]: { text: string; cards: InfoCardData[] } } = {
    restaurant: {
      text: "Here are some fantastic dining options in Diani Beach:",
      cards: [
        {
          id: '1',
          title: 'Ali Barbour\'s Cave Restaurant',
          description: 'Unique dining experience in a natural coral cave with fresh seafood and romantic ambiance.',
          category: 'Restaurant',
          location: 'Diani Beach Road, Kwale',
          imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
          phone: '+254 721 234567',
          website: 'alibarbours.com',
        },
        {
          id: '2',
          title: 'The Sands at Nomad',
          description: 'Beachfront dining with international cuisine and stunning ocean views.',
          category: 'Restaurant',
          location: 'Diani Beach',
          imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
          phone: '+254 722 567890',
          website: 'thesandsatnomad.com',
        },
      ]
    },
    hotel: {
      text: "These luxury hotels offer the perfect Diani Beach experience:",
      cards: [
        {
          id: '3',
          title: 'Almanara Luxury Resort',
          description: 'Exclusive beachfront resort with private villas, spa services, and pristine white sand beaches.',
          category: 'Hotel',
          location: 'Diani Beach',
          imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
          phone: '+254 733 123456',
          website: 'almanara.com',
        },
        {
          id: '4',
          title: 'Swahili Beach Resort',
          description: 'Boutique resort blending traditional Swahili architecture with modern luxury amenities.',
          category: 'Hotel',
          location: 'Diani Beach',
          imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
          phone: '+254 722 987654',
          website: 'swahilibeach.com',
        },
      ]
    },
    activity: {
      text: "Exciting activities and adventures await you in Diani:",
      cards: [
        {
          id: '5',
          title: 'Kite Surfing Adventures',
          description: 'Professional kite surfing lessons and equipment rental with certified instructors.',
          category: 'Activity',
          location: 'Diani Beach',
          imageUrl: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
          phone: '+254 712 345678',
          website: 'dianikitesurf.com',
        },
        {
          id: '6',
          title: 'Colobus Conservation',
          description: 'Visit rescued colobus monkeys and learn about wildlife conservation efforts.',
          category: 'Activity',
          location: 'Diani Beach Road',
          imageUrl: 'https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg',
          phone: '+254 700 234567',
          website: 'colobusconservation.org',
        },
      ]
    },
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getResponseForQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('restaurant') || lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('dining')) {
      return sampleResponses.restaurant;
    } else if (lowerQuery.includes('hotel') || lowerQuery.includes('accommodation') || lowerQuery.includes('stay') || lowerQuery.includes('resort')) {
      return sampleResponses.hotel;
    } else if (lowerQuery.includes('activity') || lowerQuery.includes('things to do') || lowerQuery.includes('fun') || lowerQuery.includes('adventure')) {
      return sampleResponses.activity;
    } else {
      return {
        text: "I'd be happy to help you explore Diani Beach! You can ask me about restaurants, hotels, activities, local services, or anything else you'd like to know. What specifically interests you?",
        cards: []
      };
    }
  };

  const handleSendMessage = () => {
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
      setIsTyping(true);

      // Simulate AI thinking time
      setTimeout(() => {
        setIsTyping(false);
        const response = getResponseForQuery(query);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isUser: false,
          timestamp: new Date(),
          cards: response.cards,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
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
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
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
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
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
          
          {isTyping && (
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
                  disabled={!inputText.trim() || isTyping}
                  activeOpacity={0.8}>
                  <ArrowUp size={20} color="#FFFFFF" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
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
    backgroundColor: colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLogo: {
    width: 80,
    height: 80,
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
  },
  quickQuestionButton: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  quickQuestionText: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: colors.primary,
    textAlign: 'center',
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
    backgroundColor: colors.textTertiary,
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.3,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.inputBackground,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});