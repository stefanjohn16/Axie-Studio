// AI Conversation Manager - Handles conversation flow and context
import { AIPersonality, AXIE_PERSONALITY } from './aiPersonality';
import { findBestMatch, recognizeIntent, logInteraction } from './aiKnowledge';

export interface ConversationContext {
  sessionId: string;
  messageHistory: ConversationMessage[];
  userProfile: UserProfile;
  currentTopic: string;
  conversationStage: ConversationStage;
  language: 'sv' | 'en';
  lastInteraction: Date;
}

export interface ConversationMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  intent?: string;
  confidence?: number;
  topic?: string;
}

export interface UserProfile {
  businessType?: string;
  interests: string[];
  previousQuestions: string[];
  preferredLanguage: 'sv' | 'en';
  engagementLevel: 'low' | 'medium' | 'high';
  hasBookedConsultation: boolean;
}

export type ConversationStage = 
  | 'greeting' 
  | 'discovery' 
  | 'information_sharing' 
  | 'solution_presentation' 
  | 'objection_handling' 
  | 'closing' 
  | 'follow_up';

export class ConversationManager {
  private context: ConversationContext;
  private personality: AIPersonality;

  constructor(language: 'sv' | 'en' = 'sv') {
    this.personality = AXIE_PERSONALITY;
    this.context = this.initializeContext(language);
  }

  private initializeContext(language: 'sv' | 'en'): ConversationContext {
    return {
      sessionId: this.generateSessionId(),
      messageHistory: [],
      userProfile: {
        interests: [],
        previousQuestions: [],
        preferredLanguage: language,
        engagementLevel: 'medium',
        hasBookedConsultation: false
      },
      currentTopic: 'general',
      conversationStage: 'greeting',
      language,
      lastInteraction: new Date()
    };
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public async processMessage(userInput: string): Promise<string> {
    // Add user message to history
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      text: userInput,
      isBot: false,
      timestamp: new Date()
    };

    this.context.messageHistory.push(userMessage);

    // Analyze user input
    const intent = recognizeIntent(userInput);
    const topic = this.extractTopic(userInput);
    
    userMessage.intent = intent;
    userMessage.topic = topic;

    // Update conversation context
    this.updateContext(userInput, intent, topic);

    // Generate response
    const response = await this.generateResponse(userInput, intent, topic);

    // Add bot response to history
    const botMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      isBot: true,
      timestamp: new Date(),
      intent: intent,
      topic: topic
    };

    this.context.messageHistory.push(botMessage);

    // Log interaction
    logInteraction(userInput, response, this.context.language, intent);

