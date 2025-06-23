import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import ServiceCard from './ServiceCard';
import { Sparkles, Crown, Star, Zap } from 'lucide-react';

const Services = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      title: t('services.website.title'),
      description: t('services.website.description'),
      startPrice: "8 995 kr",
      monthlyPrice: "495 kr",
      badge: t('services.website.badge'),
      gradient: "from-blue-500 to-cyan-500",
      features: [
        { name: t('services.website.features.0'), included: true },
        { name: t('services.website.features.1'), included: true },
        { name: t('services.website.features.2'), included: true },
        { name: t('services.website.features.3'), included: true },
        { name: t('services.website.features.4'), included: true },
        { name: t('services.website.features.5'), included: true },
        { name: t('services.website.features.6'), included: false },
        { name: t('services.website.features.7'), included: false }
      ]
    },
    {
      title: t('services.commerce.title'),
      description: t('services.commerce.description'),
      startPrice: "10 995 kr",
      monthlyPrice: "895 kr",
      badge: t('services.commerce.badge'),
      gradient: "from-emerald-500 to-teal-500",
      features: [
        { name: t('services.commerce.features.0'), included: true },
        { name: t('services.commerce.features.1'), included: true },
        { name: t('services.commerce.features.2'), included: true },
        { name: t('services.commerce.features.3'), included: true },
        { name: t('services.commerce.features.4'), included: true },
        { name: t('services.commerce.features.5'), included: true },
        { name: t('services.commerce.features.6'), included: true },
        { name: t('services.commerce.features.7'), included: true }
      ]
    },
    {
      title: t('services.booking.title'),
      description: t('services.booking.description'),
      startPrice: "10 995 kr",
      monthlyPrice: "995 kr",
      isPopular: true,
      badge: t('services.booking.badge'),
      gradient: "from-purple-500 to-pink-500",
      features: [
        { name: t('services.booking.features.0'), included: true },
        { name: t('services.booking.features.1'), included: true },
        { name: t('services.booking.features.2'), included: true },
        { name: t('services.booking.features.3'), included: true },
        { name: t('services.booking.features.4'), included: true },
        { name: t('services.booking.features.5'), included: true },
        { name: t('services.booking.features.6'), included: true },
        { name: t('services.booking.features.7'), included: true }
      ]
    },
    {
      title: t('services.complete.title'),
      description: t('services.complete.description'),
      startPrice: "14 995 kr",
      monthlyPrice: "1 495 kr",
      badge: t('services.complete.badge'),
      gradient: "from-orange-500 to-red-500",
      info: t('services.complete.info'),
      features: [
        { name: t('services.complete.features.0'), included: true },
        { name: t('services.complete.features.1'), included: true },
        { name: t('services.complete.features.2'), included: true },
        { name: t('services.complete.features.3'), included: true },
        { name: t('services.complete.features.4'), included: true },
        { name: t('services.complete.features.5'), included: true },
        { name: t('services.complete.features.6'), included: true },
        { name: t('services.complete.features.7'), included: true }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section id="services" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-floating-delayed" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-floating-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          ref={ref}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold mb-8 shadow-2xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Crown className="mr-2 animate-bounce" size={20} />
            {t('services.badge')}
            <Sparkles className="ml-2 animate-pulse" size={20} />
          </motion.div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            {t('services.title')}
          </h2>

          {/* Subtitle */}
          <motion.p 
            className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {t('services.subtitle')}
          </motion.p>

          {/* Trust indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
              <Star className="text-yellow-500 mr-2" size={16} />
              <span className="text-sm font-semibold text-gray-700">{t('hero.stats.customers', {}, '500+ Framgångsrika Projekt')}</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
              <Zap className="text-green-500 mr-2" size={16} />
              <span className="text-sm font-semibold text-gray-700">{t('hero.stats.uptime', {}, '99.9% Drifttid')}</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
              <Crown className="text-purple-500 mr-2" size={16} />
              <span className="text-sm font-semibold text-gray-700">{t('common.support247', {}, 'Branschledande')}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={cardVariants}>
              <ServiceCard
                {...service}
                buttonText={t('common.getStarted')}
                onContact={handleContact}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-16 sm:mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                {t('services.cta.title')}
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                {t('services.cta.description')}
              </p>
              
              <motion.button
                onClick={handleContact}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-glow-lg transition-all duration-500 transform hover:scale-105 text-lg"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center">
                  <Sparkles className="mr-2 animate-pulse" size={20} />
                  {t('services.cta.button')}
                  <Sparkles className="ml-2 animate-pulse" size={20} />
                </span>
              </motion.button>
            </div>
          </div>

          {/* Fine print */}
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center justify-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                * {t('services.fineprint.appStore')}
              </p>
              <p className="flex items-center justify-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                ** {t('services.fineprint.domain')}
              </p>
              <p className="flex items-center justify-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                {t('services.fineprint.vat')}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
                <span className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {t('common.freeConsultation')}
                </span>
                <span className="flex items-center text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {t('common.noCommitment')}
                </span>
                <span className="flex items-center text-purple-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  {t('common.support247')}
                </span>
                <span className="flex items-center text-orange-600">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  {t('common.fastDelivery')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;