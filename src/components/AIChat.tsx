import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Bot, User, Brain, Calendar, Clock, Sparkles, 
  ThumbsUp, ThumbsDown, Copy, RotateCcw, Minimize2, Maximize2,
  Zap, Star, Shield, MessageSquare, Phone, Mail, ArrowRight,
  CheckCircle, AlertCircle, Info, Lightbulb, Target, Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ConversationManager } from '../data/aiConversationManager';
import { ResponseTemplateEngine, QUICK_RESPONSES } from '../data/aiResponseTemplates';
import { AI_RESPONSE_GUIDELINES, enhanceResponse, generateContextualResponse, ConversationState, Message as AIMessage } from '../data/aiResponseGuidelines';

interface Message extends AIMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
  intent?: string;
  feedback?: 'positive' | 'negative' | null;
  confidence?: number;
  helpful?: boolean | null;
  messageType?: 'text' | 'quick_action' | 'booking_prompt' | 'feature_highlight';
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [conversationManager] = useState(() => new ConversationManager(currentLanguage.code as 'sv' | 'en'));
  const [templateEngine] = useState(() => new ResponseTemplateEngine());
  const [conversationState, setConversationState] = useState<ConversationState>({
    messageHistory: [],
    userProfile: {
      previousInteractions: 0,
      preferredLanguage: currentLanguage.code,
      interests: [],
      urgencyLevel: 'medium'
    },
    currentIntent: '',
    conversationStage: 'initial_inquiry',
    lastTopics: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Premium welcome message with rich content
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = currentLanguage.code === 'sv' 
        ? '👋 **Hej och välkommen! Jag är Axie från Axie Studio.**\n\n🤖 **Din personliga AI-assistent** som kan hjälpa dig med alla våra digitala lösningar:\n\n🌐 **Professionella Webbplatser** - Från 8 995 kr startavgift\n• Responsiv design som fungerar perfekt på alla enheter\n• SEO-optimering för bättre synlighet i Google\n• Integrerad AI-chatbot (som denna!)\n• Hosting, säkerhet och support ingår\n\n📅 **Intelligenta Bokningssystem** - Från 10 995 kr\n• Smart schemaläggning med konfliktdetektering\n• Automatiska SMS och e-postpåminnelser\n• Betalningsintegration med Stripe och Swish\n• Komplett CRM för kundhantering\n\n🛒 **E-handelslösningar** - Från 10 995 kr\n• Komplett webshop med produkthantering\n• Säkra betalningar och leveransalternativ\n• Lagerhantering och orderhantering\n• Marknadsföringsverktyg och analys\n\n📱 **Mobilappar** - iOS & Android utveckling\n• Cross-platform appar som fungerar på alla enheter\n• App Store och Google Play publicering\n• Push-notifieringar och offline-funktionalitet\n• Native prestanda och användarupplevelse\n\n✨ **Jag är tränad på all vår expertis och kunskap** och kan svara på detaljerade frågor om:\n• Tekniska specifikationer och funktioner\n• Priser, paket och betalningsalternativ\n• Projektprocesser och leveranstider\n• Integration med befintliga system\n• Support och underhåll\n• Branschspecifika lösningar\n\n💡 **Vad kan jag hjälpa dig med idag? Ställ gärna specifika frågor!**'
        : '👋 **Hello and welcome! I\'m Axie from Axie Studio.**\n\n🤖 **Your personal AI assistant** who can help you with all our digital solutions:\n\n🌐 **Professional Websites** - From 8,995 SEK setup fee\n• Responsive design that works perfectly on all devices\n• SEO optimization for better visibility in Google\n• Integrated AI chatbot (like this one!)\n• Hosting, security and support included\n\n📅 **Intelligent Booking Systems** - From 10,995 SEK\n• Smart scheduling with conflict detection\n• Automatic SMS and email reminders\n• Payment integration with Stripe and Swish\n• Complete CRM for customer management\n\n🛒 **E-commerce Solutions** - From 10,995 SEK\n• Complete webshop with product management\n• Secure payments and delivery options\n• Inventory management and order processing\n• Marketing tools and analytics\n\n📱 **Mobile Apps** - iOS & Android development\n• Cross-platform apps that work on all devices\n• App Store and Google Play publishing\n• Push notifications and offline functionality\n• Native performance and user experience\n\n✨ **I\'m trained on all our expertise and knowledge** and can answer detailed questions about:\n• Technical specifications and features\n• Pricing, packages and payment options\n• Project processes and delivery times\n• Integration with existing systems\n• Support and maintenance\n• Industry-specific solutions\n\n💡 **How can I help you today? Feel free to ask specific questions!**';
      
      const welcomeMessage: Message = {
        id: 'welcome',
        text: welcomeText,
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome',
        confidence: 1.0,
        messageType: 'feature_highlight'
      };
      setMessages([welcomeMessage]);
      
      // Update conversation state
      setConversationState(prev => ({
        ...prev,
        messageHistory: [welcomeMessage],
        userProfile: {
          ...prev.userProfile,
          intent: 'welcome',
          feedback: null
        }
      }));
    }
  }, [isOpen, currentLanguage.code]);

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Enhanced AI response function with premium features
  const getAIResponse = async (userMessage: string): Promise<string> => {
    const thinkingTime = Math.min(1000 + (userMessage.length * 25), 3000);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    try {
      const response = await conversationManager.processMessage(userMessage);
      return response;
    } catch (error) {
      console.error('AI response error:', error);
      return currentLanguage.code === 'sv' 
        ? '🤖 **Ursäkta för det tekniska problemet!**\n\nNågot gick fel med min AI-motor just nu. Detta händer ibland när systemet är överbelastat.\n\n🔧 **Vad du kan göra:**\n• Försök ställa din fråga igen om ett ögonblick\n• Kontakta oss direkt på stefan@axiestudio.se\n• Ring oss på +46 735 132 620\n• Boka en kostnadsfri konsultation direkt\n\n💡 **Jag är vanligtvis mycket pålitlig och kan svara på alla frågor om våra digitala lösningar!**'
        : '🤖 **Sorry for the technical issue!**\n\nSomething went wrong with my AI engine right now. This sometimes happens when the system is overloaded.\n\n🔧 **What you can do:**\n• Try asking your question again in a moment\n• Contact us directly at stefan@axiestudio.se\n• Call us at +46 735 132 620\n• Book a free consultation directly\n\n💡 **I\'m usually very reliable and can answer all questions about our digital solutions!**';
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
      feedback: null,
      confidence: 1.0,
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      const aiResponseText = await getAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date(),
        feedback: null,
        confidence: 0.95,
        messageType: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation state
      setConversationState(prev => ({
        ...prev,
        messageHistory: [...prev.messageHistory, userMessage, aiMessage],
        currentIntent: 'intent',
        lastTopics: [...prev.lastTopics.slice(-4), 'intent']
      }));

      // Check for booking intent and show booking prompt
      if (aiResponseText.includes('boka') || aiResponseText.includes('book') || aiResponseText.includes('konsultation')) {
        setTimeout(() => {
          const bookingPrompt: Message = {
            id: (Date.now() + 2).toString(),
            text: currentLanguage.code === 'sv' 
              ? '🎯 **Perfekt timing för en konsultation!**\n\nDet verkar som att du är intresserad av våra tjänster. Vill du boka en kostnadsfri konsultation direkt nu?\n\n⏰ **Vad du får:**\n• 30-60 minuters personlig genomgång\n• Skräddarsydda rekommendationer för ditt företag\n• Kostnadsfri rådgivning från AI-expert Stefan\n• Ingen försäljning - bara äkta hjälp\n• Möjlighet att träffas fysiskt i Jönköping eller digitalt\n\n✨ **Bokningsprocessen tar bara 2 minuter och du väljer själv tid som passar dig!**'
              : '🎯 **Perfect timing for a consultation!**\n\nIt seems like you\'re interested in our services. Would you like to book a free consultation right now?\n\n⏰ **What you get:**\n• 30-60 minutes of personal review\n• Tailored recommendations for your business\n• Free advice from AI expert Stefan\n• No sales pitch - just genuine help\n• Option to meet in person in Jönköping or digitally\n\n✨ **The booking process takes only 2 minutes and you choose the time that suits you!**',
            isBot: true,
            timestamp: new Date(),
            messageType: 'booking_prompt',
            confidence: 1.0
          };
          setMessages(prev => [...prev, bookingPrompt]);
        }, 1500);
      }

      if (typeof window !== 'undefined' && window.trackAIInteraction) {
        window.trackAIInteraction('ai_response_generated', 'AI Assistant');
      }

    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage.code === 'sv' 
          ? '⚠️ **Ett tekniskt fel uppstod**\n\nJag kunde inte behandla din förfrågan just nu på grund av ett systemfel.\n\n🔄 **Försök gärna:**\n• Ställa din fråga igen om en stund\n• Kontakta oss direkt på stefan@axiestudio.se\n• Ring +46 735 132 620 för omedelbar hjälp\n• Boka en kostnadsfri konsultation\n\n💡 **Vi svarar alltid inom 2 timmar på e-post och är tillgängliga för samtal vardagar 9-17.**'
          : '⚠️ **A technical error occurred**\n\nI couldn\'t process your request right now due to a system error.\n\n🔄 **Please try:**\n• Asking your question again in a moment\n• Contacting us directly at stefan@axiestudio.se\n• Calling +46 735 132 620 for immediate help\n• Booking a free consultation\n\n💡 **We always respond within 2 hours to emails and are available for calls weekdays 9-17.**',
        isBot: true,
        timestamp: new Date(),
        feedback: null,
        confidence: 1.0,
        messageType: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Premium quick action handlers
  const handleQuickAction = async (action: string) => {
    const quickMessages = {
      sv: {
        pricing: 'Jag vill veta detaljerat om era priser och paket. Vad kostar era olika tjänster och vad ingår i varje paket? Finns det några dolda kostnader jag bör veta om?',
        booking: 'Jag är intresserad av att boka en kostnadsfri konsultation. Kan du berätta mer om vad som händer under konsultationen och hur bokningsprocessen fungerar?',
        website: 'Berätta detaljerat om era webbplatslösningar. Vad ingår i paketet, vilka tekniker använder ni, och hur ser utvecklingsprocessen ut från start till färdig webbplats?',
        ecommerce: 'Jag behöver en professionell webshop för mitt företag. Kan du förklara era e-handelslösningar, vilka funktioner som ingår, och hur ni hanterar betalningar och leveranser?',
        apps: 'Jag är intresserad av mobilappsutveckling. Kan ni utveckla appar för både iOS och Android? Vad kostar det och hur lång tid tar utvecklingsprocessen?',
        support: 'Jag behöver hjälp och support för min befintliga digitala lösning. Vilken typ av support erbjuder ni och hur snabbt kan ni hjälpa till när problem uppstår?'
      },
      en: {
        pricing: 'I want to know in detail about your pricing and packages. What do your different services cost and what is included in each package? Are there any hidden costs I should know about?',
        booking: 'I\'m interested in booking a free consultation. Can you tell me more about what happens during the consultation and how the booking process works?',
        website: 'Tell me in detail about your website solutions. What\'s included in the package, what technologies do you use, and what does the development process look like from start to finished website?',
        ecommerce: 'I need a professional webshop for my business. Can you explain your e-commerce solutions, what features are included, and how you handle payments and deliveries?',
        apps: 'I\'m interested in mobile app development. Can you develop apps for both iOS and Android? What does it cost and how long does the development process take?',
        support: 'I need help and support for my existing digital solution. What type of support do you offer and how quickly can you help when problems arise?'
      }
    };

    const lang = currentLanguage.code as 'sv' | 'en';
    const message = quickMessages[lang][action as keyof typeof quickMessages[typeof lang]];
    
    if (message) {
      setInputText(message);
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handleMessageFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
    ));
    
    // Show thank you message
    const feedbackMessage: Message = {
      id: Date.now().toString(),
      text: helpful 
        ? (currentLanguage.code === 'sv' 
          ? '🙏 **Tack så mycket för din positiva feedback!**\n\nDet gläder mig att jag kunde hjälpa dig på ett bra sätt. Din feedback hjälper mig att förstå vad som fungerar bra och fortsätta leverera värdefull information.\n\n✨ **Har du fler frågor om våra digitala lösningar? Jag finns här för att hjälpa!**' 
          : '🙏 **Thank you so much for your positive feedback!**\n\nI\'m glad I could help you in a good way. Your feedback helps me understand what works well and continue delivering valuable information.\n\n✨ **Do you have more questions about our digital solutions? I\'m here to help!**')
        : (currentLanguage.code === 'sv' 
          ? '📝 **Tack för din ärliga feedback!**\n\nJag uppskattar att du tog dig tid att berätta att mitt svar inte var tillräckligt bra. Detta hjälper mig att förbättra mina svar framöver.\n\n🔄 **Kan jag försöka igen?** Ställ gärna samma fråga på ett annat sätt, eller låt mig veta vad som saknades i mitt svar.\n\n💡 **Alternativt kan du kontakta Stefan direkt på stefan@axiestudio.se för mer detaljerad hjälp.**' 
          : '📝 **Thank you for your honest feedback!**\n\nI appreciate that you took the time to tell me that my answer wasn\'t good enough. This helps me improve my responses going forward.\n\n🔄 **Can I try again?** Feel free to ask the same question in a different way, or let me know what was missing from my answer.\n\n💡 **Alternatively, you can contact Stefan directly at stefan@axiestudio.se for more detailed help.**'),
      isBot: true,
      timestamp: new Date(),
      confidence: 1.0,
      messageType: 'text'
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, feedbackMessage]);
    }, 500);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\*\*/g, '').replace(/\n/g, ' '));
    
    // Show copy confirmation
    const copyMessage: Message = {
      id: Date.now().toString(),
      text: currentLanguage.code === 'sv' 
        ? '📋 **Text kopierad till urklipp!**\n\nInformationen har sparats i ditt urklipp och du kan nu klistra in den var du vill.\n\n💡 **Tips:** Du kan också spara viktig information genom att skicka den till dig själv via e-post eller anteckningar.' 
        : '📋 **Text copied to clipboard!**\n\nThe information has been saved to your clipboard and you can now paste it wherever you want.\n\n💡 **Tip:** You can also save important information by emailing it to yourself or saving it in notes.',
      isBot: true,
      timestamp: new Date(),
      confidence: 1.0,
      messageType: 'text'
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, copyMessage]);
    }, 200);
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowQuickActions(true);
    setConversationState(prev => ({
      ...prev,
      messageHistory: [],
      currentIntent: '',
      lastTopics: []
    }));
    
    // Re-initialize with welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        text: currentLanguage.code === 'sv' 
          ? '🔄 **Chatten har återställts!**\n\nHej igen! Nu har vi en fräsch start och jag är redo att hjälpa dig med nya frågor.\n\n🤖 **Jag kan fortfarande hjälpa dig med:**\n• Detaljerade frågor om våra webbplatser, bokningssystem, e-handel och mobilappar\n• Priser, paket och betalningsalternativ\n• Tekniska specifikationer och funktioner\n• Projektprocesser och leveranstider\n• Boka kostnadsfri konsultation\n\n💡 **Vad kan jag hjälpa dig med nu?**'
          : '🔄 **Chat has been reset!**\n\nHello again! Now we have a fresh start and I\'m ready to help you with new questions.\n\n🤖 **I can still help you with:**\n• Detailed questions about our websites, booking systems, e-commerce and mobile apps\n• Pricing, packages and payment options\n• Technical specifications and features\n• Project processes and delivery times\n• Book free consultation\n\n💡 **How can I help you now?**',
        isBot: true,
        timestamp: new Date(),
        intent: 'welcome',
        confidence: 1.0,
        messageType: 'text'
      };
      setMessages([welcomeMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleIframeLoad = () => {
    setIsBookingLoading(false);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setIsBookingLoading(true);
    
    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      text: currentLanguage.code === 'sv' 
        ? '✅ **Tack för att du tittade på bokningskalendern!**\n\nIngen stress alls - du kan alltid komma tillbaka och boka när det passar dig bättre.\n\n📅 **Kom ihåg att konsultationen är:**\n• Helt kostnadsfri och utan förpliktelser\n• 30-60 minuter personlig genomgång\n• Möjlighet att träffas fysiskt eller digitalt\n• Fokus på dina specifika behov och mål\n\n💡 **Finns det något annat jag kan hjälpa dig med just nu? Jag kan svara på frågor om våra tjänster, priser eller tekniska detaljer.**'
        : '✅ **Thanks for looking at the booking calendar!**\n\nNo stress at all - you can always come back and book when it suits you better.\n\n📅 **Remember that the consultation is:**\n• Completely free and without obligations\n• 30-60 minutes personal review\n• Option to meet in person or digitally\n• Focus on your specific needs and goals\n\n💡 **Is there anything else I can help you with right now? I can answer questions about our services, pricing or technical details.**',
      isBot: true,
      timestamp: new Date(),
      confidence: 1.0,
      messageType: 'text'
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, confirmMessage]);
    }, 500);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 ${isMinimized ? 'pointer-events-none' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`${
            isMinimized 
              ? 'w-96 h-20 bottom-4 right-4' 
              : 'w-full h-full'
          } bg-white flex flex-col overflow-hidden transition-all duration-500 ease-in-out shadow-2xl ${
            isMinimized ? 'fixed rounded-2xl' : ''
          }`}
          style={{ backgroundColor: 'white', colorScheme: 'light only' }}
          initial={{ scale: isMinimized ? 1 : 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Premium Header */}
          {!isBookingModalOpen && (
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 flex-shrink-0 shadow-lg relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8 animate-float" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
                    <Brain className="text-white" size={18} />
                  </div>
                  <div className={isMinimized ? 'hidden' : ''}>
                    <h3 className="font-bold text-white text-base">Axie AI Assistant</h3>
                    <div className="flex items-center space-x-2 text-white/90 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Online • Powered by Axie Studio</span>
                      <Award size={12} className="text-yellow-300" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {!isMinimized && (
                    <>
                      <button
                        onClick={handleClearChat}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30 group"
                        title="Clear chat"
                      >
                        <RotateCcw size={14} className="text-white group-hover:rotate-180 transition-transform duration-300" />
                      </button>
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30"
                        title="Minimize"
                      >
                        <Minimize2 size={14} className="text-white" />
                      </button>
                    </>
                  )}
                  
                  {isMinimized && (
                    <button
                      onClick={() => setIsMinimized(false)}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30"
                      title="Maximize"
                    >
                      <Maximize2 size={14} className="text-white" />
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-red-500/80 p-2 rounded-lg transition-all duration-300 touch-manipulation backdrop-blur-sm border border-white/30"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Messages Area */}
          {!isBookingModalOpen && !isMinimized && (
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className={`flex items-start space-x-2 max-w-[90%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                      {/* Avatar */}
                      <div className={`p-2 rounded-xl flex-shrink-0 shadow-md ${
                        message.isBot 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        {message.isBot ? (
                          <Bot size={16} className="text-white" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {/* Message bubble */}
                        <div className={`p-3 rounded-2xl shadow-md border ${
                          message.isBot 
                            ? 'bg-white border-gray-200 text-gray-800' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
                        } ${
                          message.messageType === 'booking_prompt' ? 'ring-2 ring-green-400 bg-green-50' :
                          message.messageType === 'feature_highlight' ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                        }`}>
                          {/* Message content */}
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {message.text.split('**').map((part, index) => 
                              index % 2 === 1 ? <strong key={index} className="font-bold">{part}</strong> : part
                            )}
                          </div>
                          
                          {/* Special message type indicators */}
                          {message.messageType === 'booking_prompt' && (
                            <div className="mt-2 flex items-center space-x-1 text-green-700">
                              <Target size={12} />
                              <span className="text-xs font-medium">Booking Opportunity</span>
                            </div>
                          )}
                          
                          {message.messageType === 'feature_highlight' && (
                            <div className="mt-2 flex items-center space-x-1 text-blue-700">
                              <Lightbulb size={12} />
                              <span className="text-xs font-medium">AI Assistant Features</span>
                            </div>
                          )}
                          
                          {/* Message metadata */}
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.confidence && (
                              <div className="flex items-center space-x-1">
                                <Shield size={12} />
                                <span>AI Confidence: {Math.round(message.confidence * 100)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Message actions */}
                        {message.isBot && (
                          <div className="flex items-center space-x-2 mt-2 ml-1">
                            {/* Yes/No buttons for booking prompts */}
                            {message.messageType === 'booking_prompt' && (
                              <div className="flex items-center space-x-2 mr-4">
                                <button
                                  onClick={() => {
                                    setIsBookingModalOpen(true);
                                    // Add confirmation message
                                    const confirmMessage: Message = {
                                      id: Date.now().toString(),
                                      text: currentLanguage.code === 'sv' 
                                        ? '✅ **Fantastiskt val!**\n\nJag öppnar vår bokningskalender för dig nu där du kan välja en tid som passar dig perfekt.\n\n🎯 **I kalendern kan du:**\n• Se alla tillgängliga tider\n• Välja mellan fysiskt möte i Jönköping eller videomöte\n• Lägga till dina specifika frågor och behov\n• Få omedelbar bekräftelse\n\n⏰ **Stefan ser fram emot att träffa dig och diskutera hur vi kan hjälpa ditt företag växa!**'
                                        : '✅ **Fantastic choice!**\n\nI\'m opening our booking calendar for you now where you can choose a time that suits you perfectly.\n\n🎯 **In the calendar you can:**\n• See all available times\n• Choose between in-person meeting in Jönköping or video meeting\n• Add your specific questions and needs\n• Get immediate confirmation\n\n⏰ **Stefan looks forward to meeting you and discussing how we can help your business grow!**',
                                      isBot: true,
                                      timestamp: new Date(),
                                      confidence: 1.0,
                                      messageType: 'text'
                                    };
                                    setTimeout(() => {
                                      setMessages(prev => [...prev, confirmMessage]);
                                    }, 200);
                                  }}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  {currentLanguage.code === 'sv' ? '✅ Ja' : '✅ Yes'}
                                </button>
                                <button
                                  onClick={() => {
                                    // Add "no" response message
                                    const noMessage: Message = {
                                      id: Date.now().toString(),
                                      text: currentLanguage.code === 'sv' 
                                        ? '👍 **Absolut inga problem!**\n\nJag förstår att timing är viktigt och du kanske vill veta mer först innan du bokar en konsultation.\n\n💡 **Jag kan hjälpa dig med:**\n• Detaljerade frågor om våra tjänster och priser\n• Tekniska specifikationer och funktioner\n• Exempel på tidigare projekt och resultat\n• Jämförelser mellan olika paketlösningar\n• Information om projektprocesser och leveranstider\n\n🤖 **Jag är här 24/7 och du kan alltid komma tillbaka för att boka när du känner dig redo. Vad vill du veta mer om?**'
                                        : '👍 **Absolutely no problem!**\n\nI understand that timing is important and you might want to know more first before booking a consultation.\n\n💡 **I can help you with:**\n• Detailed questions about our services and pricing\n• Technical specifications and features\n• Examples of previous projects and results\n• Comparisons between different package solutions\n• Information about project processes and delivery times\n\n🤖 **I\'m here 24/7 and you can always come back to book when you feel ready. What would you like to know more about?**',
                                      isBot: true,
                                      timestamp: new Date(),
                                      confidence: 1.0,
                                      messageType: 'text'
                                    };
                                    setTimeout(() => {
                                      setMessages(prev => [...prev, noMessage]);
                                    }, 200);
                                  }}
                                  className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  {currentLanguage.code === 'sv' ? '❌ Nej tack' : '❌ No thanks'}
                                </button>
                              </div>
                            )}
                            
                            <button
                              onClick={() => handleCopyMessage(message.text)}
                              className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-all duration-200 group"
                              title="Copy message"
                            >
                              <Copy size={12} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, true)}
                              className={`p-1 rounded-md transition-all duration-200 ${
                                message.helpful === true 
                                  ? 'text-green-600 bg-green-50' 
                                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp size={12} />
                            </button>
                            <button
                              onClick={() => handleMessageFeedback(message.id, false)}
                              className={`p-1 rounded-md transition-all duration-200 ${
                                message.helpful === false 
                                  ? 'text-red-600 bg-red-50' 
                                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Premium typing indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-md">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm text-gray-600 ml-2">Axie is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Premium Input Area */}
          {!isBookingModalOpen && !isMinimized && (
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 shadow-lg">
              <div>
                {/* Quick Actions */}
                {showQuickActions && (
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                      <Zap size={14} className="mr-1 text-blue-500" />
                      {currentLanguage.code === 'sv' ? 'Populära Frågor - Klicka för snabba svar' : 'Popular Questions - Click for quick answers'}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickAction('pricing')}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">💰</span>
                        <span>{currentLanguage.code === 'sv' ? 'Priser & Paket' : 'Pricing & Packages'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('website')}
                        className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">🌐</span>
                        <span>{currentLanguage.code === 'sv' ? 'Webbplatser' : 'Websites'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('ecommerce')}
                        className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">🛒</span>
                        <span>{currentLanguage.code === 'sv' ? 'Webshoppar' : 'Webshops'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('apps')}
                        className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">📱</span>
                        <span>{currentLanguage.code === 'sv' ? 'Mobilappar' : 'Mobile Apps'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('booking')}
                        className="bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 text-pink-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">📅</span>
                        <span>{currentLanguage.code === 'sv' ? 'Bokningssystem' : 'Booking Systems'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleQuickAction('support')}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 group"
                      >
                        <span className="text-sm">🛠️</span>
                        <span>{currentLanguage.code === 'sv' ? 'Support & Hjälp' : 'Support & Help'}</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Premium Input */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={currentLanguage.code === 'sv' ? 'Ställ en detaljerad fråga om våra digitala lösningar...' : 'Ask a detailed question about our digital solutions...'}
                      className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm"
                      disabled={isTyping}
                      maxLength={500}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MessageSquare size={16} />
                    </div>
                  </div>
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl touch-manipulation group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </div>
                
                {/* Contact options */}
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <a 
                    href="mailto:stefan@axiestudio.se"
                    className="flex items-center space-x-2 hover:text-blue-600 transition-colors group"
                  >
                    <Mail size={12} className="group-hover:scale-110 transition-transform" />
                    <span>{currentLanguage.code === 'sv' ? 'E-post: stefan@axiestudio.se' : 'Email: stefan@axiestudio.se'}</span>
                  </a>
                  <a 
                    href="tel:+46735132620"
                    className="flex items-center space-x-2 hover:text-green-600 transition-colors group"
                  >
                    <Phone size={12} className="group-hover:scale-110 transition-transform" />
                    <span>{currentLanguage.code === 'sv' ? 'Telefon: +46 735 132 620' : 'Phone: +46 735 132 620'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Premium Booking Modal */}
          <AnimatePresence>
            {isBookingModalOpen && (
              <motion.div
                className="absolute inset-0 bg-white flex flex-col z-50"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Premium Booking Header */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-6 flex-shrink-0 shadow-xl relative overflow-hidden">
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                        <Calendar className="text-white" size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">
                          {currentLanguage.code === 'sv' ? 'Boka Din Kostnadsfria Konsultation' : 'Book Your Free Consultation'}
                        </h2>
                        <p className="text-white/90 text-lg">
                          {currentLanguage.code === 'sv' ? 'Välj en tid som passar dig perfekt - helt kostnadsfritt och utan förpliktelser' : 'Choose a time that suits you perfectly - completely free and without obligations'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCloseBooking}
                      className="bg-white/20 hover:bg-red-500/80 p-3 rounded-2xl transition-all duration-300 touch-manipulation min-w-[52px] min-h-[52px] flex items-center justify-center backdrop-blur-sm border border-white/30 group"
                    >
                      <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                  
                  {/* Premium Features */}
                  <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30">
                      <Clock size={20} className="text-white" />
                      <div>
                        <div className="text-white font-semibold">{currentLanguage.code === 'sv' ? '30-60 minuter' : '30-60 minutes'}</div>
                        <div className="text-white/80 text-sm">{currentLanguage.code === 'sv' ? 'Personlig genomgång av dina behov' : 'Personal review of your needs'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30">
                      <Sparkles size={20} className="text-white" />
                      <div>
                        <div className="text-white font-semibold">{currentLanguage.code === 'sv' ? '100% Kostnadsfritt' : '100% Free'}</div>
                        <div className="text-white/80 text-sm">{currentLanguage.code === 'sv' ? 'Inga dolda kostnader eller förpliktelser' : 'No hidden costs or obligations'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30">
                      <Brain size={20} className="text-white" />
                      <div>
                        <div className="text-white font-semibold">{currentLanguage.code === 'sv' ? 'Stefan Lindström' : 'Stefan Lindström'}</div>
                        <div className="text-white/80 text-sm">{currentLanguage.code === 'sv' ? 'Grundare & AI-expert' : 'Founder & AI expert'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Premium Booking Content */}
                <div className="flex-1 bg-white overflow-hidden relative">
                  {/* Loading State */}
                  {isBookingLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 z-10">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-6"></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {currentLanguage.code === 'sv' ? 'Laddar din personliga bokningskalender...' : 'Loading your personal booking calendar...'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {currentLanguage.code === 'sv' ? 'Förbereder din premium bokningsupplevelse med alla tillgängliga tider...' : 'Preparing your premium booking experience with all available times...'}
                        </p>
                        <div className="mt-4 flex items-center justify-center space-x-2">
                          <CheckCircle className="text-green-500" size={16} />
                          <span className="text-sm text-gray-600">{currentLanguage.code === 'sv' ? 'Säker och krypterad bokningsprocess' : 'Secure and encrypted booking process'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Google Calendar Iframe */}
                  <iframe
                    src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0QR3uRxVB7rb4ZHqJ1qYmz-T0e2CFtV5MYekvGDq1qyWxsV_Av3nP3zEGk0DrH2HqpTLoXuK0h"
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    title={currentLanguage.code === 'sv' ? 'Boka din kostnadsfria konsultation med Stefan' : 'Book your free consultation with Stefan'}
                    style={{
                      minHeight: '500px',
                      background: 'white'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;