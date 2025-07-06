import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Zap, Brain, Calendar } from 'lucide-react';
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

  // Show button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Check if user has interacted before
  useEffect(() => {
    const hasUsedAI = localStorage.getItem('axie-ai-used');
    setHasInteracted(!!hasUsedAI);
    
    // Stop pulsing after first interaction
    if (hasUsedAI) {
      setShowPulse(false);
    }
  }, []);

  // Stop pulsing after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenAIChat = () => {
    setIsAIChatOpen(true);
    if (!hasInteracted) {
      localStorage.setItem('axie-ai-used', 'true');
      setHasInteracted(true);
      setShowPulse(false);
    }

    // Track AI interaction
    if (typeof window !== 'undefined' && window.trackAIInteraction) {
      window.trackAIInteraction('ai_chat_opened');
    }
  };

  const handleCloseAIChat = () => {
    setIsAIChatOpen(false);
  };

  const handleOpenBookingFromAI = () => {
    setIsAIChatOpen(false);
    setIsBookingModalOpen(true);
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
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Pulsing background effect */}
            {showPulse && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20" />
            )}
            
            {/* Main button */}
            <motion.button
              onClick={handleOpenAIChat}
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-glow-lg transition-all duration-300 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Floating sparkles */}
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
              <Zap className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 text-green-300 animate-bounce" />
            </motion.button>

            {/* Tooltip */}
            {!hasInteracted && (
              <motion.div
                className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-xs sm:text-sm whitespace-nowrap max-w-[200px] sm:max-w-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center space-x-2">
                  <Brain size={14} className="text-blue-500 flex-shrink-0" />
                  <span className="font-medium">
                    {currentLanguage.code === 'sv' ? 'Fråga Axie AI!' : 'Ask Axie AI!'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentLanguage.code === 'sv' ? 'Lokal AI • Fungerar offline' : 'Local AI • Works offline'}
                </div>
                <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
              </motion.div>
            )}

            {/* Notification badge */}
            <motion.div
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              AI
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Modal */}
      <AIChat 
        isOpen={isAIChatOpen} 
        onClose={handleCloseAIChat}
        onOpenBooking={handleOpenBookingFromAI}
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