import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap, Brain, Calendar, Shield, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { findBestMatch, fallbackResponses, logInteraction, recognizeIntent } from '../data/aiKnowledge';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
  intent?: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, onOpenBooking }) => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected] = useState(true);
  const [sessionStats, setSessionStats] = useState({ messages: 0, helpfulResponses: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with intelligent welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: currentLanguage.code === 'sv' 
          ? '👋 **Hej! Jag är Axie AI** - Sveriges mest avancerade AI-assistent för digitala lösningar! 🤖\n\n✨ **Jag är tränad på allt innehåll från Axie Studio och kan hjälpa dig med:**\n\n🌐 **AI-drivna webbplatser** - Från 8 995 kr\n📅 **Intelligenta bokningssystem** - Från 10 995 kr\n🛒 **E-handelslösningar** - Från 10 995 kr\n📱 **Mobilappar** - Ingår i komplett-paketet\n\n🚀 **Specialfunktioner:**\n• Fungerar helt offline (lokal AI)\n• Säker och privat\n• Baserad på verkligt innehåll\n• Intelligent säkerhetsfiltrering\n\n💡 **Fråga mig om priser, funktioner, eller säg "boka tid" för kostnadsfri konsultation!**\n\n🎯 **Vad kan jag hjälpa dig med idag?**'
          : '👋 **Hi! I\'m Axie AI** - Sweden\'s most advanced AI assistant for digital solutions! 🤖\n\n✨ **I\'m trained on all content from Axie Studio and can help you with:**\n\n🌐 **AI-powered websites** - From 8,995 SEK\n📅 **Intelligent booking systems** - From 10,995 SEK\n🛒 **E-commerce solutions** - From 10,995 SEK\n📱 **Mobile apps** - Included in complete package\n\n🚀 **Special features:**\n• Works completely offline (local AI)\n• Secure and private\n• Based on real content\n• Intelligent security filtering\n\n💡 **Ask me about pricing, features, or say "book time" for free consultation!**\n\n🎯 **How can I help you today?**',
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLanguage.code]);

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Advanced AI response function with security and intelligence
  const getAdvancedAIResponse = async (userMessage: string): Promise<{ response: string; intent: string }> => {
    // Realistic thinking time based on message complexity
    const thinkingTime = Math.min(800 + (userMessage.length * 20) + Math.random() * 1200, 3000);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    const language = currentLanguage.code as 'sv' | 'en';
    const intent = recognizeIntent(userMessage);
    
    // Try to find a match in our advanced knowledge base
    const response = findBestMatch(userMessage, language);
    
    if (response) {
      return { response, intent };
    }

    // Check for booking intent with advanced pattern matching
    const bookingPatterns = [
      /\b(boka|book|konsultation|consultation|träffa|meet|tid|time|möte|meeting|demo)\b/i,
      /\b(när kan|when can|ledig tid|available time|schema|schedule)\b/i,
      /\b(kostnadsfri|free|gratis|consultation)\b/i
    ];
    
    const hasBookingIntent = bookingPatterns.some(pattern => pattern.test(userMessage));

    if (hasBookingIntent) {
      // Trigger booking modal after response
      setTimeout(() => {
        if (onOpenBooking) {
          onOpenBooking();
        }
      }, 2500);

      const bookingResponse = language === 'sv'
        ? '📅 **Perfekt! Låt oss boka en kostnadsfri konsultation.**\n\n🎯 **Vad vi går igenom:**\n• Dina specifika behov och mål\n• Vilken AI-lösning som passar bäst\n• Tidsplan och implementation\n• Kostnadsfri expertråd från Stefan\n\n⏰ **Konsultationen:**\n• 30-60 minuter\n• Helt kostnadsfri\n• Fysiskt i Jönköping eller digitalt\n• Inga förpliktelser\n\n✨ **Jag öppnar vårt smarta bokningssystem för dig om ett ögonblick...**\n\n☕ Vi ser fram emot att träffa dig och diskutera hur AI kan transformera ditt företag!'
        : '📅 **Perfect! Let\'s book a free consultation.**\n\n🎯 **What we\'ll cover:**\n• Your specific needs and goals\n• Which AI solution fits best\n• Timeline and implementation\n• Free expert advice from Stefan\n\n⏰ **The consultation:**\n• 30-60 minutes\n• Completely free\n• In-person in Jönköping or digital\n• No obligations\n\n✨ **I\'m opening our smart booking system for you in a moment...**\n\n☕ We look forward to meeting you and discussing how AI can transform your business!';

      return { response: bookingResponse, intent: 'booking_request' };
    }

    // Advanced fallback with context awareness
    const fallbacks = fallbackResponses[language];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    const contextualFallback = `${randomFallback}\n\n📞 **Eller vill du prata direkt med en expert?**\n• Boka kostnadsfri konsultation\n• Ring Stefan: +46 735 132 620\n• Email: stefan@axiestudio.se`;
    
    return { response: contextualFallback, intent: 'general_inquiry' };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Update session stats
    setSessionStats(prev => ({ ...prev, messages: prev.messages + 1 }));

    // Track interaction locally with privacy
    try {
      const interactionData = {
        message: userMessage.text.substring(0, 50), // Limited for privacy
        timestamp: new Date().toISOString(),
        language: currentLanguage.code,
        sessionId: sessionStorage.getItem('axie-ai-session') || 'anonymous'
      };
      
      localStorage.setItem('axie-ai-last-interaction', JSON.stringify(interactionData));
    } catch (error) {
      console.log('Could not save interaction to localStorage');
    }

    try {
      const { response: aiResponseText, intent } = await getAdvancedAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date(),
        intent
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Log interaction for learning
      logInteraction(userMessage.text, aiResponseText, currentLanguage.code, intent);
      
      // Update helpful responses counter
      setSessionStats(prev => ({ ...prev, helpfulResponses: prev.helpfulResponses + 1 }));

      // Track AI interaction globally if available
      if (typeof window !== 'undefined' && window.trackAIInteraction) {
        window.trackAIInteraction('ai_response_generated', 'AI Assistant');
      }

    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage.code === 'sv' 
          ? '😅 **Tekniskt fel upptäckt!**\n\nMen oroa dig inte - jag är en lokal AI som fungerar utan internet. Detta är bara en tillfällig hicka.\n\n🔧 **Vad du kan göra:**\n• Försök igen om ett ögonblick\n• Kontakta vårt team direkt: stefan@axiestudio.se\n• Ring: +46 735 132 620\n\n🤖 **Jag är tillbaka om några sekunder!**'
          : '😅 **Technical error detected!**\n\nBut don\'t worry - I\'m a local AI that works without internet. This is just a temporary hiccup.\n\n🔧 **What you can do:**\n• Try again in a moment\n• Contact our team directly: stefan@axiestudio.se\n• Call: +46 735 132 620\n\n🤖 **I\'ll be back in a few seconds!**',
        isBot: true,
        timestamp: new Date(),
        intent: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    const quickActions = {
      pricing: currentLanguage.code === 'sv' ? 'Vad kostar era AI-lösningar?' : 'What do your AI solutions cost?',
      booking: currentLanguage.code === 'sv' ? 'Berätta om intelligenta bokningssystem' : 'Tell me about intelligent booking systems',
      consultation: currentLanguage.code === 'sv' ? 'Boka kostnadsfri konsultation' : 'Book free consultation',
      ai: currentLanguage.code === 'sv' ? 'Vilka AI-funktioner erbjuder ni?' : 'What AI features do you offer?',
      ecommerce: currentLanguage.code === 'sv' ? 'Hur fungerar er AI-drivna e-handel?' : 'How does your AI-driven e-commerce work?'
    };
    
    setInputText(quickActions[action as keyof typeof quickActions] || '');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl h-[90vh] sm:h-[85vh] md:h-[80vh] lg:h-[700px] flex flex-col overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 sm:p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-full">
                  <Brain className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base lg:text-lg flex items-center">
                    Axie AI
                    <Star className="ml-1 sm:ml-2 text-yellow-300" size={12} />
                  </h3>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs opacity-90">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="hidden sm:inline">Lokal AI • Säker & Privat</span>
                    <span className="sm:hidden">Lokal AI</span>
                    <Shield size={12} className="text-green-300" />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full hidden sm:block">
                  {sessionStats.messages} meddelanden
                </div>
                <button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 p-1.5 sm:p-2 rounded-full transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <div className={`flex items-start space-x-1 sm:space-x-2 max-w-[90%] sm:max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                    message.isBot 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}>
                    {message.isBot ? (
                      <Brain size={12} className="text-white" />
                    ) : (
                      <User size={12} className="text-white" />
                    )}
                  </div>
                  <div className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg ${
                    message.isBot 
                      ? 'bg-white border border-gray-200 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {message.text.split('**').map((part, index) => 
                        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <p className={`text-xs ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.isBot && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 hidden sm:flex">
                          <Shield size={10} />
                          <span>Säker AI</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Enhanced Typing indicator */}
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                    <Brain size={12} className="text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-gray-500">AI tänker...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Actions */}
          <div className="px-2 sm:px-3 lg:px-4 py-2 bg-gray-100 border-t border-gray-200 flex-shrink-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button
                onClick={() => handleQuickAction('pricing')}
                className="text-xs bg-white border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center touch-manipulation"
              >
                💰 {currentLanguage.code === 'sv' ? 'Priser' : 'Pricing'}
              </button>
              <button
                onClick={() => handleQuickAction('ai')}
                className="text-xs bg-white border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center touch-manipulation"
              >
                🤖 {currentLanguage.code === 'sv' ? 'AI-funktioner' : 'AI Features'}
              </button>
              <button
                onClick={() => handleQuickAction('consultation')}
                className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:from-green-600 hover:to-emerald-600 transition-colors flex items-center touch-manipulation"
              >
                <Calendar size={12} className="mr-1" />
                {currentLanguage.code === 'sv' ? 'Boka tid' : 'Book time'}
              </button>
            </div>
          </div>

          {/* Enhanced Input */}
          <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentLanguage.code === 'sv' ? 'Skriv ditt meddelande...' : 'Type your message...'}
                className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                disabled={isTyping}
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-1 sm:mt-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield size={12} className="text-green-500" />
                <span className="hidden sm:inline">Lokal AI • Säker & Privat • Baserad på Axie Studio's innehåll</span>
                <span className="sm:hidden">Lokal AI • Säker</span>
              </div>
              <span>{inputText.length}/500</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;