import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Brain, Calendar, Clock, Sparkles, ThumbsUp, ThumbsDown, Copy, RotateCcw, Minimize2, Maximize2 } from 'lucide-react';
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

  // Initialize chat with simple welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = currentLanguage.code === 'sv' 
        ? '👋 **Hej! Jag är Axie från Axie Studio.**\n\nJag är din personliga AI-assistent och kan hjälpa dig med:\n\n🌐 **Webbplatser** - Från 8 995 kr\n📅 **Bokningssystem** - Smart automation\n🛒 **E-handel** - Komplett webshop\n📱 **Mobilappar** - iOS & Android\n\n💡 **Vad kan jag hjälpa dig med idag?**'
        : '👋 **Hi! I\'m Axie from Axie Studio.**\n\nI\'m your personal AI assistant and can help you with:\n\n🌐 **Websites** - From 8,995 SEK\n📅 **Booking Systems** - Smart automation\n🛒 **E-commerce** - Complete webshop\n📱 **Mobile Apps** - iOS & Android\n\n💡 **How can I help you today?**';
      
      const welcomeMessage: Message = {
        id: 'welcome',
        text: welcomeText,
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome',
        confidence: 1.0
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
  }, [isOpen, currentLanguage.code, conversationManager]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Enhanced AI response function
  const getAIResponse = async (userMessage: string): Promise<string> => {
    const thinkingTime = Math.min(800 + (userMessage.length * 20), 2500);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    try {
      const response = await conversationManager.processMessage(userMessage);
      return response;
    } catch (error) {
      console.error('AI response error:', error);
      return currentLanguage.code === 'sv' 
        ? 'Ursäkta, något gick fel. Kan du försöka igen eller kontakta oss direkt på stefan@axiestudio.se?'
        : 'Sorry, something went wrong. Can you try again or contact us directly at stefan@axiestudio.se?';
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
      confidence: 1.0
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponseText = await getAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date(),
        feedback: null,
        confidence: 1.0
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation state
      setConversationState(prev => ({
        ...prev,
        messageHistory: [...prev.messageHistory, userMessage, aiMessage],
        currentIntent: 'intent',
        lastTopics: [...prev.lastTopics.slice(-4), 'intent'] // Keep last 5 topics
      }));

      // Check for booking intent and open modal
      if (aiResponseText.includes('bokningssystem') || aiResponseText.includes('booking system')) {
        setTimeout(() => {
          setIsBookingModalOpen(true);
        }, 2000);
      }

      if (typeof window !== 'undefined' && window.trackAIInteraction) {
        window.trackAIInteraction('ai_response_generated', 'AI Assistant');
      }

    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage.code === 'sv' 
          ? 'Något gick fel. Försök igen eller kontakta oss direkt.'
          : 'Something went wrong. Please try again or contact us directly.',
        isBot: true,
        timestamp: new Date(),
        feedback: null,
        confidence: 1.0
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick action handlers
  const handleQuickAction = async (action: string) => {
    const quickMessages = {
      sv: {
        pricing: 'Vad kostar era tjänster?',
        booking: 'Jag vill boka en konsultation',
        website: 'Berätta om era webbplatser',
        ecommerce: 'Jag behöver en webshop'
      },
      en: {
        pricing: 'What do your services cost?',
        booking: 'I want to book a consultation',
        website: 'Tell me about your websites',
        ecommerce: 'I need a webshop'
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
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClearChat = () => {
    setMessages([]);
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
          ? '👋 **Hej igen!** Hur kan jag hjälpa dig nu?'
          : '👋 **Hello again!** How can I help you now?',
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome',
        confidence: 1.0
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
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${isMinimized ? 'pointer-events-none' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`${isMinimized ? 'w-80 h-16' : 'w-full h-full'} bg-white flex flex-col overflow-hidden transition-all duration-300`}
          style={{ backgroundColor: 'white', colorScheme: 'light only' }}
          initial={{ scale: isMinimized ? 1 : 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          {!isBookingModalOpen && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex-shrink-0 shadow-lg">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Brain className="text-white" size={20} />
                  </div>
                  <div className={isMinimized ? 'hidden' : ''}>
                    <h3 className="font-bold text-white text-lg">Axie AI Assistant</h3>
                    <p className="text-white/80 text-xs">Powered by Axie Studio • Online nu</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!isMinimized && (
                    <>
                      <button
                        onClick={handleClearChat}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors touch-manipulation backdrop-blur-sm"
                        title="Clear chat"
                      >
                        <RotateCcw size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors touch-manipulation backdrop-blur-sm"
                        title="Minimize"
                      >
                        <Minimize2 size={16} className="text-white" />
                      </button>
                    </>
                  )}
                  
                  {isMinimized && (
                    <button
                      onClick={() => setIsMinimized(false)}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors touch-manipulation backdrop-blur-sm"
                      title="Maximize"
                    >
                      <Maximize2 size={16} className="text-white" />
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors touch-manipulation backdrop-blur-sm"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {!isBookingModalOpen && !isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        message.isBot 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-gray-400'
                      }`}>
                        {message.isBot ? (
                          <Bot size={16} className="text-white" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`p-3 rounded-2xl shadow-sm ${
                          message.isBot 
                            ? 'bg-white border border-gray-200 text-gray-800' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        }`}>
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {message.text.split('**').map((part, index) => 
                              index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                            )}
                          </div>
                          
                          {/* Message metadata */}
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.confidence && (
                              <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Message actions */}
                        {message.isBot && (
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleCopyMessage(message.text)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                              title="Copy message"
                            >
                              <Copy size={12} />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, true)}
                              className={`p-1 rounded transition-colors ${
                                message.helpful === true ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp size={12} />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, false)}
                              className={`p-1 rounded transition-colors ${
                                message.helpful === false ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
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
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input */}
          {!isBookingModalOpen && !isMinimized && (
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="max-w-4xl mx-auto">
                {/* Quick Action Buttons */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickAction('pricing')}
                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    💰 {currentLanguage.code === 'sv' ? 'Priser' : 'Pricing'}
                  </button>
                  <button
                    onClick={() => handleQuickAction('website')}
                    className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                  >
                    🌐 {currentLanguage.code === 'sv' ? 'Webbplats' : 'Website'}
                  </button>
                  <button
                    onClick={() => handleQuickAction('ecommerce')}
                    className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    🛒 {currentLanguage.code === 'sv' ? 'E-handel' : 'E-commerce'}
                  </button>
                </div>
                
                {/* Booking Button */}
                <div className="mb-4">
                  <motion.button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calendar className="mr-3 group-hover:scale-110 transition-transform" size={24} />
                    <span>{currentLanguage.code === 'sv' ? 'Boka Tid' : 'Book Time'}</span>
                    <Sparkles className="ml-3 group-hover:scale-110 transition-transform animate-pulse" size={24} />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentLanguage.code === 'sv' ? 'Skriv ditt meddelande...' : 'Type your message...'}
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    disabled={isTyping}
                    maxLength={500}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg touch-manipulation"
                  >
                    <Send size={20} />
                  </button>
                </div>
                
                {/* Quick actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setInputText(currentLanguage.code === 'sv' ? 'Vad kostar en webbplats?' : 'How much does a website cost?')}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    💰 {currentLanguage.code === 'sv' ? 'Priser' : 'Pricing'}
                  </button>
                  <button
                    onClick={() => setInputText(currentLanguage.code === 'sv' ? 'Berätta om era bokningssystem' : 'Tell me about your booking systems')}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    📅 {currentLanguage.code === 'sv' ? 'Bokning' : 'Booking'}
                  </button>
                  <button
                    onClick={() => setInputText(currentLanguage.code === 'sv' ? 'Jag vill ha en e-handel' : 'I want an e-commerce solution')}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    🛒 {currentLanguage.code === 'sv' ? 'E-handel' : 'E-commerce'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Booking Modal */}
          <AnimatePresence>
            {isBookingModalOpen && (
              <motion.div
                className="absolute inset-0 bg-white flex flex-col z-50"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Booking Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex-shrink-0 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Calendar className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          {currentLanguage.code === 'sv' ? 'Boka Konsultation' : 'Book Consultation'}
                        </h2>
                        <p className="text-white/90 text-sm">
                          {currentLanguage.code === 'sv' ? 'Välj en tid som passar dig' : 'Choose a time that suits you'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCloseBooking}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center backdrop-blur-sm"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                  
                  {/* Features */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white border border-white/30">
                      <Clock size={12} />
                      <span>{currentLanguage.code === 'sv' ? '30-60 min' : '30-60 min'}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white border border-white/30">
                      <Sparkles size={12} />
                      <span>{currentLanguage.code === 'sv' ? 'Kostnadsfritt' : 'Free'}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white border border-white/30">
                      <Brain size={12} />
                      <span>{currentLanguage.code === 'sv' ? 'AI-expert Stefan' : 'AI expert Stefan'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Booking Content */}
                <div className="flex-1 bg-white overflow-hidden relative">
                  {/* Loading State */}
                  {isBookingLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 text-sm">
                          {currentLanguage.code === 'sv' ? 'Laddar bokningskalender...' : 'Loading booking calendar...'}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {currentLanguage.code === 'sv' ? 'Förbereder din bokningsupplevelse...' : 'Preparing your booking experience...'}
                        </p>
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
                      minHeight: '400px',
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