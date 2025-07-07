// Advanced Local AI Knowledge Base - Industry-Leading Chatbot
// Complete content from Axie Studio website with intelligent matching

export interface AIKnowledgeItem {
  keywords: string[];
  response: {
    sv: string;
    en: string;
  };
  category: string;
  confidence: number;
  intent: string;
  context?: string[];
}

export interface SecurityFilter {
  type: 'inappropriate' | 'spam' | 'malicious' | 'offtopic';
  keywords: string[];
  severity: 'low' | 'medium' | 'high';
}

// Advanced Security Filters
export const securityFilters: SecurityFilter[] = [
  {
    type: 'inappropriate',
    keywords: ['fuck', 'shit', 'damn', 'bitch', 'asshole', 'idiot', 'stupid', 'hate', 'kill', 'die', 'sex', 'porn', 'nude'],
    severity: 'high'
  },
  {
    type: 'spam',
    keywords: ['buy now', 'click here', 'free money', 'get rich', 'lottery', 'winner', 'congratulations', 'urgent'],
    severity: 'medium'
  },
  {
    type: 'malicious',
    keywords: ['hack', 'virus', 'malware', 'phishing', 'scam', 'fraud', 'steal', 'password', 'credit card'],
    severity: 'high'
  },
  {
    type: 'offtopic',
    keywords: ['weather', 'sports', 'politics', 'religion', 'personal', 'dating', 'relationship', 'food recipe'],
    severity: 'low'
  }
];

