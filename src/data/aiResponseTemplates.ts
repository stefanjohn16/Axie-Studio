// AI Response Templates - Structured response patterns for different scenarios
export interface ResponseTemplate {
  id: string;
  name: string;
  category: string;
  pattern: string;
  variables: string[];
  examples: {
    sv: string;
    en: string;
  };
}

export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  {
    id: 'pricing_basic',
    name: 'Basic Pricing Response',
    category: 'pricing',
    pattern: '💰 **{service_name}** börjar från {price} {currency} startavgift plus {monthly_price} {currency}/månad.\n\n✨ **Vad som ingår:**\n{features}\n\n🎯 **Nästa steg:** {call_to_action}',
    variables: ['service_name', 'price', 'currency', 'monthly_price', 'features', 'call_to_action'],
    examples: {
      sv: '💰 **Webbplats** börjar från 8 995 kr startavgift plus 495 kr/månad.\n\n✨ **Vad som ingår:**\n• Responsiv design\n• SEO-optimering\n• Hosting och support\n\n🎯 **Nästa steg:** Vill du boka en kostnadsfri konsultation?',
      en: '💰 **Website** starts from 8,995 SEK setup fee plus 495 SEK/month.\n\n✨ **What\'s included:**\n• Responsive design\n• SEO optimization\n• Hosting and support\n\n🎯 **Next step:** Would you like to book a free consultation?'
    }
  },
  {
    id: 'service_overview',
    name: 'Service Overview Response',
    category: 'information',
    pattern: '🌟 **{service_name}** - {service_description}\n\n🚀 **Huvudfunktioner:**\n{key_features}\n\n💡 **Perfekt för:** {target_audience}\n\n📞 **Vill du veta mer?** {contact_action}',
    variables: ['service_name', 'service_description', 'key_features', 'target_audience', 'contact_action'],
    examples: {
      sv: '🌟 **Bokningssystem** - Intelligent automatisering för din verksamhet\n\n🚀 **Huvudfunktioner:**\n• Smart schemaläggning\n• Automatiska påminnelser\n• Betalningsintegration\n\n💡 **Perfekt för:** Vårdcentraler, frisörer, konsulter\n\n📞 **Vill du veta mer?** Boka en demo idag!',
      en: '🌟 **Booking System** - Intelligent automation for your business\n\n🚀 **Key features:**\n• Smart scheduling\n• Automatic reminders\n• Payment integration\n\n💡 **Perfect for:** Healthcare, salons, consultants\n\n📞 **Want to know more?** Book a demo today!'
    }
  },
  {
    id: 'consultation_offer',
    name: 'Consultation Offer',
    category: 'booking',
    pattern: '☕ **Kostnadsfri konsultation med {expert_name}**\n\n🎯 **Vad vi går igenom:**\n{consultation_topics}\n\n⏰ **Detaljer:**\n• {duration} minuter\n• {format}\n• Helt kostnadsfritt\n\n✨ {booking_action}',
    variables: ['expert_name', 'consultation_topics', 'duration', 'format', 'booking_action'],
    examples: {
      sv: '☕ **Kostnadsfri konsultation med Stefan**\n\n🎯 **Vad vi går igenom:**\n• Dina specifika behov\n• Lämplig teknisk lösning\n• Tidsplan och budget\n\n⏰ **Detaljer:**\n• 30-60 minuter\n• Fysiskt eller digitalt\n• Helt kostnadsfritt\n\n✨ Jag öppnar bokningskalendern för dig nu!',
      en: '☕ **Free consultation with Stefan**\n\n🎯 **What we\'ll cover:**\n• Your specific needs\n• Suitable technical solution\n• Timeline and budget\n\n⏰ **Details:**\n• 30-60 minutes\n• In-person or digital\n• Completely free\n\n✨ I\'m opening the booking calendar for you now!'
    }
  },
  {
    id: 'feature_comparison',
    name: 'Feature Comparison',
    category: 'comparison',
    pattern: '📊 **Jämförelse: {option_a} vs {option_b}**\n\n{comparison_table}\n\n💡 **Min rekommendation:** {recommendation}\n\n🤔 **Osäker?** {help_offer}',
    variables: ['option_a', 'option_b', 'comparison_table', 'recommendation', 'help_offer'],
    examples: {
      sv: '📊 **Jämförelse: Webbplats vs E-handel**\n\n**Webbplats (8 995 kr):**\n✅ Professionell design\n✅ SEO-optimering\n❌ Ingen webshop\n\n**E-handel (10 995 kr):**\n✅ Allt ovan\n✅ Komplett webshop\n✅ Betalningsintegration\n\n💡 **Min rekommendation:** E-handel om du planerar att sälja produkter\n\n🤔 **Osäker?** Låt oss diskutera dina behov i en konsultation!',
      en: '📊 **Comparison: Website vs E-commerce**\n\n**Website (8,995 SEK):**\n✅ Professional design\n✅ SEO optimization\n❌ No webshop\n\n**E-commerce (10,995 SEK):**\n✅ Everything above\n✅ Complete webshop\n✅ Payment integration\n\n💡 **My recommendation:** E-commerce if you plan to sell products\n\n🤔 **Unsure?** Let\'s discuss your needs in a consultation!'
    }
  },
  {
    id: 'problem_solution',
    name: 'Problem-Solution Response',
    category: 'solution',
    pattern: '🎯 **Jag förstår ditt problem:** {problem_summary}\n\n💡 **Vår lösning:**\n{solution_description}\n\n🚀 **Så här hjälper det dig:**\n{benefits}\n\n📈 **Resultat:** {expected_outcomes}\n\n🔥 **Redo att lösa detta?** {action_step}',
    variables: ['problem_summary', 'solution_description', 'benefits', 'expected_outcomes', 'action_step'],
    examples: {
      sv: '🎯 **Jag förstår ditt problem:** Du förlorar kunder på grund av manuell bokningshantering\n\n💡 **Vår lösning:**\nIntelligent bokningssystem som automatiserar hela processen\n\n🚀 **Så här hjälper det dig:**\n• Kunder bokar 24/7 online\n• Automatiska påminnelser minskar no-shows\n• Mer tid för ditt kärnarbete\n\n📈 **Resultat:** 80% färre missade bokningar, 3x fler bokningar\n\n🔥 **Redo att lösa detta?** Låt oss boka en demo!',
      en: '🎯 **I understand your problem:** You\'re losing customers due to manual booking management\n\n💡 **Our solution:**\nIntelligent booking system that automates the entire process\n\n🚀 **How this helps you:**\n• Customers book 24/7 online\n• Automatic reminders reduce no-shows\n• More time for your core work\n\n📈 **Results:** 80% fewer missed bookings, 3x more bookings\n\n🔥 **Ready to solve this?** Let\'s book a demo!'
    }
  }
];