    return response;
  }

  private extractTopic(input: string): string {
    const topicKeywords = {
      'pricing': ['pris', 'kostnad', 'price', 'cost', 'kostar', 'betala'],
      'website': ['webbplats', 'website', 'hemsida', 'webb'],
      'booking': ['bokningssystem', 'booking', 'boka', 'schema'],
      'ecommerce': ['e-handel', 'webshop', 'shop', 'butik'],
      'app': ['mobilapp', 'app', 'applikation'],
      'contact': ['kontakt', 'contact', 'träffa', 'möte'],
      'support': ['hjälp', 'support', 'problem', 'fel']
    };

    const lowerInput = input.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return topic;
      }
    }

    return 'general';
  }

  private updateContext(input: string, intent: string, topic: string): void {
    // Update current topic
    this.context.currentTopic = topic;

    // Update user profile
    if (!this.context.userProfile.interests.includes(topic)) {
      this.context.userProfile.interests.push(topic);
    }

    this.context.userProfile.previousQuestions.push(input);

    // Update conversation stage
    this.context.conversationStage = this.determineConversationStage(intent, topic);

    // Update engagement level
    this.updateEngagementLevel();

    this.context.lastInteraction = new Date();
  }

  private determineConversationStage(intent: string, topic: string): ConversationStage {
    const messageCount = this.context.messageHistory.length;

    if (messageCount <= 2) return 'greeting';
    if (intent === 'booking_request') return 'closing';
    if (intent === 'pricing_inquiry') return 'solution_presentation';
    if (topic === 'contact') return 'closing';
    if (messageCount > 6) return 'follow_up';
    if (messageCount > 4) return 'objection_handling';
    if (messageCount > 2) return 'information_sharing';
    
    return 'discovery';
  }

  private updateEngagementLevel(): void {
    const messageCount = this.context.messageHistory.filter(m => !m.isBot).length;
    const topicVariety = new Set(this.context.userProfile.interests).size;

    if (messageCount >= 5 || topicVariety >= 3) {
      this.context.userProfile.engagementLevel = 'high';
    } else if (messageCount >= 3 || topicVariety >= 2) {
      this.context.userProfile.engagementLevel = 'medium';
    } else {
      this.context.userProfile.engagementLevel = 'low';
    }
  }

  private async generateResponse(input: string, intent: string, topic: string): Promise<string> {
    // Try to get response from knowledge base first
    const knowledgeResponse = findBestMatch(input, this.context.language);
    
    if (knowledgeResponse) {
      return this.enhanceResponse(knowledgeResponse, intent, topic);
    }

    // Generate contextual response based on conversation stage
    return this.generateContextualResponse(input, intent, topic);
  }

  private enhanceResponse(baseResponse: string, intent: string, topic: string): string {
    // Add personality touches based on conversation context
    let enhanced = baseResponse;

    // Add stage-appropriate elements
    if (this.context.conversationStage === 'greeting') {
      enhanced = this.addGreetingElements(enhanced);
    } else if (this.context.conversationStage === 'closing') {
      enhanced = this.addClosingElements(enhanced);
    }

    // Add follow-up questions based on engagement
    if (this.context.userProfile.engagementLevel === 'high') {
      enhanced = this.addAdvancedFollowUp(enhanced, topic);
    }

    return enhanced;
  }

  private generateContextualResponse(input: string, intent: string, topic: string): string {
    const responses = {
      sv: {
        general: "Jag förstår din fråga. Låt mig hjälpa dig med information om våra digitala lösningar. Vad är du mest intresserad av - webbplatser, bokningssystem, e-handel eller mobilappar?",
        pricing: "Våra priser varierar beroende på lösning. Kan du berätta mer om vad du letar efter så kan jag ge dig exakt prisinformation?",
        technical: "Det låter som en teknisk fråga. Vill du att jag bokar en konsultation med vår tekniska expert Stefan för att diskutera detta mer detaljerat?"
      },
      en: {
        general: "I understand your question. Let me help you with information about our digital solutions. What are you most interested in - websites, booking systems, e-commerce, or mobile apps?",
        pricing: "Our prices vary depending on the solution. Can you tell me more about what you're looking for so I can give you exact pricing information?",
        technical: "That sounds like a technical question. Would you like me to book a consultation with our technical expert Stefan to discuss this in more detail?"
      }
    };

    const lang = this.context.language;
    
    if (intent === 'pricing_inquiry') {
      return responses[lang].pricing;
    } else if (topic === 'technical') {
      return responses[lang].technical;
    }

    return responses[lang].general;
  }

  private addGreetingElements(response: string): string {
    const greetings = this.personality.responsePatterns.greeting;
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    if (!response.includes('Hej') && !response.includes('Hi')) {
      return `${greeting}\n\n${response}`;
    }
    
    return response;
  }

  private addClosingElements(response: string): string {
    const closings = this.personality.responsePatterns.closing;
    const closing = closings[Math.floor(Math.random() * closings.length)];
    
    return `${response}\n\n${closing}`;
  }

  private addAdvancedFollowUp(response: string, topic: string): string {
    const followUps = {
      sv: {
        pricing: "Vill du också veta om våra paketlösningar som kan spara pengar?",
        website: "Är du intresserad av att se exempel på webbplatser vi skapat?",
        booking: "Skulle du vilja se en demo av vårt bokningssystem?",
        ecommerce: "Vill du veta mer om våra marknadsföringsverktyg för e-handel?"
      },
      en: {
        pricing: "Would you also like to know about our package solutions that can save money?",
        website: "Are you interested in seeing examples of websites we've created?",
        booking: "Would you like to see a demo of our booking system?",
        ecommerce: "Would you like to know more about our marketing tools for e-commerce?"
      }
    };

    const lang = this.context.language;
    const followUp = followUps[lang][topic as keyof typeof followUps[typeof lang]];
    
    if (followUp) {
      return `${response}\n\n💡 ${followUp}`;
    }

    return response;
  }

  public getConversationSummary(): string {
    const interests = this.context.userProfile.interests.join(', ');
    const messageCount = this.context.messageHistory.filter(m => !m.isBot).length;
    
    return `Session: ${this.context.sessionId} | Interests: ${interests} | Messages: ${messageCount} | Stage: ${this.context.conversationStage}`;
  }

  public resetConversation(): void {
    this.context = this.initializeContext(this.context.language);
  }

  public getContext(): ConversationContext {
    return { ...this.context };
  }
}