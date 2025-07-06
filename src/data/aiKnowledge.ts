// Local AI Knowledge Base - All content from Axie Studio website
export interface AIKnowledgeItem {
  keywords: string[];
  response: {
    sv: string;
    en: string;
  };
  category: string;
  confidence: number;
}

export const aiKnowledgeBase: AIKnowledgeItem[] = [
  // Pricing Information
  {
    keywords: ['pris', 'kostnad', 'price', 'cost', 'pricing', 'kostar', 'betala', 'avgift'],
    response: {
      sv: '💰 **Våra priser:**\n\n🌐 **Webbplats**: 8 995 kr startavgift + 495 kr/månad\n📅 **Bokningssystem**: 10 995 kr startavgift + 995 kr/månad\n🛒 **E-handel**: 10 995 kr startavgift + 895 kr/månad\n📱 **Komplett lösning**: 14 995 kr startavgift + 1 495 kr/månad\n\n✨ Alla paket inkluderar hosting, support och uppdateringar. Inga bindningstider!',
      en: '💰 **Our pricing:**\n\n🌐 **Website**: 8,995 SEK setup + 495 SEK/month\n📅 **Booking System**: 10,995 SEK setup + 995 SEK/month\n🛒 **E-commerce**: 10,995 SEK setup + 895 SEK/month\n📱 **Complete Solution**: 14,995 SEK setup + 1,495 SEK/month\n\n✨ All packages include hosting, support and updates. No commitments!'
    },
    category: 'pricing',
    confidence: 0.95
  },
  
  // Services Overview
  {
    keywords: ['tjänster', 'services', 'vad gör ni', 'what do you do', 'erbjuder', 'offer'],
    response: {
      sv: '🚀 **Axie Studio erbjuder:**\n\n🌐 **AI-drivna webbplatser** - Intelligenta webbplatser med chatbots\n📅 **Smarta bokningssystem** - Automatiserad schemaläggning och påminnelser\n🛒 **E-handelslösningar** - Kompletta webshoppar med AI-funktioner\n📱 **Mobilappar** - Cross-platform appar för iOS och Android\n🤖 **AI-automation** - Intelligent marknadsföring och kundhantering\n\nVi är Sveriges ledande AI-byrå med 500+ framgångsrika projekt!',
      en: '🚀 **Axie Studio offers:**\n\n🌐 **AI-powered websites** - Intelligent websites with chatbots\n📅 **Smart booking systems** - Automated scheduling and reminders\n🛒 **E-commerce solutions** - Complete webshops with AI features\n📱 **Mobile apps** - Cross-platform apps for iOS and Android\n🤖 **AI automation** - Intelligent marketing and customer management\n\nWe are Sweden\'s leading AI agency with 500+ successful projects!'
    },
    category: 'services',
    confidence: 0.9
  },

  // Website Development
  {
    keywords: ['webbplats', 'website', 'hemsida', 'webb', 'design', 'utveckling', 'development'],
    response: {
      sv: '🌐 **Våra AI-drivna webbplatser inkluderar:**\n\n✅ Responsiv design för alla enheter\n✅ SEO-optimering för bättre synlighet\n✅ AI-chatbot för kundservice\n✅ Snabba laddningstider (99.9% drifttid)\n✅ SSL-säkerhet och GDPR-compliance\n✅ Google Analytics integration\n✅ Kontaktformulär och sociala medier\n\n⚡ **Leveranstid**: 14 dagar\n💰 **Pris**: 8 995 kr + 495 kr/månad',
      en: '🌐 **Our AI-powered websites include:**\n\n✅ Responsive design for all devices\n✅ SEO optimization for better visibility\n✅ AI chatbot for customer service\n✅ Fast loading times (99.9% uptime)\n✅ SSL security and GDPR compliance\n✅ Google Analytics integration\n✅ Contact forms and social media\n\n⚡ **Delivery time**: 14 days\n💰 **Price**: 8,995 SEK + 495 SEK/month'
    },
    category: 'websites',
    confidence: 0.9
  },

  // Booking Systems
  {
    keywords: ['bokning', 'booking', 'tid', 'appointment', 'schema', 'schedule', 'kalender', 'calendar'],
    response: {
      sv: '📅 **Vårt AI-drivna bokningssystem:**\n\n🤖 **Intelligent schemaläggning** - Automatisk konfliktdetektering\n⏰ **Realtidsbokning** - Kunder bokar direkt online\n👥 **CRM-integration** - Komplett kundhantering\n💳 **Betalningar** - Stripe, Swish, Klarna\n📱 **SMS-påminnelser** - Minskar no-shows med 80%\n📊 **Analys** - Detaljerade rapporter\n\n🏥 Perfekt för: Vårdcentraler, frisörer, konsulter, restauranger, fitness\n💰 **Pris**: 10 995 kr + 995 kr/månad',
      en: '📅 **Our AI-powered booking system:**\n\n🤖 **Intelligent scheduling** - Automatic conflict detection\n⏰ **Real-time booking** - Customers book directly online\n👥 **CRM integration** - Complete customer management\n💳 **Payments** - Stripe, Swish, Klarna\n📱 **SMS reminders** - Reduces no-shows by 80%\n📊 **Analytics** - Detailed reports\n\n🏥 Perfect for: Healthcare, salons, consultants, restaurants, fitness\n💰 **Price**: 10,995 SEK + 995 SEK/month'
    },
    category: 'booking',
    confidence: 0.95
  },

  // E-commerce
  {
    keywords: ['e-handel', 'ecommerce', 'webshop', 'shop', 'butik', 'sälja', 'sell', 'produkter', 'products'],
    response: {
      sv: '🛒 **Vår AI-drivna e-handelslösning:**\n\n🏪 **Komplett webshop** - Kundvagn, checkout, orderhantering\n📦 **Produkthantering** - Enkelt att lägga till produkter\n💳 **Säkra betalningar** - Stripe, Klarna, Swish\n🚚 **Leveransalternativ** - Automatisk prisberäkning\n📊 **Försäljningsanalys** - AI-drivna insikter\n🔒 **GDPR & säkerhet** - SSL-kryptering\n🤖 **AI-rekommendationer** - Ökar försäljningen\n\n💰 **Pris**: 10 995 kr + 895 kr/månad',
      en: '🛒 **Our AI-powered e-commerce solution:**\n\n🏪 **Complete webshop** - Cart, checkout, order management\n📦 **Product management** - Easy to add products\n💳 **Secure payments** - Stripe, Klarna, Swish\n🚚 **Shipping options** - Automatic price calculation\n📊 **Sales analytics** - AI-driven insights\n🔒 **GDPR & security** - SSL encryption\n🤖 **AI recommendations** - Increases sales\n\n💰 **Price**: 10,995 SEK + 895 SEK/month'
    },
    category: 'ecommerce',
    confidence: 0.9
  },

  // Mobile Apps
  {
    keywords: ['app', 'mobilapp', 'mobile', 'ios', 'android', 'appstore', 'google play'],
    response: {
      sv: '📱 **Våra AI-förbättrade mobilappar:**\n\n⚡ **Cross-platform** - En app för iOS & Android\n🚀 **Blixtsnabb prestanda** - Optimerad för snabbhet\n🔔 **Push-notifieringar** - Smarta meddelanden\n📱 **Native känsla** - Smooth animationer\n🔒 **Säker & pålitlig** - Högsta säkerhetsstandard\n🏪 **App Store publicering** - Vi hjälper till med allt\n\n✨ Ingår i vårt **Komplett-paket** (14 995 kr + 1 495 kr/månad)\n*Extra kostnad för App Store publicering',
      en: '📱 **Our AI-enhanced mobile apps:**\n\n⚡ **Cross-platform** - One app for iOS & Android\n🚀 **Lightning fast performance** - Optimized for speed\n🔔 **Push notifications** - Smart notifications\n📱 **Native feel** - Smooth animations\n🔒 **Secure & reliable** - Highest security standards\n🏪 **App Store publishing** - We help with everything\n\n✨ Included in our **Complete package** (14,995 SEK + 1,495 SEK/month)\n*Extra cost for App Store publishing'
    },
    category: 'apps',
    confidence: 0.85
  },

  // AI Features
  {
    keywords: ['ai', 'artificiell intelligens', 'artificial intelligence', 'chatbot', 'automation', 'machine learning'],
    response: {
      sv: '🤖 **Våra AI-funktioner:**\n\n💬 **Intelligenta chatbots** - 24/7 kundservice\n🎯 **Automatiserad marknadsföring** - Personaliserade kampanjer\n📊 **Prediktiv analys** - Förutse kundernas behov\n🔄 **Smart automatisering** - Effektivisera processer\n🎨 **Personalisering** - Unik upplevelse för varje besökare\n📈 **AI-optimering** - Kontinuerlig förbättring\n\nVi är Sveriges ledande AI-byrå och hjälper företag att automatisera och växa med intelligent teknik!',
      en: '🤖 **Our AI features:**\n\n💬 **Intelligent chatbots** - 24/7 customer service\n🎯 **Automated marketing** - Personalized campaigns\n📊 **Predictive analytics** - Anticipate customer needs\n🔄 **Smart automation** - Streamline processes\n🎨 **Personalization** - Unique experience for each visitor\n📈 **AI optimization** - Continuous improvement\n\nWe are Sweden\'s leading AI agency helping businesses automate and grow with intelligent technology!'
    },
    category: 'ai',
    confidence: 0.95
  },

  // Contact Information
  {
    keywords: ['kontakt', 'contact', 'telefon', 'phone', 'email', 'mejl', 'adress', 'address'],
    response: {
      sv: '📞 **Kontakta oss:**\n\n📧 **Email**: stefan@axiestudio.se\n📱 **Telefon**: +46 735 132 620\n📍 **Plats**: Jönköping, Sverige\n\n⏰ **Öppettider**: Vardagar 9-17\n💬 **Svarstid**: Inom 2 timmar\n☕ **Kostnadsfri konsultation**: Alltid!\n\n🌐 **Sociala medier**:\n- Facebook: Axie Studio\n- Instagram: @axiestudi0\n- YouTube: @AxieStudio_se',
      en: '📞 **Contact us:**\n\n📧 **Email**: stefan@axiestudio.se\n📱 **Phone**: +46 735 132 620\n📍 **Location**: Jönköping, Sweden\n\n⏰ **Hours**: Weekdays 9-17\n💬 **Response time**: Within 2 hours\n☕ **Free consultation**: Always!\n\n🌐 **Social media**:\n- Facebook: Axie Studio\n- Instagram: @axiestudi0\n- YouTube: @AxieStudio_se'
    },
    category: 'contact',
    confidence: 0.95
  },

  // Company Information
  {
    keywords: ['om oss', 'about', 'företag', 'company', 'team', 'historia', 'history', 'axie studio'],
    response: {
      sv: '🏢 **Om Axie Studio:**\n\n🚀 Sveriges ledande AI-byrå sedan 2023\n⭐ 500+ framgångsrika projekt\n🎯 99.9% drifttid på alla våra lösningar\n❤️ Personlig service med hjärta\n🤖 Specialister på AI och automation\n\n👨‍💻 **Grundare**: Stefan Lindström\n📍 **Baserade i**: Jönköping, Sverige\n🌍 **Betjänar**: Hela Sverige och internationellt\n\n💡 **Vår mission**: "Build, Book, Automate: Your Digital Success, Simplified."',
      en: '🏢 **About Axie Studio:**\n\n🚀 Sweden\'s leading AI agency since 2023\n⭐ 500+ successful projects\n🎯 99.9% uptime on all our solutions\n❤️ Personal service with heart\n🤖 Specialists in AI and automation\n\n👨‍💻 **Founder**: Stefan Lindström\n📍 **Based in**: Jönköping, Sweden\n🌍 **Serving**: All of Sweden and internationally\n\n💡 **Our mission**: "Build, Book, Automate: Your Digital Success, Simplified."'
    },
    category: 'about',
    confidence: 0.9
  },

  // Support and Maintenance
  {
    keywords: ['support', 'hjälp', 'help', 'underhåll', 'maintenance', 'uppdateringar', 'updates'],
    response: {
      sv: '🛠️ **Support & Underhåll:**\n\n✅ **24/7 teknisk support** - Vi finns alltid här\n🔄 **Automatiska uppdateringar** - Alltid senaste versionen\n🔒 **Säkerhetsuppdateringar** - Kontinuerlig övervakning\n💾 **Dagliga backuper** - Dina data är säkra\n📊 **Prestationsövervakning** - 99.9% drifttid\n📞 **Prioriterad support** - Snabba svar\n\n💰 **Ingår i månadsavgiften** - Inga extra kostnader!\n📧 **Supportportal**: support@axiestudio.se',
      en: '🛠️ **Support & Maintenance:**\n\n✅ **24/7 technical support** - We\'re always here\n🔄 **Automatic updates** - Always latest version\n🔒 **Security updates** - Continuous monitoring\n💾 **Daily backups** - Your data is safe\n📊 **Performance monitoring** - 99.9% uptime\n📞 **Priority support** - Fast responses\n\n💰 **Included in monthly fee** - No extra costs!\n📧 **Support portal**: support@axiestudio.se'
    },
    category: 'support',
    confidence: 0.85
  },

  // SEO and Marketing
  {
    keywords: ['seo', 'marknadsföring', 'marketing', 'google', 'synlighet', 'visibility', 'reklam', 'ads'],
    response: {
      sv: '📈 **SEO & Digital Marknadsföring:**\n\n🔍 **SEO-optimering** - Ingår i alla webbplatser\n📊 **Google Analytics** - Detaljerad statistik\n🎯 **Google Ads** - Professionell annonsering\n📱 **Social media** - Facebook, Instagram marknadsföring\n📧 **Email-kampanjer** - Automatiserad marknadsföring\n🤖 **AI-driven optimering** - Kontinuerlig förbättring\n\n✨ **Teknisk SEO inkluderat**:\n- Snabba laddningstider\n- Mobiloptimering\n- Strukturerad data\n- SSL-säkerhet',
      en: '📈 **SEO & Digital Marketing:**\n\n🔍 **SEO optimization** - Included in all websites\n📊 **Google Analytics** - Detailed statistics\n🎯 **Google Ads** - Professional advertising\n📱 **Social media** - Facebook, Instagram marketing\n📧 **Email campaigns** - Automated marketing\n🤖 **AI-driven optimization** - Continuous improvement\n\n✨ **Technical SEO included**:\n- Fast loading times\n- Mobile optimization\n- Structured data\n- SSL security'
    },
    category: 'seo',
    confidence: 0.8
  },

  // Greetings
  {
    keywords: ['hej', 'hello', 'hi', 'tjena', 'hallå', 'god morgon', 'good morning', 'god dag'],
    response: {
      sv: '👋 **Hej och välkommen till Axie Studio!**\n\nJag är din AI-assistent och hjälper gärna till med frågor om våra digitala lösningar:\n\n🌐 **Webbplatser** med AI-funktioner\n📅 **Bokningssystem** med smart automation\n🛒 **E-handelslösningar** med AI-optimering\n📱 **Mobilappar** för alla plattformar\n\n💡 Fråga mig om priser, funktioner eller boka en kostnadsfri konsultation!\n\n✨ Vad kan jag hjälpa dig med idag?',
      en: '👋 **Hello and welcome to Axie Studio!**\n\nI\'m your AI assistant and happy to help with questions about our digital solutions:\n\n🌐 **Websites** with AI features\n📅 **Booking systems** with smart automation\n🛒 **E-commerce solutions** with AI optimization\n📱 **Mobile apps** for all platforms\n\n💡 Ask me about pricing, features, or book a free consultation!\n\n✨ How can I help you today?'
    },
    category: 'greeting',
    confidence: 0.9
  },

  // Thank you
  {
    keywords: ['tack', 'thank', 'thanks', 'tackar', 'tack så mycket'],
    response: {
      sv: '😊 **Så kul att jag kunde hjälpa!**\n\nOm du har fler frågor eller vill:\n📞 **Boka konsultation** - Kostnadsfritt!\n📧 **Kontakta oss** - stefan@axiestudio.se\n💬 **Fortsätta chatta** - Fråga på bara!\n\n🚀 Vi ser fram emot att hjälpa ditt företag växa med AI-drivna lösningar!\n\n✨ Har du något mer du undrar över?',
      en: '😊 **So glad I could help!**\n\nIf you have more questions or want to:\n📞 **Book consultation** - Free of charge!\n📧 **Contact us** - stefan@axiestudio.se\n💬 **Continue chatting** - Just ask!\n\n🚀 We look forward to helping your business grow with AI-powered solutions!\n\n✨ Is there anything else you\'re wondering about?'
    },
    category: 'thanks',
    confidence: 0.85
  }
];

