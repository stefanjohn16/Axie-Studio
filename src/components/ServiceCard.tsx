import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Info, Sparkles, Zap, Crown, Star } from 'lucide-react';

interface Feature {
  name: string;
  included: boolean;
  info?: string;
}

interface ServiceCardProps {
  title: string;
  description: string;
  startPrice: string;
  monthlyPrice: string;
  setupPrice?: string;
  features: Feature[];
  isPopular?: boolean;
  badge?: string;
  gradient?: string;
  buttonText?: string;
  onContact: () => void;
  info?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  startPrice,
  monthlyPrice,
  features,
  isPopular = false,
  badge,
  gradient = "from-blue-500 to-purple-500",
  buttonText = "Kom igång",
  onContact,
  info
}) => {
  return (
    <motion.div 
      className={`relative h-full flex flex-col overflow-hidden rounded-3xl shadow-lg transition-all duration-500 bg-white hover:shadow-xl ${
        isPopular ? 'ring-4 ring-blue-500/20 scale-105' : ''
      }`}
      whileHover={{ y: isPopular ? -8 : -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
        <div className="flex justify-between items-start mb-4">
          {badge && (
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <Star className="mr-1" size={12} />
              {badge}
            </span>
          )}
          
          {isPopular && (
            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <Crown className="mr-1" size={12} />
              POPULÄRAST
            </div>
          )}
        </div>

        <h3 className="text-2xl font-black mb-2 flex items-center">
          {title}
          {isPopular && <span className="ml-2 text-yellow-300">✨</span>}
        </h3>
        
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline mb-2">
            <span className={`text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {startPrice}
            </span>
            <span className="text-gray-500 ml-2 text-sm font-medium">Startavgift</span>
          </div>
          <div className="flex items-baseline mb-3">
            <span className="text-2xl font-bold text-gray-800">{monthlyPrice}</span>
          </div>
          
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 rounded-xl p-3 text-center`}>
            <p className="text-xs font-semibold text-gray-700">
              💡 Inga bindningstider • Avsluta när som helst
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex-1 mb-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <Sparkles className="mr-2 text-blue-500" size={16} />
            Vad ingår:
          </h4>
          
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  {feature.included ? (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 shadow-lg">
                      <Check className="text-white" size={12} />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-full p-1">
                      <X className="text-white" size={12} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    feature.included ? 'text-gray-800' : 'text-gray-400 line-through'
                  }`}>
                    {feature.name}
                  </span>
                  {feature.info && (
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                      <div className="flex items-start">
                        <Info className="text-amber-600 mr-2 flex-shrink-0 mt-0.5" size={12} />
                        <span className="text-xs text-amber-800 leading-relaxed">{feature.info}</span>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          
          {/* Service-specific info */}
          {info && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start">
                <Info className="text-amber-600 mr-2 flex-shrink-0 mt-0.5" size={14} />
                <span className="text-xs text-amber-800 leading-relaxed">{info}</span>
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={onContact}
          className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 text-base shadow-lg ${
            isPopular
              ? `bg-gradient-to-r ${gradient} text-white hover:shadow-xl`
              : `border-2 border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:${gradient} hover:text-white hover:border-transparent`
          }`}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center">
            <Zap className="mr-2" size={18} />
            {buttonText}
            <Sparkles className="ml-2" size={18} />
          </span>
        </motion.button>

        {/* Trust badge */}
        <div className="mt-4 text-center">
          <span className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10`}>
            ✨ Kostnadsfri konsultation ingår alltid
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;