// Comprehensive AI Knowledge Base
export const aiKnowledgeBase: AIKnowledgeItem[] = [
  // Pricing - Most Important
  {
    keywords: ['pris', 'kostnad', 'price', 'cost', 'pricing', 'kostar', 'betala', 'avgift', 'hur mycket', 'how much'],
    response: {
      sv: '💰 **Våra AI-drivna lösningar:**\n\n🌐 **Webbplats** (AI-optimerad)\n• Startavgift: 8 995 kr\n• Månadskostnad: 495 kr\n• Inkluderar: AI-chatbot, SEO, hosting, support\n\n📅 **Bokningssystem** (Smart automation)\n• Startavgift: 10 995 kr\n• Månadskostnad: 995 kr\n• Inkluderar: AI-schemaläggning, CRM, betalningar\n\n🛒 **E-handel** (AI-rekommendationer)\n• Startavgift: 10 995 kr\n• Månadskostnad: 895 kr\n• Inkluderar: Webshop, AI-analys, marknadsföring\n\n📱 **Komplett AI-lösning**\n• Startavgift: 14 995 kr\n• Månadskostnad: 1 495 kr\n• Inkluderar: Allt ovan + mobilapp\n\n✨ **Inga bindningstider • Kostnadsfri konsultation**',
      en: '💰 **Our AI-powered solutions:**\n\n🌐 **Website** (AI-optimized)\n• Setup fee: 8,995 SEK\n• Monthly: 495 SEK\n• Includes: AI chatbot, SEO, hosting, support\n\n📅 **Booking System** (Smart automation)\n• Setup fee: 10,995 SEK\n• Monthly: 995 SEK\n• Includes: AI scheduling, CRM, payments\n\n🛒 **E-commerce** (AI recommendations)\n• Setup fee: 10,995 SEK\n• Monthly: 895 SEK\n• Includes: Webshop, AI analytics, marketing\n\n📱 **Complete AI Solution**\n• Setup fee: 14,995 SEK\n• Monthly: 1,495 SEK\n• Includes: Everything above + mobile app\n\n✨ **No commitments • Free consultation**'
    },
    category: 'pricing',
    confidence: 0.98,
    intent: 'pricing_inquiry'
  },

  // Booking/Consultation Intent
  {
    keywords: ['boka', 'book', 'konsultation', 'consultation', 'träffa', 'meet', 'tid', 'time', 'möte', 'meeting', 'demo'],
    response: {
      sv: '📅 **Perfekt! Låt oss boka en kostnadsfri konsultation.**\n\n🎯 **Vad vi går igenom:**\n• Dina specifika behov och mål\n• Vilken AI-lösning som passar bäst\n• Tidsplan och implementation\n• Kostnadsfri rådgivning\n\n⏰ **Konsultationen:**\n• 30-60 minuter\n• Helt kostnadsfri\n• Fysiskt i Jönköping eller digitalt\n• Inga förpliktelser\n\n✨ **Jag öppnar vårt bokningssystem för dig nu...**\n\n☕ Vi ser fram emot att träffa dig!',
      en: '📅 **Perfect! Let\'s book a free consultation.**\n\n🎯 **What we\'ll cover:**\n• Your specific needs and goals\n• Which AI solution fits best\n• Timeline and implementation\n• Free expert advice\n\n⏰ **The consultation:**\n• 30-60 minutes\n• Completely free\n• In-person in Jönköping or digital\n• No obligations\n\n✨ **I\'m opening our booking system for you now...**\n\n☕ We look forward to meeting you!'
    },
    category: 'booking',
    confidence: 0.95,
    intent: 'booking_request'
  },

  // AI Features - Core Differentiator
  {
    keywords: ['ai', 'artificiell intelligens', 'artificial intelligence', 'chatbot', 'automation', 'machine learning', 'smart', 'intelligent'],
    response: {
      sv: '🤖 **Axie Studio - Sveriges AI-ledare:**\n\n💡 **Våra AI-funktioner:**\n• **Intelligenta chatbots** - 24/7 kundservice som denna\n• **Prediktiv analys** - Förutse kundernas behov\n• **Automatiserad marknadsföring** - Personaliserade kampanjer\n• **Smart schemaläggning** - AI optimerar bokningar\n• **Produktrekommendationer** - Ökar e-handelsförsäljning\n• **Innehållsoptimering** - AI förbättrar SEO automatiskt\n\n🚀 **Varför välja vår AI:**\n• Fungerar lokalt (som denna chat)\n• Lär sig från ditt företag\n• Integreras sömlöst\n• Svensk support och utveckling\n\n⭐ **500+ företag litar på vår AI-teknik**',
      en: '🤖 **Axie Studio - Sweden\'s AI Leader:**\n\n💡 **Our AI features:**\n• **Intelligent chatbots** - 24/7 customer service like this one\n• **Predictive analytics** - Anticipate customer needs\n• **Automated marketing** - Personalized campaigns\n• **Smart scheduling** - AI optimizes bookings\n• **Product recommendations** - Increases e-commerce sales\n• **Content optimization** - AI improves SEO automatically\n\n🚀 **Why choose our AI:**\n• Works locally (like this chat)\n• Learns from your business\n• Seamless integration\n• Swedish support and development\n\n⭐ **500+ companies trust our AI technology**'
    },
    category: 'ai',
    confidence: 0.96,
    intent: 'ai_inquiry'
  },

  // Website Development
  {
    keywords: ['webbplats', 'website', 'hemsida', 'webb', 'design', 'utveckling', 'development', 'responsiv'],
    response: {
      sv: '🌐 **AI-drivna webbplatser från Axie Studio:**\n\n✨ **Vad som ingår:**\n• **AI-chatbot** - Som denna, men anpassad för ditt företag\n• **Responsiv design** - Perfekt på alla enheter\n• **SEO-optimering** - AI analyserar och förbättrar\n• **Snabba laddningstider** - 99.9% drifttid\n• **SSL-säkerhet** - GDPR-compliance\n• **Google Analytics** - AI-driven analys\n• **Automatiska uppdateringar** - Alltid senaste versionen\n\n⚡ **Leveranstid:** 14 dagar\n💰 **Investering:** 8 995 kr + 495 kr/månad\n🎯 **Resultat:** Fler kunder och högre konvertering\n\n🚀 **Skillnaden:** Vår AI gör din webbplats intelligent!',
      en: '🌐 **AI-powered websites from Axie Studio:**\n\n✨ **What\'s included:**\n• **AI chatbot** - Like this one, but customized for your business\n• **Responsive design** - Perfect on all devices\n• **SEO optimization** - AI analyzes and improves\n• **Fast loading times** - 99.9% uptime\n• **SSL security** - GDPR compliance\n• **Google Analytics** - AI-driven analysis\n• **Automatic updates** - Always latest version\n\n⚡ **Delivery time:** 14 days\n💰 **Investment:** 8,995 SEK + 495 SEK/month\n🎯 **Results:** More customers and higher conversion\n\n🚀 **The difference:** Our AI makes your website intelligent!'
    },
    category: 'websites',
    confidence: 0.92,
    intent: 'website_inquiry'
  },

  // Booking Systems
  {
    keywords: ['bokningssystem', 'booking system', 'schema', 'schedule', 'kalender', 'calendar', 'appointment', 'tidsbokning'],
    response: {
      sv: '📅 **Intelligent bokningssystem med AI:**\n\n🤖 **AI-funktioner:**\n• **Smart schemaläggning** - Undviker konflikter automatiskt\n• **Prediktiv analys** - Förutser populära tider\n• **Automatiska påminnelser** - SMS/email, minskar no-shows 80%\n• **Intelligent prissättning** - AI optimerar intäkter\n• **Kundpreferenser** - Lär sig och föreslår tider\n\n💼 **Perfekt för:**\n• Vårdcentraler & kliniker\n• Frisörer & skönhetssalonger\n• Konsulter & coaches\n• Restauranger & caféer\n• Fitness & träning\n\n💰 **Investering:** 10 995 kr + 995 kr/månad\n📈 **ROI:** Genomsnitt 300% ökning i bokningar',
      en: '📅 **Intelligent booking system with AI:**\n\n🤖 **AI features:**\n• **Smart scheduling** - Automatically avoids conflicts\n• **Predictive analytics** - Predicts popular times\n• **Automatic reminders** - SMS/email, reduces no-shows 80%\n• **Intelligent pricing** - AI optimizes revenue\n• **Customer preferences** - Learns and suggests times\n\n💼 **Perfect for:**\n• Healthcare centers & clinics\n• Hair salons & beauty salons\n• Consultants & coaches\n• Restaurants & cafes\n• Fitness & training\n\n💰 **Investment:** 10,995 SEK + 995 SEK/month\n📈 **ROI:** Average 300% increase in bookings'
    },
    category: 'booking',
    confidence: 0.94,
    intent: 'booking_system_inquiry'
  },

  // E-commerce
  {
    keywords: ['e-handel', 'ecommerce', 'webshop', 'shop', 'butik', 'sälja online', 'sell online', 'produkter'],
    response: {
      sv: '🛒 **AI-driven e-handel som säljer:**\n\n🤖 **AI-funktioner:**\n• **Smarta produktrekommendationer** - Ökar försäljning 40%\n• **Prediktiv lagerhantering** - Aldrig slut på populära produkter\n• **Personaliserad shopping** - Unik upplevelse för varje kund\n• **Automatisk prissättning** - Konkurrenskraftiga priser\n• **Chatbot-försäljning** - AI säljer medan du sover\n\n💳 **Betalningar:** Stripe, Klarna, Swish, PayPal\n📦 **Leverans:** Postnord, DHL, Bring integration\n📊 **Analys:** AI-driven försäljningsinsikter\n\n💰 **Investering:** 10 995 kr + 895 kr/månad\n📈 **Resultat:** Genomsnitt 250% ökning i försäljning',
      en: '🛒 **AI-driven e-commerce that sells:**\n\n🤖 **AI features:**\n• **Smart product recommendations** - Increases sales 40%\n• **Predictive inventory management** - Never run out of popular products\n• **Personalized shopping** - Unique experience for each customer\n• **Automatic pricing** - Competitive prices\n• **Chatbot sales** - AI sells while you sleep\n\n💳 **Payments:** Stripe, Klarna, Swish, PayPal\n📦 **Shipping:** Postnord, DHL, Bring integration\n📊 **Analytics:** AI-driven sales insights\n\n💰 **Investment:** 10,995 SEK + 895 SEK/month\n📈 **Results:** Average 250% increase in sales'
    },
    category: 'ecommerce',
    confidence: 0.93,
    intent: 'ecommerce_inquiry'
  },

  // Mobile Apps
  {
    keywords: ['mobilapp', 'mobile app', 'app', 'ios', 'android', 'appstore', 'google play'],
    response: {
      sv: '📱 **AI-förbättrade mobilappar:**\n\n🤖 **AI-funktioner:**\n• **Personaliserad användarupplevelse** - Lär sig av användarbeteende\n• **Push-notifieringar** - AI väljer perfekt timing\n• **Offline-funktionalitet** - Fungerar utan internet\n• **Prediktiv text** - Snabbare interaktion\n• **Smart navigation** - AI guidar användaren\n\n⚡ **Teknisk excellens:**\n• Cross-platform (iOS + Android)\n• Native prestanda\n• Automatiska uppdateringar\n• Säker datahantering\n\n🏪 **App Store publicering:**\n• Vi hjälper med hela processen\n• Optimering för sökbarhet\n• Regelefterlevnad\n\n✨ **Ingår i Komplett-paketet:** 14 995 kr + 1 495 kr/månad',
      en: '📱 **AI-enhanced mobile apps:**\n\n🤖 **AI features:**\n• **Personalized user experience** - Learns from user behavior\n• **Push notifications** - AI chooses perfect timing\n• **Offline functionality** - Works without internet\n• **Predictive text** - Faster interaction\n• **Smart navigation** - AI guides the user\n\n⚡ **Technical excellence:**\n• Cross-platform (iOS + Android)\n• Native performance\n• Automatic updates\n• Secure data handling\n\n🏪 **App Store publishing:**\n• We help with the entire process\n• Optimization for discoverability\n• Compliance management\n\n✨ **Included in Complete package:** 14,995 SEK + 1,495 SEK/month'
    },
    category: 'apps',
    confidence: 0.88,
    intent: 'app_inquiry'
  },

  // Contact Information
  {
    keywords: ['kontakt', 'contact', 'telefon', 'phone', 'email', 'mejl', 'adress', 'address', 'stefan'],
    response: {
      sv: '📞 **Kontakta Axie Studio:**\n\n👨‍💻 **Stefan Lindström** - Grundare & AI-expert\n📧 **Email:** stefan@axiestudio.se\n📱 **Telefon:** +46 735 132 620\n📍 **Kontor:** Jönköping, Sverige\n\n⏰ **Tillgänglighet:**\n• Vardagar: 09:00-17:00\n• Akuta ärenden: 24/7 support\n• Svarstid email: Inom 2 timmar\n\n🌐 **Sociala medier:**\n• Facebook: Axie Studio\n• Instagram: @axiestudi0\n• YouTube: @AxieStudio_se\n\n☕ **Kostnadsfri konsultation:** Alltid tillgänglig!\n💬 **Eller fortsätt chatta här** - jag hjälper gärna!',
      en: '📞 **Contact Axie Studio:**\n\n👨‍💻 **Stefan Lindström** - Founder & AI Expert\n📧 **Email:** stefan@axiestudio.se\n📱 **Phone:** +46 735 132 620\n📍 **Office:** Jönköping, Sweden\n\n⏰ **Availability:**\n• Weekdays: 09:00-17:00\n• Urgent matters: 24/7 support\n• Email response: Within 2 hours\n\n🌐 **Social media:**\n• Facebook: Axie Studio\n• Instagram: @axiestudi0\n• YouTube: @AxieStudio_se\n\n☕ **Free consultation:** Always available!\n💬 **Or continue chatting here** - I\'m happy to help!'
    },
    category: 'contact',
    confidence: 0.96,
    intent: 'contact_inquiry'
  },

  // Company Information
  {
    keywords: ['om oss', 'about', 'företag', 'company', 'team', 'historia', 'history', 'axie studio', 'vem är ni'],
    response: {
      sv: '🏢 **Axie Studio - Sveriges AI-pionjärer:**\n\n🚀 **Vår historia:**\n• Grundat 2023 av Stefan Lindström\n• Sveriges första AI-fokuserade webbyrå\n• 500+ framgångsrika AI-projekt\n• Baserade i Jönköping, betjänar hela Sverige\n\n🎯 **Vår mission:**\n"Build, Book, Automate: Your Digital Success, Simplified."\n\n⭐ **Våra värden:**\n• AI-first approach i allt vi gör\n• Personlig service med hjärta\n• 99.9% drifttid på alla lösningar\n• Transparent prissättning\n• Inga bindningstider\n\n🏆 **Erkännanden:**\n• Sveriges #1 AI-byrå 2025\n• 4.95/5 i kundnöjdhet\n• Betrodd av 500+ företag',
      en: '🏢 **Axie Studio - Sweden\'s AI Pioneers:**\n\n🚀 **Our story:**\n• Founded 2023 by Stefan Lindström\n• Sweden\'s first AI-focused web agency\n• 500+ successful AI projects\n• Based in Jönköping, serving all of Sweden\n\n🎯 **Our mission:**\n"Build, Book, Automate: Your Digital Success, Simplified."\n\n⭐ **Our values:**\n• AI-first approach in everything we do\n• Personal service with heart\n• 99.9% uptime on all solutions\n• Transparent pricing\n• No commitments\n\n🏆 **Recognition:**\n• Sweden\'s #1 AI agency 2025\n• 4.95/5 customer satisfaction\n• Trusted by 500+ companies'
    },
    category: 'about',
    confidence: 0.91,
    intent: 'company_inquiry'
  },

  // Support and Maintenance
  {
    keywords: ['support', 'hjälp', 'help', 'underhåll', 'maintenance', 'uppdateringar', 'updates', 'problem'],
    response: {
      sv: '🛠️ **Världsklass support & underhåll:**\n\n✅ **24/7 AI-övervakning:**\n• Automatisk problemdetektering\n• Proaktiva säkerhetsuppdateringar\n• Prestationsoptimering\n• 99.9% drifttidsgaranti\n\n🚀 **Vad som ingår:**\n• Dagliga säkerhetskopior\n• SSL-certifikat och förnyelse\n• Hastighetsoptimering\n• SEO-övervakning\n• Innehållsuppdateringar\n• Teknisk support\n\n📞 **Supportkanaler:**\n• Email: support@axiestudio.se\n• Telefon: +46 735 132 620\n• Supportportal: 24/7 tillgång\n• AI-chat: Som denna!\n\n💰 **Kostnad:** Ingår i alla månadsavgifter',
      en: '🛠️ **World-class support & maintenance:**\n\n✅ **24/7 AI monitoring:**\n• Automatic problem detection\n• Proactive security updates\n• Performance optimization\n• 99.9% uptime guarantee\n\n🚀 **What\'s included:**\n• Daily backups\n• SSL certificates and renewal\n• Speed optimization\n• SEO monitoring\n• Content updates\n• Technical support\n\n📞 **Support channels:**\n• Email: support@axiestudio.se\n• Phone: +46 735 132 620\n• Support portal: 24/7 access\n• AI chat: Like this one!\n\n💰 **Cost:** Included in all monthly fees'
    },
    category: 'support',
    confidence: 0.87,
    intent: 'support_inquiry'
  },

  // SEO and Marketing
  {
    keywords: ['seo', 'marknadsföring', 'marketing', 'google', 'synlighet', 'visibility', 'reklam', 'ads', 'ranking'],
    response: {
      sv: '📈 **AI-driven SEO & Marknadsföring:**\n\n🤖 **AI-optimering:**\n• **Automatisk innehållsanalys** - AI förbättrar texter\n• **Keyword-optimering** - Hittar bästa sökorden\n• **Teknisk SEO** - Snabbhet, struktur, mobilanpassning\n• **Konkurrentanalys** - AI analyserar marknaden\n• **Lokal SEO** - Dominera lokala sökningar\n\n📊 **Marknadsföringsautomation:**\n• Google Ads med AI-optimering\n• Facebook/Instagram kampanjer\n• Email-marknadsföring\n• Retargeting och lookalike audiences\n\n📈 **Resultat våra kunder ser:**\n• 300% ökning i organisk trafik\n• 250% förbättring i konvertering\n• 80% minskning i kostnad per lead\n\n✨ **Ingår i alla våra paket!**',
      en: '📈 **AI-driven SEO & Marketing:**\n\n🤖 **AI optimization:**\n• **Automatic content analysis** - AI improves texts\n• **Keyword optimization** - Finds best search terms\n• **Technical SEO** - Speed, structure, mobile optimization\n• **Competitor analysis** - AI analyzes the market\n• **Local SEO** - Dominate local searches\n\n📊 **Marketing automation:**\n• Google Ads with AI optimization\n• Facebook/Instagram campaigns\n• Email marketing\n• Retargeting and lookalike audiences\n\n📈 **Results our customers see:**\n• 300% increase in organic traffic\n• 250% improvement in conversion\n• 80% reduction in cost per lead\n\n✨ **Included in all our packages!**'
    },
    category: 'seo',
    confidence: 0.89,
    intent: 'seo_inquiry'
  },

  // Greetings and Welcome
  {
    keywords: ['hej', 'hello', 'hi', 'tjena', 'hallå', 'god morgon', 'good morning', 'välkommen', 'welcome'],
    response: {
      sv: '👋 **Hej och välkommen till Axie Studio!**\n\nJag är din personliga AI-assistent - en försmak på vad vi kan skapa för ditt företag! 🤖\n\n✨ **Jag kan hjälpa dig med:**\n• 💰 Priser och paketinformation\n• 🌐 AI-drivna webbplatser\n• 📅 Intelligenta bokningssystem\n• 🛒 E-handelslösningar\n• 📱 Mobilappar\n• 📞 Boka kostnadsfri konsultation\n\n🚀 **Varför Axie Studio?**\n• Sveriges ledande AI-byrå\n• 500+ framgångsrika projekt\n• 99.9% drifttid\n• Inga bindningstider\n\n💡 **Vad kan jag hjälpa dig med idag?**',
      sv: '👋 **Hej och välkommen!**\n\nJag är Axie - din personliga AI-assistent! 🤖\n\n✨ **Jag kan hjälpa dig med:**\n• 💰 Priser och paketinformation\n• 🌐 AI-drivna webbplatser\n• 📅 Intelligenta bokningssystem\n• 🛒 E-handelslösningar\n• 📱 Mobilappar\n• 📞 Boka kostnadsfri konsultation\n\n🚀 **Varför Axie Studio?**\n• Sveriges ledande AI-byrå\n• 500+ framgångsrika projekt\n• 99.9% drifttid\n• Inga bindningstider\n\n💡 **Vad kan jag hjälpa dig med idag?**',
      en: '👋 **Hello and welcome!**\n\nI\'m Axie - your personal AI assistant! 🤖\n\n✨ **I can help you with:**\n• 💰 Pricing and package information\n• 🌐 AI-powered websites\n• 📅 Intelligent booking systems\n• 🛒 E-commerce solutions\n• 📱 Mobile apps\n• 📞 Book free consultation\n\n🚀 **Why Axie Studio?**\n• Sweden\'s leading AI agency\n• 500+ successful projects\n• 99.9% uptime\n• No commitments\n\n💡 **How can I help you today?**'
    },
    category: 'greeting',
    confidence: 0.94,
    intent: 'greeting'
  },

  // Thank you responses
  {
    keywords: ['tack', 'thank', 'thanks', 'tackar', 'tack så mycket', 'thank you'],
    response: {
      sv: '😊 **Så roligt att jag kunde hjälpa!**\n\n🎯 **Nästa steg:**\n• 📞 **Boka kostnadsfri konsultation** - Låt oss diskutera dina behov\n• 📧 **Kontakta Stefan direkt** - stefan@axiestudio.se\n• 💬 **Fortsätt chatta** - Fråga mer om våra AI-lösningar\n• 🌐 **Utforska vår webbplats** - Se exempel på vårt arbete\n\n🚀 **Kom ihåg:**\n• Konsultationen är helt kostnadsfri\n• Inga förpliktelser\n• Vi hjälper dig hitta rätt lösning\n• AI-expert Stefan svarar personligen\n\n✨ **Finns det något mer jag kan hjälpa dig med?**',
      en: '😊 **So glad I could help!**\n\n🎯 **Next steps:**\n• 📞 **Book free consultation** - Let\'s discuss your needs\n• 📧 **Contact Stefan directly** - stefan@axiestudio.se\n• 💬 **Continue chatting** - Ask more about our AI solutions\n• 🌐 **Explore our website** - See examples of our work\n\n🚀 **Remember:**\n• The consultation is completely free\n• No obligations\n• We help you find the right solution\n• AI expert Stefan responds personally\n\n✨ **Is there anything else I can help you with?**'
    },
    category: 'thanks',
    confidence: 0.88,
    intent: 'gratitude'
  }
];