export class ResponseTemplateEngine {
  private templates: Map<string, ResponseTemplate>;

  constructor() {
    this.templates = new Map();
    RESPONSE_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  public generateResponse(
    templateId: string, 
    variables: Record<string, string>, 
    language: 'sv' | 'en' = 'sv'
  ): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let response = template.pattern;

    // Replace variables in the pattern
    template.variables.forEach(variable => {
      const value = variables[variable] || `{${variable}}`;
      response = response.replace(new RegExp(`{${variable}}`, 'g'), value);
    });

    return response;
  }

  public getTemplatesByCategory(category: string): ResponseTemplate[] {
    return RESPONSE_TEMPLATES.filter(template => template.category === category);
  }

  public getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  public getTemplate(templateId: string): ResponseTemplate | undefined {
    return this.templates.get(templateId);
  }
}

// Pre-configured responses for common scenarios
export const QUICK_RESPONSES = {
  sv: {
    pricing_request: {
      templateId: 'pricing_basic',
      variables: {
        service_name: 'Våra digitala lösningar',
        price: '8 995',
        currency: 'kr',
        monthly_price: '495',
        features: '• Professionell design\n• SEO-optimering\n• Hosting och support\n• 24/7 övervakning',
        call_to_action: 'Vill du boka en kostnadsfri konsultation för att diskutera dina specifika behov?'
      }
    },
    consultation_offer: {
      templateId: 'consultation_offer',
      variables: {
        expert_name: 'Stefan Lindström',
        consultation_topics: '• Dina specifika behov och mål\n• Lämplig teknisk lösning\n• Tidsplan och implementation\n• Kostnadsfri rådgivning',
        duration: '30-60',
        format: 'Fysiskt i Jönköping eller digitalt',
        booking_action: 'Jag öppnar vårt bokningssystem för dig nu!'
      }
    }
  },
  en: {
    pricing_request: {
      templateId: 'pricing_basic',
      variables: {
        service_name: 'Our digital solutions',
        price: '8,995',
        currency: 'SEK',
        monthly_price: '495',
        features: '• Professional design\n• SEO optimization\n• Hosting and support\n• 24/7 monitoring',
        call_to_action: 'Would you like to book a free consultation to discuss your specific needs?'
      }
    },
    consultation_offer: {
      templateId: 'consultation_offer',
      variables: {
        expert_name: 'Stefan Lindström',
        consultation_topics: '• Your specific needs and goals\n• Suitable technical solution\n• Timeline and implementation\n• Free expert advice',
        duration: '30-60',
        format: 'In-person in Jönköping or digital',
        booking_action: 'I\'m opening our booking system for you now!'
      }
    }
  }
};