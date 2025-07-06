import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap, Brain, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { findBestMatch, fallbackResponses } from '../data/aiKnowledge';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
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
  const [isConnected] = useState(true); // Always connected since it's local
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: currentLanguage.code === 'sv' 
          ? '👋 **Hej! Jag är Axie AI** 🤖\n\nJag kan hjälpa dig med frågor om våra AI-drivna lösningar:\n\n🌐 **Webbplatser** - Från 8 995 kr\n📅 **Bokningssystem** - Från 10 995 kr\n🛒 **E-handel** - Från 10 995 kr\n📱 **Mobilappar** - Ingår i komplett-paketet\n\n💡 Fråga mig om priser, funktioner eller vad som helst!\n\n✨ Vad kan jag hjälpa dig med?'
          : '👋 **Hi! I\'m Axie AI** 🤖\n\nI can help you with questions about our AI-powered solutions:\n\n🌐 **Websites** - From 8,995 SEK\n📅 **Booking Systems** - From 10,995 SEK\n🛒 **E-commerce** - From 10,995 SEK\n📱 **Mobile Apps** - Included in complete package\n\n💡 Ask me about pricing, features, or anything!\n\n✨ How can I help you?',
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLanguage.code]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Local AI response function
  const getLocalAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));

    const language = currentLanguage.code as 'sv' | 'en';
    
    // Try to find a match in our knowledge base
    const response = findBestMatch(userMessage, language);
    
    if (response) {
      return response;
    }

    // Check if user is asking for booking/consultation
    const bookingKeywords = ['boka', 'book', 'konsultation', 'consultation', 'träffa', 'meet', 'tid', 'time', 'möte', 'meeting'];
    const hasBookingIntent = bookingKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasBookingIntent) {
      // Trigger booking modal after response
      setTimeout(() => {
        if (onOpenBooking) {
          onOpenBooking();
        }
      }, 2000);

      return language === 'sv'
        ? '📅 **Perfekt! Låt oss boka en tid.**\n\nJag öppnar vårt bokningssystem för dig så kan du välja en tid som passar. Konsultationen är kostnadsfri och tar 30-60 minuter.\n\n☕ Vi kan träffas fysiskt i Jönköping eller digitalt via video!\n\n✨ Bokningskalendern öppnas om ett ögonblick...'
        : '📅 **Perfect! Let\'s book a time.**\n\nI\'ll open our booking system for you so you can choose a time that suits you. The consultation is free and takes 30-60 minutes.\n\n☕ We can meet in person in Jönköping or digitally via video!\n\n✨ The booking calendar will open in a moment...';
    }

    // Return a random fallback response
    const fallbacks = fallbackResponses[language];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return `${randomFallback}\n\n📞 **Eller vill du boka en kostnadsfri konsultation?** Säg bara "boka tid" så hjälper jag dig!`;
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

    // Track AI interaction locally
    try {
      localStorage.setItem('axie-ai-last-interaction', JSON.stringify({
        message: userMessage.text,
        timestamp: new Date().toISOString(),
        language: currentLanguage.code
      }));
    } catch (error) {
      console.log('Could not save interaction to localStorage');
    }

    try {
      const aiResponseText = await getLocalAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage.code === 'sv' 
          ? '😅 Oj, något gick fel! Men oroa dig inte - jag fungerar helt lokalt utan internet. Försök igen eller kontakta vårt team direkt på stefan@axiestudio.se!'
          : '😅 Oops, something went wrong! But don\'t worry - I work completely locally without internet. Try again or contact our team directly at stefan@axiestudio.se!',
        isBot: true,
        timestamp: new Date()
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] sm:h-[600px] flex flex-col overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Brain className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Axie AI</h3>
                  <div className="flex items-center space-x-2 text-sm opacity-90">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Lokal AI • Fungerar offline</span>
                    <Sparkles size={12} className="animate-pulse" />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`p-2 rounded-full flex-shrink-0 ${message.isBot ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`}>
                    {message.isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-white border border-gray-200 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {message.text.split('**').map((part, index) => 
                        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 sm:px-4 py-2 bg-gray-100 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInputText(currentLanguage.code === 'sv' ? 'Vad kostar en webbplats?' : 'What does a website cost?')}
                className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                💰 {currentLanguage.code === 'sv' ? 'Priser' : 'Pricing'}
              </button>
              <button
                onClick={() => setInputText(currentLanguage.code === 'sv' ? 'Berätta om bokningssystem' : 'Tell me about booking systems')}
                className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                📅 {currentLanguage.code === 'sv' ? 'Bokning' : 'Booking'}
              </button>
              <button
                onClick={() => setInputText(currentLanguage.code === 'sv' ? 'Boka konsultation' : 'Book consultation')}
                className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full hover:from-green-600 hover:to-emerald-600 transition-colors"
              >
                <Calendar size={12} className="inline mr-1" />
                {currentLanguage.code === 'sv' ? 'Boka tid' : 'Book time'}
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentLanguage.code === 'sv' ? 'Skriv ditt meddelande...' : 'Type your message...'}
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              🤖 Lokal AI • Fungerar utan internet • Baserad på Axie Studio's innehåll
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;