// Advanced Security Function
export function checkSecurity(input: string): { safe: boolean; reason?: string; severity?: string } {
  const lowerInput = input.toLowerCase();
  
  for (const filter of securityFilters) {
    for (const keyword of filter.keywords) {
      if (lowerInput.includes(keyword)) {
        return {
          safe: false,
          reason: filter.type,
          severity: filter.severity
        };
      }
    }
  }
  
  return { safe: true };
}

// Advanced Intent Recognition
export function recognizeIntent(input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Booking intent patterns
  if (/\b(boka|book|träffa|meet|konsultation|consultation|demo|tid|time)\b/.test(lowerInput)) {
    return 'booking_request';
  }
  
  // Pricing intent patterns
  if (/\b(pris|price|kostnad|cost|kostar|betala|hur mycket|how much)\b/.test(lowerInput)) {
    return 'pricing_inquiry';
  }
  
  // Contact intent patterns
  if (/\b(kontakt|contact|telefon|phone|email|mejl|stefan)\b/.test(lowerInput)) {
    return 'contact_inquiry';
  }
  
  return 'general_inquiry';
}

// Enhanced Matching Algorithm
export function findBestMatch(userInput: string, language: 'sv' | 'en'): string | null {
  // Security check first
  const securityCheck = checkSecurity(userInput);
  if (!securityCheck.safe) {
    return getSecurityResponse(securityCheck.reason!, securityCheck.severity!, language);
  }
  
  const input = userInput.toLowerCase();
  const intent = recognizeIntent(input);
  
  let bestMatch: AIKnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of aiKnowledgeBase) {
    let score = 0;
    let keywordMatches = 0;

    // Intent matching bonus
    if (item.intent === intent) {
      score += 50;
    }

    // Keyword matching with advanced scoring
    for (const keyword of item.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        keywordMatches++;
        
        // Exact word match gets higher score
        const wordBoundaryRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
        if (wordBoundaryRegex.test(input)) {
          score += keyword.length * 3;
        } else {
          score += keyword.length * 1.5;
        }
      }
    }

    // Apply confidence multiplier
    if (keywordMatches > 0) {
      score = score * keywordMatches * item.confidence;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }
  }

  // Return response if confidence is high enough
  if (bestMatch && bestScore > 5) {
    return bestMatch.response[language];
  }

  return null;
}

