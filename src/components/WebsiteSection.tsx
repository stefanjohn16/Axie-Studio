import React from 'react';
import { Code, Zap, Search, Smartphone, Shield, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const WebsiteSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Code,
      title: t('websites.features.design.title'),
      description: t('websites.features.design.description')
    },
    {
      icon: Zap,
      title: t('websites.features.speed.title'),
      description: t('websites.features.speed.description')
    },
    {
      icon: Search,
      title: t('websites.features.seo.title'),
      description: t('websites.features.seo.description')
    },
    {
      icon: Smartphone,
      title: t('websites.features.mobile.title'),
      description: t('websites.features.mobile.description')
    },
    {
      icon: Shield,
      title: t('websites.features.security.title'),
      description: t('websites.features.security.description')
    },
    {
      icon: BarChart3,
      title: t('websites.features.analytics.title'),
      description: t('websites.features.analytics.description')
    }
  ];

  return (
    <section id="websites" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-4 sm:px-6 py-2 rounded-full text-blue-700 font-semibold mb-4 text-sm sm:text-base">
            <Code className="mr-2" size={20} />
            {t('websites.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('websites.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('websites.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full translate-y-12 sm:translate-y-24 -translate-x-12 sm:-translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                  {t('websites.cta.title')}
                </h3>
                <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                  {t('websites.cta.description')}
                </p>
                <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                  {Array.isArray(t('websites.cta.features')) && t('websites.cta.features').map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                  <div className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-2">
                    {t('websites.cta.deliveryTime')}
                  </div>
                  <p className="text-gray-300 mb-6 text-sm sm:text-base">{t('websites.cta.deliveryText')}</p>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
                  >
                    {t('websites.cta.button')} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteSection;