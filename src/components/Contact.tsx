import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Heart, Coffee, Clock, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BookingModal from './BookingModal';

const Contact = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <section id="contact" className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-floating-delayed" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            ref={ref}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full text-purple-700 font-semibold mb-6 text-sm sm:text-base">
              <Heart className="mr-2 animate-pulse" size={16} />
              {t('contact.badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('contact.description')}
            </p>
          </motion.div>

          <motion.div 
            className="max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Email Contact */}
              <motion.div 
                className="text-center p-8 glass-card rounded-3xl shadow-2xl hover:shadow-glow-lg transition-all duration-500 border border-white/30 group"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Mail className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">{t('contact.email.title')}</h3>
                
                {/* Multiple Email Addresses */}
                <div className="space-y-3">
                  <div>
                    <a 
                      href="mailto:stefan@axiestudio.se" 
                      className="text-blue-600 hover:text-blue-700 transition-colors font-medium text-lg gradient-text-cosmic block"
                    >
                      stefan@axiestudio.se
                    </a>
                    <p className="text-gray-500 text-xs">{t('contact.email.addresses.0.label')}</p>
                  </div>
                  
                  <div>
                    <a 
                      href="mailto:support@axiestudio.se" 
                      className="text-blue-600 hover:text-blue-700 transition-colors font-medium text-lg gradient-text-cosmic block"
                    >
                      support@axiestudio.se
                    </a>
                    <p className="text-gray-500 text-xs">{t('contact.email.addresses.1.label')}</p>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mt-4">{t('contact.email.subtitle')}</p>
              </motion.div>
              
              {/* Phone Contact */}
              <motion.div 
                className="text-center p-8 glass-card rounded-3xl shadow-2xl hover:shadow-glow-lg transition-all duration-500 border border-white/30 group"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Phone className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">{t('contact.phone.title')}</h3>
                
                {/* Multiple Phone Numbers */}
                <div className="space-y-3">
                  <div>
                    <a 
                      href="tel:+46735132620" 
                      className="text-green-600 hover:text-green-700 transition-colors font-medium text-lg gradient-text-aurora block"
                    >
                      +46 735 132 620
                    </a>
                    <p className="text-gray-500 text-xs">{t('contact.phone.numbers.0.label')}</p>
                  </div>
                  
                  <div>
                    <a 
                      href="tel:+639625761387" 
                      className="text-green-600 hover:text-green-700 transition-colors font-medium text-lg gradient-text-aurora block"
                    >
                      +63 962 576 1387
                    </a>
                    <p className="text-gray-500 text-xs">{t('contact.phone.numbers.1.label')}</p>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mt-4">{t('contact.phone.subtitle')}</p>
              </motion.div>
              
              {/* Location Contact */}
              <motion.div 
                className="text-center p-8 glass-card rounded-3xl shadow-2xl hover:shadow-glow-lg transition-all duration-500 border border-white/30 group"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-xl">{t('contact.location.title')}</h3>
                <p className="text-purple-600 font-medium text-lg gradient-text-cosmic">{t('contact.location.address')}</p>
                <p className="text-gray-500 text-sm mt-2">{t('contact.location.subtitle')}</p>
              </motion.div>
            </div>

            <motion.div 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden"
              variants={itemVariants}
            >
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
                    <Coffee className="text-white" size={40} />
                  </div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                  {t('contact.consultation.title')}
                </h3>
                <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  {t('contact.consultation.description')}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center justify-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <Clock className="mr-2" size={20} />
                    <span className="text-sm font-medium">{t('contact.consultation.features.duration')}</span>
                  </div>
                  <div className="flex items-center justify-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <Heart className="mr-2 animate-pulse" size={20} />
                    <span className="text-sm font-medium">{t('contact.consultation.features.free')}</span>
                  </div>
                  <div className="flex items-center justify-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <Coffee className="mr-2" size={20} />
                    <span className="text-sm font-medium">{t('contact.consultation.features.atmosphere')}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="group relative overflow-hidden bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center shadow-2xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Calendar className="mr-2 group-hover:scale-110 transition-transform relative z-10" size={20} />
                    <span className="relative z-10">{t('contact.consultation.buttons.book')}</span>
                    <Sparkles className="ml-2 group-hover:scale-110 transition-transform relative z-10" size={20} />
                  </motion.button>
                  
                  <motion.a 
                    href="mailto:stefan@axiestudio.se"
                    className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                    {t('contact.consultation.buttons.email')}
                  </motion.a>
                  
                  <motion.a 
                    href="tel:+46735132620"
                    className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                    {t('contact.consultation.buttons.call')}
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </>
  );
};

export default Contact;