// Security Response Generator
function getSecurityResponse(reason: string, severity: string, language: 'sv' | 'en'): string {
  const responses = {
    sv: {
      inappropriate: '🚫 **Jag kan inte hjälpa med det.**\n\nJag är här för att svara på frågor om Axie Studios digitala lösningar. Låt oss fokusera på hur vi kan hjälpa ditt företag växa!\n\n💡 **Fråga mig istället om:**\n• Webbplatser och AI-lösningar\n• Priser och paket\n• Bokningssystem\n• E-handel\n\n✨ Vad kan jag hjälpa dig med?',
      spam: '🤖 **Det verkar som spam.**\n\nJag är Axie Studios AI-assistent och hjälper med frågor om våra digitala lösningar.\n\n📞 **För seriösa förfrågningar:**\n• Boka kostnadsfri konsultation\n• Kontakta stefan@axiestudio.se\n• Fråga om våra AI-tjänster',
      malicious: '🔒 **Säkerhetsvarning.**\n\nJag kan inte hjälpa med sådana förfrågningar. Jag är här för att diskutera Axie Studios professionella digitala lösningar.\n\n✅ **Låt oss prata om:**\n• AI-drivna webbplatser\n• Bokningssystem\n• E-handelslösningar',
      offtopic: '🎯 **Jag fokuserar på digitala lösningar.**\n\nJag är specialiserad på Axie Studios tjänster och kan hjälpa dig med:\n\n🌐 Webbplatser med AI\n📅 Bokningssystem\n🛒 E-handel\n📱 Mobilappar\n\n💡 Vad av detta intresserar dig mest?'
    },
    en: {
      inappropriate: '🚫 **I can\'t help with that.**\n\nI\'m here to answer questions about Axie Studio\'s digital solutions. Let\'s focus on how we can help your business grow!\n\n💡 **Ask me instead about:**\n• Websites and AI solutions\n• Pricing and packages\n• Booking systems\n• E-commerce\n\n✨ How can I help you?',
      spam: '🤖 **That looks like spam.**\n\nI\'m Axie Studio\'s AI assistant and help with questions about our digital solutions.\n\n📞 **For serious inquiries:**\n• Book free consultation\n• Contact stefan@axiestudio.se\n• Ask about our AI services',
      malicious: '🔒 **Security warning.**\n\nI can\'t help with such requests. I\'m here to discuss Axie Studio\'s professional digital solutions.\n\n✅ **Let\'s talk about:**\n• AI-powered websites\n• Booking systems\n• E-commerce solutions',
      offtopic: '🎯 **I focus on digital solutions.**\n\nI specialize in Axie Studio\'s services and can help you with:\n\n🌐 Websites with AI\n📅 Booking systems\n🛒 E-commerce\n📱 Mobile apps\n\n💡 Which of these interests you most?'
    }
  };

  return responses[language][reason as keyof typeof responses[typeof language]] || responses[language].offtopic;
}

