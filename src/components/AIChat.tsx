import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap, Brain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: currentLanguage.code === 'sv' 
          ? 'Hej! Jag är Axie AI, din digitala assistent. Jag kan hjälpa dig med frågor om våra AI-drivna lösningar, webbplatser, bokningssystem och e-handel. Vad kan jag hjälpa dig med idag? 🤖'
          : 'Hi! I\'m Axie AI, your digital assistant. I can help you with questions about our AI-powered solutions, websites, booking systems, and e-commerce. How can I help you today? 🤖',
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

  // Simulate AI responses
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const message = userMessage.toLowerCase();
    const isSwedish = currentLanguage.code === 'sv';

    // AI-powered responses based on keywords
    if (message.includes('pris') || message.includes('kostnad') || message.includes('price') || message.includes('cost')) {
      return isSwedish 
        ? '💰 Våra AI-drivna lösningar börjar från 8 995 kr för en intelligent webbplats med AI-chatbot. Bokningssystem med smart automatisering kostar från 10 995 kr. Vill du ha en kostnadsfri konsultation där vi kan diskutera dina specifika behov?'
        : '💰 Our AI-powered solutions start from 8,995 SEK for an intelligent website with AI chatbot. Booking systems with smart automation start from 10,995 SEK. Would you like a free consultation to discuss your specific needs?';
    }

    if (message.includes('ai') || message.includes('artificiell intelligens') || message.includes('machine learning')) {
      return isSwedish
        ? '🤖 Vi specialiserar oss på AI-drivna digitala lösningar! Våra tjänster inkluderar intelligenta chatbots, automatiserad marknadsföring, prediktiv analys, smart bokningshantering och personaliserade kundupplevelser. Vilken typ av AI-funktionalitet är du intresserad av?'
        : '🤖 We specialize in AI-powered digital solutions! Our services include intelligent chatbots, automated marketing, predictive analytics, smart booking management, and personalized customer experiences. What type of AI functionality are you interested in?';
    }

    if (message.includes('bokning') || message.includes('booking') || message.includes('tid') || message.includes('appointment')) {
      return isSwedish
        ? '📅 Vårt AI-drivna bokningssystem är perfekt för företag som vill automatisera sin schemaläggning! Det inkluderar intelligent konfliktdetektering, automatiska påminnelser, prediktiv resurshantering och smart kundkommunikation. Vilken typ av verksamhet driver du?'
        : '📅 Our AI-powered booking system is perfect for businesses wanting to automate their scheduling! It includes intelligent conflict detection, automatic reminders, predictive resource management, and smart customer communication. What type of business do you run?';
    }

    if (message.includes('webbplats') || message.includes('website') || message.includes('hemsida')) {
      return isSwedish
        ? '🌐 Vi skapar intelligenta webbplatser med AI-funktioner som chatbots, automatisk innehållsoptimering, personalisering och prediktiv analys. Våra webbplatser lär sig från besökarnas beteende och förbättras kontinuerligt. Vad för typ av webbplats behöver du?'
        : '🌐 We create intelligent websites with AI features like chatbots, automatic content optimization, personalization, and predictive analytics. Our websites learn from visitor behavior and continuously improve. What type of website do you need?';
    }

    if (message.includes('e-handel') || message.includes('webshop') || message.includes('ecommerce') || message.includes('shop')) {
      return isSwedish
        ? '🛒 Vår AI-drivna e-handelslösning inkluderar intelligenta produktrekommendationer, automatiserad marknadsföring, prediktiv lagerhantering och personaliserade kundupplevelser. Systemet optimerar försäljningen automatiskt baserat på kundbeteende. Vilka produkter säljer du?'
        : '🛒 Our AI-powered e-commerce solution includes intelligent product recommendations, automated marketing, predictive inventory management, and personalized customer experiences. The system automatically optimizes sales based on customer behavior. What products do you sell?';
    }

    if (message.includes('hej') || message.includes('hello') || message.includes('hi') || message.includes('tjena')) {
      return isSwedish
        ? '👋 Hej och välkommen! Jag är Axie AI och jag hjälper gärna till med frågor om våra AI-drivna digitala lösningar. Vi erbjuder intelligenta webbplatser, smarta bokningssystem och automatiserad e-handel. Vad kan jag hjälpa dig med?'
        : '👋 Hello and welcome! I\'m Axie AI and I\'m happy to help with questions about our AI-powered digital solutions. We offer intelligent websites, smart booking systems, and automated e-commerce. How can I help you?';
    }

    if (message.includes('tack') || message.includes('thank') || message.includes('thanks')) {
      return isSwedish
        ? '😊 Så kul att jag kunde hjälpa! Om du har fler frågor eller vill boka en kostnadsfri konsultation, säg bara till. Vi älskar att prata om AI och digitala lösningar!'
        : '😊 So glad I could help! If you have more questions or want to book a free consultation, just let me know. We love talking about AI and digital solutions!';
    }

    // Default AI response
    return isSwedish
      ? '🤔 Det är en intressant fråga! Som AI-assistent för Axie Studio kan jag hjälpa dig med information om våra intelligenta webbplatser, smarta bokningssystem och automatiserade e-handelslösningar. Kan du berätta mer specifikt vad du är intresserad av? Eller vill du boka en kostnadsfri konsultation med vårt team?'
      : '🤔 That\'s an interesting question! As an AI assistant for Axie Studio, I can help you with information about our intelligent websites, smart booking systems, and automated e-commerce solutions. Can you tell me more specifically what you\'re interested in? Or would you like to book a free consultation with our team?';
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

    // Track AI interaction
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'AI_INTERACTION',
        interaction: {
          userMessage: userMessage.text,
          timestamp: new Date().toISOString(),
          language: currentLanguage.code
        }
      });
    }

    try {
      const aiResponseText = await getAIResponse(userMessage.text);
      
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
          ? '😅 Oj, något gick fel med min AI-hjärna! Kan du försöka igen eller kontakta vårt team direkt på stefan@axiestudio.se?'
          : '😅 Oops, something went wrong with my AI brain! Can you try again or contact our team directly at stefan@axiestudio.se?',
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden"
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
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span>{isConnected ? 'Online' : 'Offline'}</span>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`p-2 rounded-full ${message.isBot ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`}>
                    {message.isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-white border border-gray-200 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
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

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentLanguage.code === 'sv' ? 'Skriv ditt meddelande...' : 'Type your message...'}
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              🤖 Powered by Axie AI • {currentLanguage.code === 'sv' ? 'Intelligent svar på svenska' : 'Intelligent responses in English'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;