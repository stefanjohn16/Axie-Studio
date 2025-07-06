import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative w-full max-w-4xl h-[95vh] sm:h-[90vh] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Minimal Header */}
              <div className="relative bg-gray-50 border-b border-gray-200 p-3 sm:p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">{t('bookingModal.title', {}, 'Boka konsultation')}</h2>
                      <p className="text-gray-600 text-xs sm:text-sm">{t('bookingModal.subtitle', {}, 'Välj en tid som passar dig')}</p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} className="text-gray-600" />
                  </motion.button>
                </div>
                
                {/* Compact Features */}
                <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                  <div className="flex items-center space-x-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-600 border">
                    <Clock size={12} />
                    <span>{t('bookingModal.features.duration', {}, '30-60 min')}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-600 border">
                    <Sparkles size={12} />
                    <span>{t('bookingModal.features.free', {}, 'Kostnadsfritt')}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-600 border">
                    <User size={12} />
                    <span>{t('bookingModal.features.personal', {}, 'Personlig service')}</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Content Area for Iframe */}
              <div className="relative flex-1 bg-white overflow-hidden">
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10 p-4">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                      <p className="text-gray-600 text-xs sm:text-sm">{t('bookingModal.loading', {}, 'Laddar bokningskalender...')}</p>
                    </div>
                  </div>
                )}
                
                {/* Google Calendar Iframe - Enhanced Focus */}
                <iframe
                  src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0QR3uRxVB7rb4ZHqJ1qYmz-T0e2CFtV5MYekvGDq1qyWxsV_Av3nP3zEGk0DrH2HqpTLoXuK0h"
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  title={t('bookingModal.iframeTitle', {}, 'Boka konsultation')}
                  style={{
                    minHeight: '400px',
                    background: 'white'
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;