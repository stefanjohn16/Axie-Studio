/// <reference types="vite/client" />

declare global {
  interface Window {
    trackAIInteraction?: (action: string, category: string) => void;
  }
}

export {};