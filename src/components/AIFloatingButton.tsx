import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Zap, Brain, Calendar, Shield, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AIChat from './AIChat';
import BookingModal from './BookingModal';

const AIFloatingButton: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show button after a delay with entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip after button appears
      setTimeout(() => setShowTooltip(true), 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Check if user has interacted before
  useEffect(() => {
    const hasUsedAI = localStorage.getItem('axie-ai-used');
    const lastInteraction = localStorage.getItem('axie-ai-last-interaction');
    
    setHasInteracted(!!hasUsedAI);
    
    // Stop pulsing after first interaction
    if (hasUsedAI) {
      setShowPulse(false);
      setShowTooltip(false);
    }
  }, []);

  // Auto-hide tooltip and pulse after time
  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);

    const pulseTimer = setTimeout(() => {
      setShowPulse(false);
    }, 15000);

    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(pulseTimer);
    };
  }, []);

  const handleOpenAIChat = () => {
    setIsAIChatOpen(true);
    setShowTooltip(false);
    
    if (!hasInteracted) {
      localStorage.setItem('axie-ai-used', 'true');
      localStorage.setItem('axie-ai-first-use', new Date().toISOString());
      setHasInteracted(true);
      setShowPulse(false);
    }

    // Track AI interaction
    if (typeof window !== 'undefined' && window.trackAIInteraction) {
      window.trackAIInteraction('ai_chat_opened', 'AI Assistant');
    }
  };

  const handleCloseAIChat = () => {
    setIsAIChatOpen(false);
  };

  const handleOpenBookingFromAI = () => {
    setIsAIChatOpen(false);
    setIsBookingModalOpen(true);
    
    // Track booking conversion from AI
    if (typeof window !== 'undefined' && window.trackAIInteraction) {
      window.trackAIInteraction('ai_to_booking_conversion', 'AI Assistant');
    }
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {!isAIChatOpen && !isBookingModalOpen && (
          <motion.div
            className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 z-40"
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Enhanced pulsing background effect */}
            {showPulse && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }} />
              </>
            )}
            
            {/* Main enhanced button */}
            <motion.button
              onClick={handleOpenAIChat}
              className="relative group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Enhanced floating elements */}
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-300 animate-pulse" />
              <Zap className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-green-300 animate-bounce" />
              <Star className="absolute top-0 left-0 w-2 h-2 sm:w-2 sm:h-2 lg:w-3 lg:h-3 text-pink-300 animate-ping" style={{ animationDelay: '1s' }} />
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:scale-110 transition-all duration-200" />
            </motion.button>

            {/* Enhanced tooltip */}
            <AnimatePresence>
              {showTooltip && !hasInteracted && (
                <motion.div
                  className="absolute bottom-full right-0 mb-2 sm:mb-3 bg-white text-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl text-xs sm:text-sm whitespace-nowrap max-w-[240px] sm:max-w-[280px] lg:max-w-none border border-gray-200"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain size={16} className="text-blue-500 flex-shrink-0" />
                    <span className="font-bold text-sm sm:text-base">
                      {currentLanguage.code === 'sv' ? 'Hej! Jag är Axie 🤖' : 'Hi! I\'m Axie 🤖'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Shield size={10} className="text-green-500" />
                      <span>
                        {currentLanguage.code === 'sv' ? 'Säker AI • Privat' : 'Secure AI • Private'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={10} className="text-yellow-500" />
                      <span>
                        {currentLanguage.code === 'sv' ? 'Tränad på allt vårt innehåll' : 'Trained on all our content'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Sparkles size={10} className="text-purple-500" />
                      <span>
                        {currentLanguage.code === 'sv' ? 'Intelligent assistent' : 'Intelligent assistant'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs font-medium text-blue-600 hidden sm:block">
                    {currentLanguage.code === 'sv' ? 'Klicka för att chatta!' : 'Click to chat!'}
                  </div>
                  
                  {/* Tooltip arrow */}
                  <div className="absolute top-full right-3 sm:right-4 w-0 h-0 border-l-3 border-r-3 border-t-3 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-transparent border-t-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced notification badge */}
            <motion.div
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 lg:-top-3 lg:-right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex items-center justify-center font-bold shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <span className="text-[8px] sm:text-[10px] lg:text-xs">AI</span>
            </motion.div>

            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-1 -left-1 bg-green-500 rounded-full w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 border-2 border-white shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Modal */}
      <AIChat 
        isOpen={isAIChatOpen} 
        onClose={handleCloseAIChat}
      />

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={handleCloseBooking} 
      />
    </>
  );
};

export default AIFloatingButton;