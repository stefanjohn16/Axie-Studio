import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Zap, Brain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AIChat from './AIChat';

const AIFloatingButton: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

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
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasInteracted) {
      localStorage.setItem('axie-ai-used', 'true');
      setHasInteracted(true);
    }

    // Track AI interaction
    if (typeof window !== 'undefined' && window.trackAIInteraction) {
      window.trackAIInteraction('ai_chat_opened');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Pulsing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20" />
            
            {/* Main button */}
            <motion.button
              onClick={handleOpen}
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-glow-lg transition-all duration-300 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center">
                <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Floating sparkles */}
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
              <Zap className="absolute -bottom-1 -left-1 w-3 h-3 text-green-300 animate-bounce" />
            </motion.button>

            {/* Tooltip */}
            {!hasInteracted && (
              <motion.div
                className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center space-x-2">
                  <Brain size={16} className="text-blue-500" />
                  <span className="font-medium">
                    {currentLanguage.code === 'sv' ? 'Fråga Axie AI!' : 'Ask Axie AI!'}
                  </span>
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
              </motion.div>
            )}

            {/* Notification badge */}
            <motion.div
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
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
      <AIChat isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default AIFloatingButton;