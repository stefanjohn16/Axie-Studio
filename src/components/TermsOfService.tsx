import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, AlertTriangle, CreditCard, Users, Gavel } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const { t, currentLanguage } = useLanguage();

  const sections = [
    {
      icon: FileText,
      title: t('terms.acceptance.title'),
      content: t('terms.acceptance.content')
    },
    {
      icon: Users,
      title: t('terms.services.title'),
      content: t('terms.services.content')
    },
    {
      icon: CreditCard,
      title: t('terms.payment.title'),
      content: t('terms.payment.content')
    },
    {
      icon: Scale,
      title: t('terms.userResponsibilities.title'),
      content: t('terms.userResponsibilities.content')
    },
    {
      icon: AlertTriangle,
      title: t('terms.limitations.title'),
      content: t('terms.limitations.content')
    },
    {
      icon: Gavel,
      title: t('terms.termination.title'),
      content: t('terms.termination.content')
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
          <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold mb-6 shadow-lg">
            <Scale className="mr-2" size={20} />
            {t('terms.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {t('terms.title')}
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('terms.subtitle')}
          </p>
          
          <div className="mt-6 text-sm text-gray-500">
            {t('terms.lastUpdated')}: {currentLanguage.code === 'sv' ? '27 januari 2025' : 'January 27, 2025'}
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
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
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
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
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
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-4">{t('terms.cta.title')}</h3>
          <p className="text-lg mb-6 opacity-90">
            {t('terms.cta.description')}
          </p>
          <Link
            to={`/${currentLanguage.code}/#contact`}
            className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            {t('terms.cta.button')} →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;