import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Bot, User, Brain, Calendar, Clock, Sparkles, 
  ThumbsUp, ThumbsDown, Copy, RotateCcw, Minimize2, Maximize2,
  Zap, Star, Shield, MessageSquare, Phone, Mail, ArrowRight,
  CheckCircle, AlertCircle, Info, Lightbulb, Target, Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ConversationManager } from '../data/aiConversationManager';
import { ResponseTemplateEngine, QUICK_RESPONSES } from '../data/aiResponseTemplates';
import { AI_RESPONSE_GUIDELINES, enhanceResponse, generateContextualResponse, ConversationState, Message as AIMessage } from '../data/aiResponseGuidelines';

interface Message extends AIMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
  intent?: string;
  feedback?: 'positive' | 'negative' | null;
  confidence?: number;
  helpful?: boolean | null;
  messageType?: 'text' | 'quick_action' | 'booking_prompt' | 'feature_highlight';
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [conversationManager] = useState(() => new ConversationManager(currentLanguage.code as 'sv' | 'en'));
  const [templateEngine] = useState(() => new ResponseTemplateEngine());
  const [conversationState, setConversationState] = useState<ConversationState>({
    messageHistory: [],
    userProfile: {
      previousInteractions: 0,
      preferredLanguage: currentLanguage.code,
      interests: [],
      urgencyLevel: 'medium'
    },
    currentIntent: '',
    conversationStage: 'initial_inquiry',
    lastTopics: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Premium welcome message with rich content
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = currentLanguage.code === 'sv' 
        ? '👋 **Hej! Jag är Axie från Axie Studio.**\n\n🤖 **Din personliga AI-assistent** som kan hjälpa dig med:\n\n🌐 **Webbplatser** - Från 8 995 kr\n📅 **Bokningssystem** - Smart automation\n🛒 **E-handel** - Komplett webshop\n📱 **Mobilappar** - iOS & Android\n\n✨ **Jag är tränad på all vår expertis** och kan svara på allt om digitala lösningar!\n\n💡 **Vad kan jag hjälpa dig med idag?**'
        : '👋 **Hi! I\'m Axie from Axie Studio.**\n\n🤖 **Your personal AI assistant** who can help you with:\n\n🌐 **Websites** - From 8,995 SEK\n📅 **Booking Systems** - Smart automation\n🛒 **E-commerce** - Complete webshop\n📱 **Mobile Apps** - iOS & Android\n\n✨ **I\'m trained on all our expertise** and can answer everything about digital solutions!\n\n💡 **How can I help you today?**';
      
      const welcomeMessage: Message = {
        id: 'welcome',
        text: welcomeText,
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome',
        confidence: 1.0,
        messageType: 'feature_highlight'
      };
      setMessages([welcomeMessage]);
      
      // Update conversation state
      setConversationState(prev => ({
        ...prev,
        messageHistory: [welcomeMessage],
        userProfile: {
          ...prev.userProfile,
          intent: 'welcome',
          feedback: null
        }
      }));
    }
  }, [isOpen, currentLanguage.code]);

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Enhanced AI response function with premium features
  const getAIResponse = async (userMessage: string): Promise<string> => {
    const thinkingTime = Math.min(1000 + (userMessage.length * 25), 3000);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    try {
      const response = await conversationManager.processMessage(userMessage);
      return response;
    } catch (error) {
      console.error('AI response error:', error);
      return currentLanguage.code === 'sv' 
        ? '🤖 Ursäkta, något gick fel med min AI-motor. Kan du försöka igen eller kontakta oss direkt på stefan@axiestudio.se?'
        : '🤖 Sorry, something went wrong with my AI engine. Can you try again or contact us directly at stefan@axiestudio.se?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
      feedback: null,
      confidence: 1.0,
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      const aiResponseText = await getAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date(),
        feedback: null,
        confidence: 0.95,
        messageType: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation state
      setConversationState(prev => ({
        ...prev,
        messageHistory: [...prev.messageHistory, userMessage, aiMessage],
        currentIntent: 'intent',
        lastTopics: [...prev.lastTopics.slice(-4), 'intent']
      }));

      // Check for booking intent and show booking prompt
      if (aiResponseText.includes('boka') || aiResponseText.includes('book') || aiResponseText.includes('konsultation')) {
        setTimeout(() => {
          const bookingPrompt: Message = {
            id: (Date.now() + 2).toString(),
            text: currentLanguage.code === 'sv' 
              ? '🎯 **Perfekt timing!** Vill du boka en kostnadsfri konsultation direkt nu? Det tar bara 2 minuter!'
              : '🎯 **Perfect timing!** Would you like to book a free consultation right now? It only takes 2 minutes!',
            isBot: true,
            timestamp: new Date(),
            messageType: 'booking_prompt',
            confidence: 1.0
          };
          setMessages(prev => [...prev, bookingPrompt]);
        }, 1500);
      }

      if (typeof window !== 'undefined' && window.trackAIInteraction) {
        window.trackAIInteraction('ai_response_generated', 'AI Assistant');
      }

    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage.code === 'sv' 
          ? '⚠️ Något gick fel. Försök igen eller kontakta oss direkt på stefan@axiestudio.se'
          : '⚠️ Something went wrong. Please try again or contact us directly at stefan@axiestudio.se',
        isBot: true,
        timestamp: new Date(),
        feedback: null,
        confidence: 1.0,
        messageType: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Premium quick action handlers
  const handleQuickAction = async (action: string) => {
    const quickMessages = {
      sv: {
        pricing: 'Vad kostar era tjänster? Jag vill veta om priser.',
        booking: 'Jag vill boka en kostnadsfri konsultation',
        website: 'Berätta om era webbplatser och vad som ingår',
        ecommerce: 'Jag behöver en webshop - vad kan ni erbjuda?',
        apps: 'Kan ni utveckla mobilappar? Vad kostar det?',
        support: 'Jag behöver hjälp med min befintliga lösning'
      },
      en: {
        pricing: 'What do your services cost? I want to know about pricing.',
        booking: 'I want to book a free consultation',
        website: 'Tell me about your websites and what\'s included',
        ecommerce: 'I need a webshop - what can you offer?',
        apps: 'Can you develop mobile apps? What does it cost?',
        support: 'I need help with my existing solution'
      }
    };

    const lang = currentLanguage.code as 'sv' | 'en';
    const message = quickMessages[lang][action as keyof typeof quickMessages[typeof lang]];
    
    if (message) {
      setInputText(message);
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handleMessageFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
    ));
    
    // Show thank you message
    const feedbackMessage: Message = {
      id: Date.now().toString(),
      text: helpful 
        ? (currentLanguage.code === 'sv' ? '🙏 Tack för din feedback! Det hjälper mig att bli bättre.' : '🙏 Thanks for your feedback! It helps me improve.')
        : (currentLanguage.code === 'sv' ? '📝 Tack för feedbacken. Jag ska förbättra mig!' : '📝 Thanks for the feedback. I\'ll improve!'),
      isBot: true,
      timestamp: new Date(),
      confidence: 1.0,
      messageType: 'text'
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, feedbackMessage]);
    }, 500);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\*\*/g, '').replace(/\n/g, ' '));
    
    // Show copy confirmation
    const copyMessage: Message = {
      id: Date.now().toString(),
      text: currentLanguage.code === 'sv' ? '📋 Kopierat till urklipp!' : '📋 Copied to clipboard!',
      isBot: true,
      timestamp: new Date(),
      confidence: 1.0,
      messageType: 'text'
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, copyMessage]);
    }, 200);
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowQuickActions(true);
    setConversationState(prev => ({
      ...prev,
      messageHistory: [],
      currentIntent: '',
      lastTopics: []
    }));
    
    // Re-initialize with welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        text: currentLanguage.code === 'sv' 
          ? '🔄 **Chat återställd!** Hej igen! Hur kan jag hjälpa dig nu?'
          : '🔄 **Chat reset!** Hello again! How can I help you now?',
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome',
        confidence: 1.0,
        messageType: 'text'
      };
      setMessages([welcomeMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleIframeLoad = () => {
    setIsBookingLoading(false);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setIsBookingLoading(true);
    
    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      text: currentLanguage.code === 'sv' 
        ? '✅ **Tack!** Om du ändrar dig kan du alltid boka senare. Finns det något annat jag kan hjälpa dig med?'
        : '✅ **Thanks!** If you change your mind, you can always book later. Is there anything else I can help you with?',
      isBot: true,
      timestamp: new Date(),
      confidence: 1.0,
      messageType: 'text'
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, confirmMessage]);
    }, 500);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 ${isMinimized ? 'pointer-events-none' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`${
            isMinimized 
              ? 'w-96 h-20 bottom-4 right-4' 
              : 'w-full h-full'
          } bg-white flex flex-col overflow-hidden transition-all duration-500 ease-in-out shadow-2xl ${
            isMinimized ? 'fixed rounded-2xl' : ''
          }`}
          style={{ backgroundColor: 'white', colorScheme: 'light only' }}
          initial={{ scale: isMinimized ? 1 : 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Premium Header */}
          {!isBookingModalOpen && (
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 flex-shrink-0 shadow-lg relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8 animate-float" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
                    <Brain className="text-white" size={18} />
                  </div>
                  <div className={isMinimized ? 'hidden' : ''}>
                    <h3 className="font-bold text-white text-base">Axie AI Assistant</h3>
                    <div className="flex items-center space-x-2 text-white/90 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Online • Powered by Axie Studio</span>
                      <Award size={12} className="text-yellow-300" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {!isMinimized && (
                    <>
                      <button
                        onClick={handleClearChat}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30 group"
                        title="Clear chat"
                      >
                        <RotateCcw size={14} className="text-white group-hover:rotate-180 transition-transform duration-300" />
                      </button>
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30"
                        title="Minimize"
                      >
                        <Minimize2 size={14} className="text-white" />
                      </button>
                    </>
                  )}
                  
                  {isMinimized && (
                    <button
                      onClick={() => setIsMinimized(false)}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30"
                      title="Maximize"
                    >
                      <Maximize2 size={14} className="text-white" />
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-red-500/80 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Messages Area */}
          {!isBookingModalOpen && !isMinimized && (
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className={`flex items-start space-x-2 max-w-[90%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                      {/* Avatar */}
                      <div className={`p-2 rounded-xl flex-shrink-0 shadow-md ${
                        message.isBot 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        {message.isBot ? (
                          <Bot size={16} className="text-white" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {/* Message bubble */}
                        <div className={`p-3 rounded-2xl shadow-md border ${
                          message.isBot 
                            ? 'bg-white border-gray-200 text-gray-800' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
                        } ${
                          message.messageType === 'booking_prompt' ? 'ring-2 ring-green-400 bg-green-50' :
                          message.messageType === 'feature_highlight' ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                        }`}>
                          {/* Message content */}
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {message.text.split('**').map((part, index) => 
                              index % 2 === 1 ? <strong key={index} className="font-bold">{part}</strong> : part
                            )}
                          </div>
                          
                          {/* Special message type indicators */}
                          {message.messageType === 'booking_prompt' && (
                            <div className="mt-2 flex items-center space-x-1 text-green-700">
                              <Target size={12} />
                              <span className="text-xs font-medium">Booking Opportunity</span>
                            </div>
                          )}
                          
                          {message.messageType === 'feature_highlight' && (
                            <div className="mt-2 flex items-center space-x-1 text-blue-700">
                              <Lightbulb size={12} />
                              <span className="text-xs font-medium">AI Assistant Features</span>
                            </div>
                          )}
                          
                          {/* Message metadata */}
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.confidence && (
                              <div className="flex items-center space-x-1">
                                <Shield size={12} />
                                <span>AI Confidence: {Math.round(message.confidence * 100)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Message actions */}
                        {message.isBot && (
                          <div className="flex items-center space-x-2 mt-2 ml-1">
                            <button
                              onClick={() => handleCopyMessage(message.text)}
                              className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-all duration-200 group"
                              title="Copy message"
                            >
                              <Copy size={12} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, true)}
                              className={`p-1 rounded-md transition-all duration-200 ${
                                message.helpful === true 
                                  ? 'text-green-600 bg-green-50' 
                                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp size={12} />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, false)}
                              className={`p-1 rounded-md transition-all duration-200 ${
                                message.helpful === false 
                                  ? 'text-red-600 bg-red-50' 
                                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Premium typing indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-md">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm text-gray-600 ml-2">Axie is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Premium Input Area */}
          {!isBookingModalOpen && !isMinimized && (
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 shadow-lg">
              <div>
                {/* Quick Actions */}
                {showQuickActions && (
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                      <Zap size={14} className="mr-1 text-blue-500" />
                      {currentLanguage.code === 'sv' ? 'Snabbval' : 'Quick Actions'}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickAction('pricing')}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">💰</span>
                        <span>{currentLanguage.code === 'sv' ? 'Priser' : 'Pricing'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('website')}
                        className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">🌐</span>
                        <span>{currentLanguage.code === 'sv' ? 'Webbplats' : 'Website'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('ecommerce')}
                        className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">🛒</span>
                        <span>{currentLanguage.code === 'sv' ? 'E-handel' : 'E-commerce'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('apps')}
                        className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">📱</span>
                        <span>{currentLanguage.code === 'sv' ? 'Appar' : 'Apps'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('booking')}
                        className="bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 text-pink-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">📅</span>
                        <span>{currentLanguage.code === 'sv' ? 'Bokning' : 'Booking'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('support')}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">🛠️</span>
                        <span>{currentLanguage.code === 'sv' ? 'Support' : 'Support'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Premium Booking Button */}
                <div className="mb-4">
                  <motion.button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-500 flex items-center justify-center group relative overflow-hidden"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <Calendar className="mr-2 group-hover:scale-110 transition-transform duration-300" size={18} />
                    <span className="relative z-10">{currentLanguage.code === 'sv' ? 'Boka Kostnadsfri Konsultation' : 'Book Free Consultation'}</span>
                    <Sparkles className="ml-2 group-hover:scale-110 transition-transform duration-300 animate-pulse" size={18} />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.button>
                </div>
                
                {/* Premium Input */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={currentLanguage.code === 'sv' ? 'Skriv ditt meddelande här...' : 'Type your message here...'}
                      className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm"
                      disabled={isTyping}
                      maxLength={500}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MessageSquare size={16} />
                    </div>
                  </div>
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl touch-manipulation group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </div>
                
                {/* Contact options */}
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <a 
                    href="mailto:stefan@axiestudio.se"
                    className="flex items-center space-x-2 hover:text-blue-600 transition-colors group"
                  >
                    <Mail size={12} className="group-hover:scale-110 transition-transform" />
                    <span>stefan@axiestudio.se</span>
                  </a>
                  <a 
                    href="tel:+46735132620"
                    className="flex items-center space-x-2 hover:text-green-600 transition-colors group"
                  >
                    <Phone size={12} className="group-hover:scale-110 transition-transform" />
                    <span>+46 735 132 620</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Premium Booking Modal */}
          <AnimatePresence>
            {isBookingModalOpen && (
              <motion.div
                className="absolute inset-0 bg-white flex flex-col z-50"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Premium Booking Header */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-6 flex-shrink-0 shadow-xl relative overflow-hidden">
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                        <Calendar className="text-white" size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">
                          {currentLanguage.code === 'sv' ? 'Boka Konsultation' : 'Book Consultation'}
                        </h2>
                        <p className="text-white/90 text-lg">
                          {currentLanguage.code === 'sv' ? 'Välj en tid som passar dig perfekt' : 'Choose a time that suits you perfectly'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCloseBooking}
                      className="bg-white/20 hover:bg-red-500/80 p-3 rounded-2xl transition-all duration-300 touch-manipulation min-w-[52px] min-h-[52px] flex items-center justify-center backdrop-blur-sm border border-white/30 group"
                    >
                      <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                  
                  {/* Premium Features */}
                  <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30">
                      <Clock size={20} className="text-white" />
                      <div>
                        <div className="text-white font-semibold">{currentLanguage.code === 'sv' ? '30-60 min' : '30-60 min'}</div>
                        <div className="text-white/80 text-sm">{currentLanguage.code === 'sv' ? 'Personlig tid' : 'Personal time'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30">
                      <Sparkles size={20} className="text-white" />
                      <div>
                        <div className="text-white font-semibold">{currentLanguage.code === 'sv' ? 'Kostnadsfritt' : 'Free'}</div>
                        <div className="text-white/80 text-sm">{currentLanguage.code === 'sv' ? 'Ingen kostnad' : 'No cost'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30">
                      <Brain size={20} className="text-white" />
                      <div>
                        <div className="text-white font-semibold">{currentLanguage.code === 'sv' ? 'AI-expert Stefan' : 'AI expert Stefan'}</div>
                        <div className="text-white/80 text-sm">{currentLanguage.code === 'sv' ? 'Grundare' : 'Founder'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Premium Booking Content */}
                <div className="flex-1 bg-white overflow-hidden relative">
                  {/* Loading State */}
                  {isBookingLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 z-10">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-6"></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {currentLanguage.code === 'sv' ? 'Laddar bokningskalender...' : 'Loading booking calendar...'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {currentLanguage.code === 'sv' ? 'Förbereder din premium bokningsupplevelse...' : 'Preparing your premium booking experience...'}
                        </p>
                        <div className="mt-4 flex items-center justify-center space-x-2">
                          <CheckCircle className="text-green-500" size={16} />
                          <span className="text-sm text-gray-600">{currentLanguage.code === 'sv' ? 'Säker bokning' : 'Secure booking'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Google Calendar Iframe */}
                  <iframe
                    src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0QR3uRxVB7rb4ZHqJ1qYmz-T0e2CFtV5MYekvGDq1qyWxsV_Av3nP3zEGk0DrH2HqpTLoXuK0h"
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    title={currentLanguage.code === 'sv' ? 'Boka konsultation' : 'Book consultation'}
                    style={{
                      minHeight: '500px',
                      background: 'white'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;