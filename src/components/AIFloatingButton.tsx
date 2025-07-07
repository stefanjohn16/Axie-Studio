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
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Enhanced pulsing background effect */}
            {showPulse && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }} />
              </div>
            )}
            
            {/* Main enhanced button */}
            <motion.button
              onClick={handleOpenAIChat}
              className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative z-10">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </motion.button>

            {/* Enhanced tooltip */}
            <AnimatePresence>
              {showTooltip && !hasInteracted && (
                <motion.div
                  className="absolute bottom-full right-0 mb-3 bg-white text-gray-800 px-4 py-3 rounded-xl shadow-lg text-sm whitespace-nowrap max-w-[200px] border border-gray-200"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 mb-1">
                      {currentLanguage.code === 'sv' ? 'Hej! Jag är Axie' : 'Hi! I\'m Axie'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {currentLanguage.code === 'sv' ? 'Klicka för att chatta!' : 'Click to chat!'}
                    </p>
                  </div>
                  
                  {/* Tooltip arrow */}
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced notification badge */}
            <motion.div
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <span className="text-[10px]">AI</span>
            </motion.div>

            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-1 -left-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 300 }}
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