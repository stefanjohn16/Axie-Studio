import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { t, currentLanguage } = useLanguage();

  const sections = [
    {
      icon: Database,
      title: t('privacy.dataCollection.title'),
      content: t('privacy.dataCollection.content')
    },
    {
      icon: Lock,
      title: t('privacy.dataUsage.title'),
      content: t('privacy.dataUsage.content')
    },
    {
      icon: Shield,
      title: t('privacy.dataSecurity.title'),
      content: t('privacy.dataSecurity.content')
    },
    {
      icon: UserCheck,
      title: t('privacy.userRights.title'),
      content: t('privacy.userRights.content')
    },
    {
      icon: Eye,
      title: t('privacy.cookies.title'),
      content: t('privacy.cookies.content')
    },
    {
      icon: Globe,
      title: t('privacy.contact.title'),
      content: t('privacy.contact.content')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold mb-6 shadow-lg">
            <Shield className="mr-2" size={20} />
            {t('privacy.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {t('privacy.title')}
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('privacy.subtitle')}
          </p>
          
          <div className="mt-6 text-sm text-gray-500">
            {t('privacy.lastUpdated')}: {currentLanguage.code === 'sv' ? '27 januari 2025' : 'January 27, 2025'}
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link
            to={`/${currentLanguage.code}/`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            {t('common.backToHome')}
          </Link>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <section.icon className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="prose prose-gray max-w-none">
                {Array.isArray(section.content) ? (
                  <div className="space-y-4">
                    {section.content.map((paragraph: string, pIndex: number) => (
                      <p key={pIndex} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-4">{t('privacy.cta.title')}</h3>
          <p className="text-lg mb-6 opacity-90">
            {t('privacy.cta.description')}
          </p>
          <Link
            to={`/${currentLanguage.code}/#contact`}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            {t('privacy.cta.button')} →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;