// Intelligent Fallback Responses
export const fallbackResponses = {
  sv: [
    '🤔 **Intressant fråga!** Jag har omfattande kunskap om Axie Studios AI-lösningar. Kan du vara mer specifik om vad du söker?\n\n💡 **Populära ämnen:**\n• Priser och paket\n• AI-funktioner\n• Bokningssystem\n• E-handel\n\n✨ Vad intresserar dig mest?',
    
    '🎯 **Låt mig hjälpa dig bättre!** Jag är expert på Axie Studios digitala lösningar.\n\n🚀 **Jag kan berätta om:**\n• Hur vår AI fungerar\n• Priser från 8 995 kr\n• Kostnadsfri konsultation\n• Framgångshistorier\n\n💬 Vad vill du veta mer om?',
    
    '🤖 **Som AI-assistent** förstår jag inte riktigt din fråga, men jag kan hjälpa dig med allt om Axie Studios tjänster!\n\n📞 **Eller vill du:**\n• Boka kostnadsfri konsultation?\n• Prata direkt med Stefan?\n• Få en prisuppgift?\n\n✨ Säg bara vad du behöver!'
  ],
  en: [
    '🤔 **Interesting question!** I have comprehensive knowledge about Axie Studio\'s AI solutions. Can you be more specific about what you\'re looking for?\n\n💡 **Popular topics:**\n• Pricing and packages\n• AI features\n• Booking systems\n• E-commerce\n\n✨ What interests you most?',
    
    '🎯 **Let me help you better!** I\'m an expert on Axie Studio\'s digital solutions.\n\n🚀 **I can tell you about:**\n• How our AI works\n• Pricing from 8,995 SEK\n• Free consultation\n• Success stories\n\n💬 What would you like to know more about?',
    
    '🤖 **As an AI assistant** I don\'t quite understand your question, but I can help you with everything about Axie Studio\'s services!\n\n📞 **Or would you like to:**\n• Book a free consultation?\n• Talk directly with Stefan?\n• Get a quote?\n\n✨ Just tell me what you need!'
  ]
};

// Analytics and Learning (Local Storage)
export function logInteraction(userInput: string, aiResponse: string, language: string, intent: string) {
  try {
    const interaction = {
      timestamp: new Date().toISOString(),
      userInput: userInput.substring(0, 100), // Limit for privacy
      intent,
      language,
      responseCategory: intent,
      sessionId: getSessionId()
    };
    
    const interactions = JSON.parse(localStorage.getItem('axie-ai-interactions') || '[]');
    interactions.push(interaction);
    
    // Keep only last 50 interactions for privacy
    if (interactions.length > 50) {
      interactions.splice(0, interactions.length - 50);
    }
    
    localStorage.setItem('axie-ai-interactions', JSON.stringify(interactions));
  } catch (error) {
    console.log('Could not log interaction');
  }
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('axie-ai-session');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    sessionStorage.setItem('axie-ai-session', sessionId);
  }
  return sessionId;
}