import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { findBestMatch, recognizeIntent, logInteraction } from '../data/aiKnowledge';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  intent?: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: currentLanguage.code === 'sv' 
          ? 'Hej! Jag är Axie från Axie Studio. Hur kan jag hjälpa dig idag?'
          : 'Hi! I\'m Axie from Axie Studio. How can I help you today?',
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLanguage.code]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const thinkingTime = Math.min(800 + (userMessage.length * 20), 2500);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    const language = currentLanguage.code as 'sv' | 'en';
    const response = findBestMatch(userMessage, language);
    
    if (response) {
      return response;
    }

    // Simple fallback
    return language === 'sv'
      ? 'Tack för din fråga! Jag kan hjälpa dig med information om våra digitala lösningar. Vad är du mest intresserad av?'
      : 'Thanks for your question! I can help you with information about our digital solutions. What are you most interested in?';
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
      const aiResponseText = await getAIResponse(userMessage.text);
      const intent = recognizeIntent(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date(),
        intent
      };

      setMessages(prev => [...prev, aiMessage]);
      logInteraction(userMessage.text, aiResponseText, currentLanguage.code, intent);

    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage.code === 'sv' 
          ? 'Något gick fel. Kontakta oss på stefan@axiestudio.se'
          : 'Something went wrong. Contact us at stefan@axiestudio.se',
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

  const handleIframeLoad = () => {
    setIsBookingLoading(false);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setIsBookingLoading(true);
    onClose();
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
          style={{ backgroundColor: 'white', colorScheme: 'light only' }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Clean Header */}
          {!isBookingModalOpen && (
            <div className="bg-white border-b border-gray-100 p-4 flex-shrink-0">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Axie</h3>
                    <p className="text-sm text-gray-500">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          {!isBookingModalOpen && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isBot ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        {message.isBot ? (
                          <Bot size={16} className="text-white" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
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
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
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

          {/* Input Area */}
          {!isBookingModalOpen && (
            <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="max-w-4xl mx-auto">
                {/* Boka Button - Prominent */}
                <div className="mb-4">
                  <motion.button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calendar className="mr-3 group-hover:scale-110 transition-transform" size={24} />
                    <span>{currentLanguage.code === 'sv' ? 'Boka Kostnadsfri Konsultation' : 'Book Free Consultation'}</span>
                    <Sparkles className="ml-3 group-hover:scale-110 transition-transform" size={24} />
                  </motion.button>
                </div>
                
                {/* Message Input */}
                <div className="flex items-center space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentLanguage.code === 'sv' ? 'Skriv ditt meddelande...' : 'Type your message...'}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isTyping}
                    maxLength={500}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
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
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex-shrink-0">
                  <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Calendar className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          {currentLanguage.code === 'sv' ? 'Boka Konsultation' : 'Book Consultation'}
                        </h2>
                        <p className="text-white/90 text-sm">
                          {currentLanguage.code === 'sv' ? 'Kostnadsfritt • 30-60 min' : 'Free • 30-60 min'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCloseBooking}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Booking Content */}
                <div className="flex-1 bg-white overflow-hidden relative">
                  {/* Loading */}
                  {isBookingLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-green-500 mb-4"></div>
                        <p className="text-gray-600">
                          {currentLanguage.code === 'sv' ? 'Laddar kalender...' : 'Loading calendar...'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Calendar */}
                  <iframe
                    src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0QR3uRxVB7rb4ZHqJ1qYmz-T0e2CFtV5MYekvGDq1qyWxsV_Av3nP3zEGk0DrH2HqpTLoXuK0h"
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    title={currentLanguage.code === 'sv' ? 'Boka konsultation' : 'Book consultation'}
                    style={{ minHeight: '400px', background: 'white' }}
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