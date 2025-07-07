import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Brain, Calendar, Clock, Sparkles } from 'lucide-react';
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
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with simple welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: currentLanguage.code === 'sv' 
          ? 'Hej! Jag är Axie. Hur kan jag hjälpa dig idag?'
          : 'Hi! I\'m Axie. How can I help you today?',
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome'
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

  // AI response function
  const getAIResponse = async (userMessage: string): Promise<{ response: string; intent: string }> => {
    const thinkingTime = Math.min(500 + (userMessage.length * 15), 2000);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    const language = currentLanguage.code as 'sv' | 'en';
    const intent = recognizeIntent(userMessage);
    
    const response = findBestMatch(userMessage, language);
    
    if (response) {
      return { response, intent };
    }

    // Check for booking intent
    const bookingPatterns = [
      /\b(boka|book|konsultation|consultation|träffa|meet|tid|time|möte|meeting)\b/i,
    ];
    
    const hasBookingIntent = bookingPatterns.some(pattern => pattern.test(userMessage));

    if (hasBookingIntent) {
      // Open booking modal directly in chat after response
      setTimeout(() => {
        setIsBookingModalOpen(true);
      }, 1500);

      const bookingResponse = language === 'sv'
        ? 'Perfekt! Jag öppnar vårt bokningssystem för dig direkt här i chatten...'
        : 'Perfect! I\'m opening our booking system for you right here in the chat...';

      return { response: bookingResponse, intent: 'booking_request' };
    }

    // Simple fallback
    const fallbacks = fallbackResponses[language];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return { response: randomFallback, intent: 'general_inquiry' };
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

    try {
      const { response: aiResponseText, intent } = await getAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date(),
        intent
      };

      setMessages(prev => [...prev, aiMessage]);
      logInteraction(userMessage.text, aiResponseText, currentLanguage.code, intent);

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

  const handleIframeLoad = () => {
    setIsBookingLoading(false);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setIsBookingLoading(true);
    
    // Add a confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      text: currentLanguage.code === 'sv' 
        ? 'Tack för att du tittade på bokningssystemet! Säg bara "boka tid" igen om du vill boka senare. Vad kan jag hjälpa dig med nu?'
        : 'Thanks for checking out the booking system! Just say "book time" again if you want to book later. What can I help you with now?',
      isBot: true,
      timestamp: new Date(),
      intent: 'booking_closed'
    };
    
    setMessages(prev => [...prev, confirmMessage]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full h-full bg-white flex flex-col overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Minimal Header */}
          {!isBookingModalOpen && (
          <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0 shadow-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Brain className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Axie</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors touch-manipulation"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          )}

          {/* Messages - Minimal Design */}
          {!isBookingModalOpen && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 custom-scrollbar">
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
                        ? 'bg-blue-500' 
                        : 'bg-gray-400'
                    }`}>
                      {message.isBot ? (
                        <Bot size={16} className="text-white" />
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      message.isBot 
                        ? 'bg-white border border-gray-200 text-gray-800' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {message.text.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Minimal Typing indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start space-x-2">
                    <div className="p-2 rounded-full bg-blue-500">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          )}

          {/* Minimal Input */}
          {!isBookingModalOpen && (
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentLanguage.code === 'sv' ? 'Skriv ditt meddelande...' : 'Type your message...'}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isTyping}
                  maxLength={500}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm touch-manipulation"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Integrated Booking Modal */}
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