// Function to find best matching response
export function findBestMatch(userInput: string, language: 'sv' | 'en'): string | null {
  const input = userInput.toLowerCase();
  let bestMatch: AIKnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of aiKnowledgeBase) {
    let score = 0;
    let keywordMatches = 0;

    for (const keyword of item.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        keywordMatches++;
        // Give higher score for exact matches and longer keywords
        score += keyword.length * (input === keyword.toLowerCase() ? 2 : 1);
      }
    }

    // Boost score based on number of keyword matches
    if (keywordMatches > 0) {
      score = score * keywordMatches * item.confidence;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }
  }

  // Return response if confidence is high enough
  if (bestMatch && bestScore > 3) {
    return bestMatch.response[language];
  }

  return null;
}

// Fallback responses when no match is found
export const fallbackResponses = {
  sv: [
    '🤔 Det är en intressant fråga! Jag har information om våra webbplatser, bokningssystem, e-handel och mobilappar. Kan du vara mer specifik?',
    '💡 Jag förstår inte riktigt din fråga, men jag kan hjälpa dig med information om våra AI-drivna lösningar. Vad är du mest intresserad av?',
    '🎯 Hmm, jag är inte säker på vad du menar. Fråga gärna om våra tjänster, priser eller hur vi kan hjälpa ditt företag!',
    '🚀 Jag har inte svaret på det, men jag kan berätta om våra fantastiska digitala lösningar! Vad vill du veta mer om?'
  ],
  en: [
    '🤔 That\'s an interesting question! I have information about our websites, booking systems, e-commerce, and mobile apps. Can you be more specific?',
    '💡 I don\'t quite understand your question, but I can help you with information about our AI-powered solutions. What are you most interested in?',
    '🎯 Hmm, I\'m not sure what you mean. Feel free to ask about our services, pricing, or how we can help your business!',
    '🚀 I don\'t have the answer to that, but I can tell you about our amazing digital solutions! What would you like to know more about?'
  ]
};