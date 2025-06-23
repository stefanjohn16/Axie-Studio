import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Award, Users, Heart, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Simple Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center items-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-sm font-bold flex items-center shadow-lg">
              <Star className="mr-2" size={16} />
              {t('hero.badge')}
              <Sparkles className="ml-2 text-yellow-300" size={16} />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="block">{t('hero.title')}</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black">
              {t('hero.subtitle')}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-800 mb-12 max-w-5xl mx-auto leading-relaxed font-medium bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {t('hero.description')}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button 
              onClick={scrollToContact}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="mr-3" size={24} />
              {t('hero.cta1')}
              <ArrowRight className="ml-3" size={24} />
            </motion.button>
            
            <motion.button 
              onClick={scrollToServices}
              className="bg-white/90 backdrop-blur-sm border-2 border-blue-600/50 text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="mr-3" size={24} />
              {t('hero.cta2')}
            </motion.button>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 sm:mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-gray-900">{t('hero.stats.customers')}</h3>
              <p className="text-gray-700 leading-relaxed">Levererar precision, kvalitet och resultat — varje gång.</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-gray-900">99.9% {t('hero.stats.uptime')}</h3>
              <p className="text-gray-700 leading-relaxed">Pålitliga lösningar som alltid fungerar - din framgång är vår prioritet</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="text-white animate-pulse" size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-gray-900">{t('hero.stats.service')}</h3>
              <p className="text-gray-700 leading-relaxed">Vi bryr oss om dig och ditt företag - alltid här när du behöver oss</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;